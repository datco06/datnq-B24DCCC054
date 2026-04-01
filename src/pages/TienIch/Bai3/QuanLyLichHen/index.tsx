import React, { useEffect, useMemo, useState } from 'react';
import {
	Button,
	Card,
	Col,
	DatePicker,
	Form,
	Input,
	Modal,
	Popconfirm,
	Rate,
	Row,
	Select,
	Space,
	Table,
	Tag,
	TimePicker,
	Typography,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs, { type Dayjs } from 'dayjs';
import type { Appointment, AppointmentStatus, Feedback, Service, Staff } from '@/pages/TienIch/shared/types';
import { loadAppointments, loadServices, loadStaffs, saveAppointments } from '@/pages/TienIch/shared/storage';
import { loadFeedbacks, saveFeedbacks } from '@/pages/TienIch/shared/feedbackStorage';

const statusColorMap: Record<AppointmentStatus, string> = {
	pending: 'default',
	approved: 'blue',
	done: 'green',
	cancelled: 'red',
};

const statusLabel: Record<AppointmentStatus, string> = {
	pending: 'Chờ duyệt',
	approved: 'Đã xác nhận',
	done: 'Hoàn thành',
	cancelled: 'Đã hủy',
};

const combineDateTime = (date: Dayjs, range: [Dayjs, Dayjs]) => {
	const start = date.clone().hour(range[0].hour()).minute(range[0].minute()).second(0);
	const end = date.clone().hour(range[1].hour()).minute(range[1].minute()).second(0);
	return { start: start.toISOString(), end: end.toISOString() };
};

const isWithinSchedule = (staff: Staff | undefined, date: Dayjs, range: [Dayjs, Dayjs]) => {
	if (!staff) return false;
	const day = date.day();
	const slot = staff.schedule.find((item) => item.dayOfWeek === day);
	if (!slot) return false;
	const [start, end] = range;
	return start.format('HH:mm') >= slot.start && end.format('HH:mm') <= slot.end;
};

const hasConflict = (newStart: string, newEnd: string, staffId: string, list: Appointment[], excludeId?: string) => {
	const start = dayjs(newStart).valueOf();
	const end = dayjs(newEnd).valueOf();
	return list.some((item) => {
		if (excludeId && item.id === excludeId) return false;
		if (item.staffId !== staffId) return false;
		const itemStart = dayjs(item.start).valueOf();
		const itemEnd = dayjs(item.end).valueOf();
		return !(end <= itemStart || start >= itemEnd);
	});
};

const countAppointmentsOnDate = (staffId: string, date: Dayjs, list: Appointment[]) =>
	list.filter(
		(item) => item.staffId === staffId && item.status !== 'cancelled' && dayjs(item.start).isSame(date, 'day'),
	).length;

const QuanLyLichHen: React.FC = () => {
	const [services] = useState<Service[]>(() => loadServices());
	const [staffs] = useState<Staff[]>(() => loadStaffs());
	const [appointments, setAppointments] = useState<Appointment[]>(() => loadAppointments());
	const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => loadFeedbacks());

	const [filters, setFilters] = useState<{ staffId?: string; status?: AppointmentStatus; dateRange?: [Dayjs, Dayjs] }>(
		{},
	);
	const [form] = Form.useForm();
	const [statusModal, setStatusModal] = useState<{ visible: boolean; appointment?: Appointment }>({ visible: false });
	const [feedbackModal, setFeedbackModal] = useState<{ visible: boolean; appointment?: Appointment }>({
		visible: false,
	});
	const [feedbackForm] = Form.useForm<{ rating: number; comment: string }>();

	useEffect(() => {
		saveAppointments(appointments);
	}, [appointments]);

	useEffect(() => {
		saveFeedbacks(feedbacks);
	}, [feedbacks]);

	const filteredAppointments = useMemo(() => {
		return appointments.filter((item) => {
			if (filters.staffId && item.staffId !== filters.staffId) return false;
			if (filters.status && item.status !== filters.status) return false;
			if (filters.dateRange) {
				const [start, end] = filters.dateRange;
				const date = dayjs(item.start);
				if (date.isBefore(start.startOf('day')) || date.isAfter(end.endOf('day'))) return false;
			}
			return true;
		});
	}, [appointments, filters]);

	const handleCreateAppointment = () => {
		form
			.validateFields()
			.then((values) => {
				const { customerName, customerPhone, serviceId, staffId, date, timeStart, notes } = values;
				const service = services.find((item) => item.id === serviceId);
				if (!service) {
					message.error('Vui lòng chọn dịch vụ hợp lệ');
					return;
				}
				const rangeStart: Dayjs = timeStart;
				const rangeEnd = timeStart.clone().add(service.durationMinutes, 'minute');
				const staff = staffs.find((item) => item.id === staffId);
				if (!isWithinSchedule(staff, date, [rangeStart, rangeEnd])) {
					message.error('Nhân viên không làm việc trong khung giờ này');
					return;
				}
				const slot = staff?.schedule.find((item) => item.dayOfWeek === date.day());
				if (slot) {
					const count = countAppointmentsOnDate(staffId, date, appointments);
					if (count >= slot.capacityPerDay) {
						message.error('Nhân viên đã đạt số khách tối đa trong ngày này');
						return;
					}
				}
				const { start, end } = combineDateTime(date, [rangeStart, rangeEnd]);
				if (dayjs(start).isBefore(dayjs())) {
					message.error('Không thể đặt lịch trong quá khứ');
					return;
				}
				if (hasConflict(start, end, staffId, appointments)) {
					message.error('Trùng lịch với lịch hẹn khác của nhân viên');
					return;
				}
				const payload: Appointment = {
					id: `apt-${Date.now()}`,
					customerName,
					customerPhone,
					serviceId,
					staffId,
					start,
					end,
					status: 'pending',
					notes,
				};
				setAppointments((prev) => [payload, ...prev]);
				form.resetFields();
				message.success('Đã tạo lịch hẹn');
			})
			.catch(() => {});
	};

	const openFeedbackModal = (appointment: Appointment) => {
		const existing = feedbacks.find((item) => item.appointmentId === appointment.id);
		setFeedbackModal({ visible: true, appointment });
		feedbackForm.setFieldsValue({
			rating: existing?.rating ?? 5,
			comment: existing?.comment ?? '',
		});
	};

	const updateStatus = (status: AppointmentStatus) => {
		if (!statusModal.appointment) return;
		setAppointments((prev) =>
			prev.map((item) => (item.id === statusModal.appointment?.id ? { ...item, status } : item)),
		);
		setStatusModal({ visible: false });
		message.success('Đã cập nhật trạng thái');
		if (status === 'done' && statusModal.appointment) {
			openFeedbackModal(statusModal.appointment);
		}
	};

	const submitFeedback = () => {
		feedbackForm.validateFields().then(({ rating, comment }) => {
			if (!feedbackModal.appointment) return;
			setFeedbacks((prev) => {
				const existingIndex = prev.findIndex((item) => item.appointmentId === feedbackModal.appointment!.id);
				const payload: Feedback = {
					id: existingIndex !== -1 ? prev[existingIndex].id : `fb-${Date.now()}`,
					appointmentId: feedbackModal.appointment!.id,
					staffId: feedbackModal.appointment!.staffId,
					serviceId: feedbackModal.appointment!.serviceId,
					customerName: feedbackModal.appointment!.customerName,
					rating,
					comment,
					createdAt: existingIndex !== -1 ? prev[existingIndex].createdAt : dayjs().toISOString(),
				};
				if (existingIndex !== -1) {
					const clone = [...prev];
					clone[existingIndex] = payload;
					return clone;
				}
				return [payload, ...prev];
			});
			message.success('Đã lưu đánh giá');
			setFeedbackModal({ visible: false });
			feedbackForm.resetFields();
		});
	};

	const deleteAppointment = (id: string) => {
		setAppointments((prev) => prev.filter((item) => item.id !== id));
	};

	const appointmentColumns: ColumnsType<Appointment> = [
		{ title: 'Khách hàng', dataIndex: 'customerName' },
		{ title: 'Điện thoại', dataIndex: 'customerPhone' },
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceId',
			render: (value) => services.find((svc) => svc.id === value)?.name ?? value,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'staffId',
			render: (value) => staffs.find((staff) => staff.id === value)?.name ?? value,
		},
		{
			title: 'Thời gian',
			render: (_, record) => (
				<span>
					{dayjs(record.start).format('DD/MM/YYYY HH:mm')} - {dayjs(record.end).format('HH:mm')}
				</span>
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (value: AppointmentStatus) => <Tag color={statusColorMap[value]}>{statusLabel[value]}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'notes',
			width: 220,
			render: (value: string) =>
				value ? (
					<span style={{ display: 'inline-block', maxWidth: 200 }} title={value}>
						{value.length > 60 ? `${value.slice(0, 57)}...` : value}
					</span>
				) : (
					<span>-</span>
				),
		},
		{
			title: 'Hành động',
			width: 220,
			render: (_, record) => (
				<Space size={8} wrap>
					<Button size='small' onClick={() => setStatusModal({ visible: true, appointment: record })}>
						Sửa
					</Button>
					<Popconfirm title='Xóa lịch hẹn?' onConfirm={() => deleteAppointment(record.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
					{record.status === 'done' && (
						<Button type='dashed' size='small' onClick={() => openFeedbackModal(record)}>
							{feedbacks.some((item) => item.appointmentId === record.id) ? 'Sửa đánh giá' : 'Đánh giá'}
						</Button>
					)}
				</Space>
			),
		},
	];

	return (
		<Row gutter={[24, 24]}>
			<Col xs={24} md={10}>
				<Card title='Đặt lịch hẹn mới'>
					<Form layout='vertical' form={form}>
						<Form.Item label='Tên khách hàng' name='customerName' rules={[{ required: true, message: 'Nhập tên' }]}>
							<Input />
						</Form.Item>
						<Form.Item label='Số điện thoại' name='customerPhone'>
							<Input />
						</Form.Item>
						<Form.Item label='Dịch vụ' name='serviceId' rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
							<Select placeholder='Chọn dịch vụ'>
								{services.map((service) => (
									<Select.Option key={service.id} value={service.id}>
										{service.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label='Nhân viên' name='staffId' rules={[{ required: true, message: 'Chọn nhân viên' }]}>
							<Select placeholder='Chọn nhân viên'>
								{staffs.map((staff) => (
									<Select.Option key={staff.id} value={staff.id}>
										{staff.name}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Ngày' name='date' rules={[{ required: true, message: 'Chọn ngày' }]}>
									<DatePicker
										style={{ width: '100%' }}
										disabledDate={(current) => current && current < dayjs().startOf('day')}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Giờ bắt đầu'
									name='timeStart'
									rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}
								>
									<TimePicker format='HH:mm' minuteStep={15} />
								</Form.Item>
								<Form.Item shouldUpdate noStyle>
									{() => {
										const serviceId = form.getFieldValue('serviceId');
										const start = form.getFieldValue('timeStart') as Dayjs | undefined;
										const service = services.find((svc) => svc.id === serviceId);
										if (!service || !start) return null;
										const end = start.clone().add(service.durationMinutes, 'minute');
										return (
											<Tag color='blue' style={{ marginTop: 4 }}>
												Dự kiến kết thúc: {end.format('HH:mm')} ({service.durationMinutes} phút)
											</Tag>
										);
									}}
								</Form.Item>
							</Col>
						</Row>
						<Form.Item label='Ghi chú' name='notes'>
							<Input.TextArea rows={3} />
						</Form.Item>
						<Button type='primary' block onClick={handleCreateAppointment}>
							Tạo lịch hẹn
						</Button>
					</Form>
				</Card>
			</Col>
			<Col xs={24} md={14}>
				<Card
					title='Danh sách lịch hẹn'
					extra={
						<Space>
							<Select
								allowClear
								placeholder='Nhân viên'
								style={{ width: 150 }}
								onChange={(value) => setFilters((prev) => ({ ...prev, staffId: value }))}
							>
								{staffs.map((staff) => (
									<Select.Option key={staff.id} value={staff.id}>
										{staff.name}
									</Select.Option>
								))}
							</Select>
							<Select
								allowClear
								placeholder='Trạng thái'
								style={{ width: 150 }}
								onChange={(value: AppointmentStatus | undefined) => setFilters((prev) => ({ ...prev, status: value }))}
							>
								{Object.entries(statusLabel).map(([key, label]) => (
									<Select.Option key={key} value={key}>
										{label}
									</Select.Option>
								))}
							</Select>
							<DatePicker.RangePicker
								onChange={(values) => setFilters((prev) => ({ ...prev, dateRange: values as any }))}
							/>
						</Space>
					}
				>
					<Table<Appointment>
						dataSource={filteredAppointments}
						columns={appointmentColumns}
						rowKey='id'
						pagination={{ pageSize: 6 }}
					/>
				</Card>
			</Col>

			<Modal
				title='Cập nhật trạng thái'
				visible={statusModal.visible}
				onCancel={() => setStatusModal({ visible: false })}
				footer={null}
				destroyOnClose
			>
				<Select
					value={statusModal.appointment?.status}
					style={{ width: '100%' }}
					onChange={(value: AppointmentStatus) => updateStatus(value)}
				>
					{Object.entries(statusLabel).map(([key, label]) => (
						<Select.Option key={key} value={key}>
							{label}
						</Select.Option>
					))}
				</Select>
			</Modal>

			<Modal
				title='Đánh giá dịch vụ'
				visible={feedbackModal.visible}
				onCancel={() => {
					setFeedbackModal({ visible: false });
					feedbackForm.resetFields();
				}}
				onOk={submitFeedback}
				okText='Lưu đánh giá'
				destroyOnClose
			>
				<Typography.Paragraph>
					<strong>Khách hàng:</strong> {feedbackModal.appointment?.customerName}
				</Typography.Paragraph>
				<Typography.Paragraph>
					<strong>Dịch vụ:</strong>{' '}
					{services.find((svc) => svc.id === feedbackModal.appointment?.serviceId)?.name ??
						feedbackModal.appointment?.serviceId}
				</Typography.Paragraph>
				<Form layout='vertical' form={feedbackForm}>
					<Form.Item label='Điểm đánh giá' name='rating' rules={[{ required: true, message: 'Chọn điểm' }]}>
						<Rate />
					</Form.Item>
					<Form.Item label='Nhận xét' name='comment' rules={[{ required: true, message: 'Nhập nhận xét' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default QuanLyLichHen;
