import React, { useEffect, useMemo, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	TimePicker,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import type { Feedback, Service, Staff, StaffScheduleSlot } from '@/pages/TienIch/shared/types';
import { loadServices, loadStaffs, saveServices, saveStaffs } from '@/pages/TienIch/shared/storage';
import { loadFeedbacks } from '@/pages/TienIch/shared/feedbackStorage';

const dayOfWeekOptions = [
	{ label: 'Chủ nhật', value: 0 },
	{ label: 'Thứ 2', value: 1 },
	{ label: 'Thứ 3', value: 2 },
	{ label: 'Thứ 4', value: 3 },
	{ label: 'Thứ 5', value: 4 },
	{ label: 'Thứ 6', value: 5 },
	{ label: 'Thứ 7', value: 6 },
];

const getDayLabel = (value: number) => dayOfWeekOptions.find((item) => item.value === value)?.label ?? 'N/A';

const formatSchedule = (schedule: StaffScheduleSlot[]) =>
	schedule
		.map((slot) => `${getDayLabel(slot.dayOfWeek)}: ${slot.start}-${slot.end} (${slot.capacityPerDay} khách)`)
		.join(' | ');

const QuanLyNhanVien: React.FC = () => {
	const [services, setServices] = useState<Service[]>(() => loadServices());
	const [staffs, setStaffs] = useState<Staff[]>(() => loadStaffs());
	const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => loadFeedbacks());

	const [staffModalOpen, setStaffModalOpen] = useState(false);
	const [serviceModalOpen, setServiceModalOpen] = useState(false);
	const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
	const [editingService, setEditingService] = useState<Service | null>(null);

	const [staffForm] = Form.useForm<Staff>();
	const [serviceForm] = Form.useForm<Service>();

	useEffect(() => {
		saveServices(services);
	}, [services]);

	useEffect(() => {
		saveStaffs(staffs);
	}, [staffs]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const syncFeedbacks = () => setFeedbacks(loadFeedbacks());
		window.addEventListener('storage', syncFeedbacks);
		return () => window.removeEventListener('storage', syncFeedbacks);
	}, []);

	const totalCapacity = useMemo(
		() => staffs.reduce((sum, staff) => sum + staff.schedule.reduce((cap, slot) => cap + slot.capacityPerDay, 0), 0),
		[staffs],
	);

	const ratingByStaff = useMemo(() => {
		const summary = new Map<string, { total: number; count: number }>();
		feedbacks.forEach((item) => {
			const entry = summary.get(item.staffId) ?? { total: 0, count: 0 };
			entry.total += item.rating;
			entry.count += 1;
			summary.set(item.staffId, entry);
		});
		return summary;
	}, [feedbacks]);

	const handleOpenStaffModal = (staff?: Staff) => {
		setEditingStaff(staff ?? null);
		if (staff) {
			staffForm.setFieldsValue({
				...staff,
				schedule: staff.schedule.map((slot) => ({
					dayOfWeek: slot.dayOfWeek,
					range: [dayjs(slot.start, 'HH:mm'), dayjs(slot.end, 'HH:mm')],
					capacityPerDay: slot.capacityPerDay,
				})),
			} as any);
		} else {
			staffForm.resetFields();
		}
		setStaffModalOpen(true);
	};

	const handleOpenServiceModal = (service?: Service) => {
		setEditingService(service ?? null);
		if (service) serviceForm.setFieldsValue(service);
		else serviceForm.resetFields();
		setServiceModalOpen(true);
	};

	const upsertStaff = () => {
		staffForm
			.validateFields()
			.then((values) => {
				const payload: Staff = {
					...(editingStaff ?? { id: `staff-${Date.now()}` }),
					name: values.name,
					phone: values.phone,
					email: values.email,
					services: values.services ?? [],
					schedule:
						values.schedule?.map((slot: any) => ({
							dayOfWeek: slot.dayOfWeek,
							start: slot.range[0].format('HH:mm'),
							end: slot.range[1].format('HH:mm'),
							capacityPerDay: slot.capacityPerDay,
						})) ?? [],
				};
				setStaffs((prev) => {
					const exist = prev.findIndex((item) => item.id === payload.id);
					if (exist !== -1) {
						const clone = [...prev];
						clone[exist] = payload;
						return clone;
					}
					return [payload, ...prev];
				});
				setStaffModalOpen(false);
				message.success(editingStaff ? 'Đã cập nhật nhân viên' : 'Đã thêm nhân viên');
			})
			.catch(() => {});
	};

	const upsertService = () => {
		serviceForm
			.validateFields()
			.then((values) => {
				const payload: Service = {
					...(editingService ?? { id: `svc-${Date.now()}` }),
					name: values.name,
					description: values.description,
					price: values.price,
					durationMinutes: values.durationMinutes,
				};
				setServices((prev) => {
					const exist = prev.findIndex((item) => item.id === payload.id);
					if (exist !== -1) {
						const clone = [...prev];
						clone[exist] = payload;
						return clone;
					}
					return [payload, ...prev];
				});
				setServiceModalOpen(false);
				message.success(editingService ? 'Đã cập nhật dịch vụ' : 'Đã thêm dịch vụ');
			})
			.catch(() => {});
	};

	const deleteStaff = (id: string) => {
		setStaffs((prev) => prev.filter((item) => item.id !== id));
	};

	const deleteService = (id: string) => {
		setServices((prev) => prev.filter((item) => item.id !== id));
		setStaffs((prev) =>
			prev.map((staff) => ({
				...staff,
				services: staff.services.filter((serviceId) => serviceId !== id),
			})),
		);
	};

	const staffColumns: ColumnsType<Staff> = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Dịch vụ phục vụ',
			dataIndex: 'services',
			render: (value: string[]) =>
				value.length ? (
					<Space wrap>
						{value.map((serviceId) => (
							<Tag key={serviceId}>{services.find((svc) => svc.id === serviceId)?.name ?? serviceId}</Tag>
						))}
					</Space>
				) : (
					<Tag color='default'>Chưa gán</Tag>
				),
		},
		{
			title: 'Lịch làm việc',
			render: (_, record) => (record.schedule.length ? formatSchedule(record.schedule) : 'Chưa cấu hình'),
		},
		{
			title: 'Đánh giá',
			render: (_, record) => {
				const rating = ratingByStaff.get(record.id);
				const count = rating?.count ?? record.reviewCount ?? 0;
				const avg =
					rating && rating.count
						? rating.total / rating.count
						: record.ratingAverage && record.reviewCount
						? record.ratingAverage
						: 0;
				return count > 0 ? (
					<Tag color='gold'>
						{avg.toFixed(1)} / 5 ({count} đánh giá)
					</Tag>
				) : (
					<Tag>Chưa có</Tag>
				);
			},
		},
		{
			title: 'Hành động',
			key: 'actions',
			render: (_, record) => (
				<Space>
					<Button size='small' onClick={() => handleOpenStaffModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa nhân viên này?' onConfirm={() => deleteStaff(record.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const serviceColumns: ColumnsType<Service> = [
		{ title: 'Tên dịch vụ', dataIndex: 'name' },
		{
			title: 'Giá (VND)',
			dataIndex: 'price',
			render: (value) => value.toLocaleString('vi-VN'),
		},
		{ title: 'Thời lượng (phút)', dataIndex: 'durationMinutes' },
		{
			title: 'Số nhân viên',
			render: (_, record) => staffs.filter((staff) => staff.services.includes(record.id)).length,
		},
		{
			title: 'Hành động',
			render: (_, record) => (
				<Space>
					<Button size='small' onClick={() => handleOpenServiceModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa dịch vụ này?' onConfirm={() => deleteService(record.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Row gutter={[24, 24]}>
			<Col xs={24} md={14}>
				<Card
					title='Nhân viên & lịch phục vụ'
					extra={
						<Space>
							<Tag color='blue'>Tổng nhân viên: {staffs.length}</Tag>
							<Tag color='purple'>Tổng sức chứa/tuần: {totalCapacity}</Tag>
							<Button type='primary' onClick={() => handleOpenStaffModal()}>
								Thêm nhân viên
							</Button>
						</Space>
					}
				>
					<Table<Staff> dataSource={staffs} columns={staffColumns} rowKey='id' pagination={{ pageSize: 5 }} />
				</Card>
			</Col>
			<Col xs={24} md={10}>
				<Card
					title='Dịch vụ'
					extra={
						<Button type='primary' onClick={() => handleOpenServiceModal()}>
							Thêm dịch vụ
						</Button>
					}
				>
					<Table<Service> dataSource={services} columns={serviceColumns} rowKey='id' pagination={{ pageSize: 5 }} />
				</Card>
			</Col>

			<Modal
				title={editingStaff ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
				visible={staffModalOpen}
				onCancel={() => setStaffModalOpen(false)}
				onOk={upsertStaff}
				okText={editingStaff ? 'Cập nhật' : 'Thêm mới'}
				destroyOnClose
				width={720}
			>
				<Form<Staff> layout='vertical' form={staffForm}>
					<Form.Item label='Tên nhân viên' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input placeholder='Nhập tên nhân viên' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Điện thoại' name='phone'>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Email' name='email'>
								<Input type='email' />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label='Dịch vụ đảm nhiệm' name='services'>
						<Select mode='multiple' placeholder='Chọn dịch vụ'>
							{services.map((service) => (
								<Select.Option key={service.id} value={service.id}>
									{service.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.List name='schedule'>
						{(fields, { add, remove }) => (
							<>
								<Space align='baseline' style={{ marginBottom: 8 }}>
									<strong>Lịch làm việc</strong>
									<Button type='dashed' onClick={() => add()} size='small'>
										Thêm khung giờ
									</Button>
								</Space>
								{fields.map((field) => (
									<Row key={field.key} gutter={16} style={{ marginBottom: 16 }}>
										<Col span={6}>
											<Form.Item
												{...field}
												name={[field.name, 'dayOfWeek']}
												fieldKey={[field.fieldKey!, 'dayOfWeek']}
												rules={[{ required: true, message: 'Chọn thứ' }]}
											>
												<Select placeholder='Thứ'>
													{dayOfWeekOptions.map((option) => (
														<Select.Option key={option.value} value={option.value}>
															{option.label}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
										</Col>
										<Col span={10}>
											<Form.Item
												name={[field.name, 'range']}
												fieldKey={[field.fieldKey!, 'range']}
												rules={[{ required: true, message: 'Chọn giờ' }]}
											>
												<TimePicker.RangePicker format='HH:mm' />
											</Form.Item>
										</Col>
										<Col span={6}>
											<Form.Item
												name={[field.name, 'capacityPerDay']}
												fieldKey={[field.fieldKey!, 'capacityPerDay']}
												rules={[{ required: true, message: 'Nhập số khách' }]}
											>
												<InputNumber min={1} placeholder='Khách/ngày' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={2}>
											<Button danger size='small' onClick={() => remove(field.name)}>
												Xóa
											</Button>
										</Col>
									</Row>
								))}
							</>
						)}
					</Form.List>
				</Form>
			</Modal>

			<Modal
				title={editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}
				visible={serviceModalOpen}
				onCancel={() => setServiceModalOpen(false)}
				onOk={upsertService}
				okText={editingService ? 'Cập nhật' : 'Thêm mới'}
				destroyOnClose
			>
				<Form<Service> layout='vertical' form={serviceForm}>
					<Form.Item label='Tên dịch vụ' name='name' rules={[{ required: true, message: 'Nhập tên dịch vụ' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item label='Giá (VND)' name='price' rules={[{ required: true, message: 'Nhập giá' }]}>
						<InputNumber
							min={0}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(value) => Number(value?.replace(/,/g, ''))}
							style={{ width: '100%' }}
						/>
					</Form.Item>
					<Form.Item
						label='Thời lượng (phút)'
						name='durationMinutes'
						rules={[{ required: true, message: 'Nhập thời lượng' }]}
					>
						<InputNumber min={10} step={5} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default QuanLyNhanVien;
