import React, { useEffect, useMemo, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	Modal,
	Rate,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import type { Feedback, Service, Staff } from '@/pages/TienIch/shared/types';
import { loadServices, loadStaffs } from '@/pages/TienIch/shared/storage';
import { loadFeedbacks, saveFeedbacks } from '@/pages/TienIch/shared/feedbackStorage';

const DanhGiaDichVu: React.FC = () => {
	const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => loadFeedbacks());
	const [staffs, setStaffs] = useState<Staff[]>(() => loadStaffs());
	const [services, setServices] = useState<Service[]>(() => loadServices());
	const [replyModal, setReplyModal] = useState<{ visible: boolean; feedback?: Feedback }>({ visible: false });
	const [filters, setFilters] = useState<{ staffId?: string; serviceId?: string }>({});
	const [replyForm] = Form.useForm<{ reply: string }>();

	useEffect(() => {
		saveFeedbacks(feedbacks);
	}, [feedbacks]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const syncData = () => {
			setStaffs(loadStaffs());
			setServices(loadServices());
		};
		window.addEventListener('storage', syncData);
		return () => window.removeEventListener('storage', syncData);
	}, []);

	const feedbackWithRefs = useMemo(() => {
		return feedbacks
			.filter((item) => {
				if (filters.staffId && item.staffId !== filters.staffId) return false;
				if (filters.serviceId && item.serviceId !== filters.serviceId) return false;
				return true;
			})
			.map((item) => ({
				...item,
				staffName: staffs.find((staff) => staff.id === item.staffId)?.name ?? item.staffId,
				serviceName: services.find((svc) => svc.id === item.serviceId)?.name ?? item.serviceId,
			}));
	}, [feedbacks, staffs, services, filters]);

	const avgRatingByStaff = useMemo(() => {
		const map = new Map<string, { total: number; count: number }>();
		feedbacks.forEach((item) => {
			const entry = map.get(item.staffId) ?? { total: 0, count: 0 };
			entry.total += item.rating;
			entry.count += 1;
			map.set(item.staffId, entry);
		});
		return staffs.map((staff) => {
			const entry = map.get(staff.id);
			return {
				staff,
				avg: entry ? entry.total / entry.count : 0,
				count: entry?.count ?? 0,
			};
		});
	}, [feedbacks, staffs]);

	const topStaff = useMemo(() => {
		return [...avgRatingByStaff]
			.filter((item) => item.count > 0)
			.sort((a, b) => b.avg - a.avg)
			.slice(0, 3);
	}, [avgRatingByStaff]);

	const columns: ColumnsType<
		Feedback & {
			staffName: string;
			serviceName: string;
		}
	> = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			width: 160,
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'serviceName',
			width: 160,
		},
		{
			title: 'Nhân viên',
			dataIndex: 'staffName',
			width: 160,
		},
		{
			title: 'Điểm',
			dataIndex: 'rating',
			render: (value) => <Rate disabled value={value} />,
			width: 150,
		},
		{
			title: 'Nhận xét',
			dataIndex: 'comment',
			width: 280,
			render: (text) => (
				<Typography.Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 0 }}>
					{text}
				</Typography.Paragraph>
			),
		},
		{
			title: 'Thời gian',
			dataIndex: 'createdAt',
			render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
			width: 170,
		},
		{
			title: 'Phản hồi',
			dataIndex: 'reply',
			render: (value: string) =>
				value ? <Tag color='green'>Đã phản hồi</Tag> : <Tag color='default'>Chưa phản hồi</Tag>,
			width: 140,
		},
		{
			title: 'Hành động',
			render: (_, record) => (
				<Button
					size='small'
					onClick={() => {
						setReplyModal({ visible: true, feedback: record });
						replyForm.setFieldsValue({ reply: record.reply });
					}}
				>
					{record.reply ? 'Cập nhật phản hồi' : 'Phản hồi'}
				</Button>
			),
		},
	];

	const submitReply = () => {
		replyForm.validateFields().then(({ reply }) => {
			if (!replyModal.feedback) return;
			setFeedbacks((prev) => prev.map((item) => (item.id === replyModal.feedback?.id ? { ...item, reply } : item)));
			setReplyModal({ visible: false });
			replyForm.resetFields();
		});
	};

	return (
		<Row gutter={[24, 24]}>
			<Col xs={24} md={8}>
				<Card title='Tổng quan đánh giá'>
					<Space direction='vertical' style={{ width: '100%' }} size='large'>
						<Statistic title='Tổng số phản hồi' value={feedbacks.length} valueStyle={{ fontWeight: 600 }} />
						<Space direction='vertical' style={{ width: '100%' }}>
							<Typography.Text strong>Top nhân viên</Typography.Text>
							{topStaff.length === 0 && <Typography.Text>Chưa có dữ liệu</Typography.Text>}
							{topStaff.map((item) => (
								<Card key={item.staff.id} size='small'>
									<Space direction='vertical'>
										<Typography.Text>{item.staff.name}</Typography.Text>
										<Rate disabled value={item.avg} allowHalf />
										<Typography.Text type='secondary'>{item.count} lượt đánh giá</Typography.Text>
									</Space>
								</Card>
							))}
						</Space>
					</Space>
				</Card>
			</Col>
			<Col xs={24} md={16}>
				<Card
					title='Danh sách đánh giá'
					extra={
						<Space>
							<Select
								allowClear
								placeholder='Lọc theo nhân viên'
								style={{ width: 180 }}
								onChange={(value) => setFilters((prev) => ({ ...prev, staffId: value }))}
							>
								{staffs.map((staff) => (
									<Select.Option value={staff.id} key={staff.id}>
										{staff.name}
									</Select.Option>
								))}
							</Select>
							<Select
								allowClear
								placeholder='Lọc theo dịch vụ'
								style={{ width: 180 }}
								onChange={(value) => setFilters((prev) => ({ ...prev, serviceId: value }))}
							>
								{services.map((service) => (
									<Select.Option value={service.id} key={service.id}>
										{service.name}
									</Select.Option>
								))}
							</Select>
						</Space>
					}
				>
					<Table
						dataSource={feedbackWithRefs}
						columns={columns}
						rowKey='id'
						scroll={{ x: 1000 }}
						pagination={{ pageSize: 5 }}
					/>
				</Card>
			</Col>

			<Modal
				title='Phản hồi khách hàng'
				visible={replyModal.visible}
				onCancel={() => {
					setReplyModal({ visible: false });
					replyForm.resetFields();
				}}
				onOk={submitReply}
				okText='Gửi phản hồi'
				cancelText='Đóng'
				destroyOnClose
			>
				<Typography.Paragraph>
					<strong>Khách hàng:</strong> {replyModal.feedback?.customerName}
				</Typography.Paragraph>
				<Typography.Paragraph>
					<strong>Nhận xét:</strong> {replyModal.feedback?.comment}
				</Typography.Paragraph>
				<Form layout='vertical' form={replyForm}>
					<Form.Item label='Nội dung phản hồi' name='reply' rules={[{ required: true, message: 'Nhập phản hồi' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default DanhGiaDichVu;
