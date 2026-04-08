import React, { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CalendarView from '../Lich/CalendarView';
import {
	Badge,
	Button,
	Card,
	Col,
	DatePicker,
	Dropdown,
	Form,
	Input,
	Menu,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';
import { history } from 'umi';
import { defaultTasks } from '../defaultTasks';
import type { TaskItem, TaskPriority, TaskStatus } from '../types';

const TASK_STORAGE_KEY = 'bai7-task-list';
const STORAGE_KEY = 'bai7-current-user';

type SectionKey = 'tasks' | 'filters' | 'assignment' | 'calendar';

interface TaskFormValues {
	title: string;
	assignee: string;
	priority: TaskPriority;
	status: TaskStatus;
	deadline: Moment;
	description?: string;
}

const statusText: Record<TaskStatus, string> = {
	todo: 'Chưa làm',
	'in-progress': 'Đang làm',
	done: 'Đã xong',
};

const priorityText: Record<TaskPriority, string> = {
	low: 'Thấp',
	medium: 'Trung bình',
	high: 'Cao',
};

const SECTION_ITEMS = [
	{ key: 'tasks', label: 'Danh sách công việc' },
	{ key: 'filters', label: 'Bộ lọc' },
	{ key: 'assignment', label: 'Phân công' },
	{ key: 'calendar', label: 'Lịch' },
] as const;

const PLACEHOLDER_TEXT: Record<Exclude<SectionKey, 'tasks'>, { title: string; description: string }> = {
	filters: {
		title: 'Bộ lọc & tìm kiếm',
		description: 'Tính năng lọc nâng cao giúp khoanh vùng công việc theo trạng thái, người được giao hoặc từ khóa.',
	},
	assignment: {
		title: 'Phân công công việc',
		description: 'Quản lý nguồn lực theo từng thành viên, bảo đảm không ai bị quá tải.',
	},
	calendar: {
		title: 'Lịch hạn hoàn thành',
		description: 'Đồng bộ deadline lên calendar chung của nhóm.',
	},
	
};

const Workspace: React.FC = () => {
	const [tasks, setTasks] = useState<TaskItem[]>(defaultTasks);
	const [currentUser, setCurrentUser] = useState<string | null>(null);
	const [form] = Form.useForm<TaskFormValues>();
	const [editForm] = Form.useForm<TaskFormValues>();
	const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeSection, setActiveSection] = useState<SectionKey>('tasks');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const savedUser = window.localStorage.getItem(STORAGE_KEY);
		if (!savedUser) {
			history.replace('/bai-7/dang-nhap');
			return;
		}
		setCurrentUser(savedUser);

		const storedTasks = window.localStorage.getItem(TASK_STORAGE_KEY);
		if (storedTasks) {
			try {
				const parsed = JSON.parse(storedTasks) as TaskItem[];
				setTasks(parsed);
			} catch (error) {
				console.error('Không thể parse dữ liệu task, dùng default.', error);
			}
		} else {
			window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(defaultTasks));
		}
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		window.localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
	}, [tasks]);

	const stats = useMemo(() => {
		const total = tasks.length;
		const done = tasks.filter((task) => task.status === 'done').length;
		const assignedToCurrent = currentUser ? tasks.filter((task) => task.assignee === currentUser).length : 0;
		return { total, done, assignedToCurrent };
	}, [tasks, currentUser]);

	const handleAddTask = (values: TaskFormValues) => {
		const newTask: TaskItem = {
			id: `T-${Date.now()}`,
			title: values.title.trim(),
			assignee: values.assignee.trim(),
			priority: values.priority,
			status: values.status,
			deadline: values.deadline.format('YYYY-MM-DD'),
			description: values.description?.trim(),
		};
		setTasks((prev) => [newTask, ...prev]);
		form.resetFields();
		message.success('Đã thêm công việc mới.');
	};

	const openEditModal = (task: TaskItem) => {
		setEditingTask(task);
		setIsModalVisible(true);
	};

	useEffect(() => {
		if (editingTask) {
			editForm.setFieldsValue({
				title: editingTask.title,
				assignee: editingTask.assignee,
				priority: editingTask.priority,
				status: editingTask.status,
				deadline: moment(editingTask.deadline, 'YYYY-MM-DD'),
				description: editingTask.description,
			});
		} else {
			editForm.resetFields();
		}
	}, [editingTask, editForm]);

	const handleUpdateTask = () => {
		editForm
			.validateFields()
			.then((values) => {
				setTasks((prev) =>
					prev.map((task) =>
						task.id === editingTask?.id
							? { ...task, ...values, deadline: values.deadline.format('YYYY-MM-DD') }
							: task,
					),
				);
				setIsModalVisible(false);
				setEditingTask(null);
				message.success('Đã cập nhật công việc.');
			})
			.catch(() => null);
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== taskId));
		message.info('Đã xoá công việc.');
	};

	const handleLogout = () => {
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(STORAGE_KEY);
		}
		history.replace('/bai-7/dang-nhap');
	};

	const columns: ColumnsType<TaskItem> = [
		{
			title: 'Tên công việc',
			dataIndex: 'title',
			render: (value: string, record) => (
				<Space direction='vertical' size={0}>
					<Typography.Text strong>{value}</Typography.Text>
					<Typography.Text type='secondary'>{record.description}</Typography.Text>
				</Space>
			),
		},
		{
			title: 'Người được giao',
			dataIndex: 'assignee',
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			render: (priority: TaskPriority) => (
				<Tag color={priority === 'high' ? 'red' : priority === 'medium' ? 'blue' : 'green'}>{priorityText[priority]}</Tag>
			),
		},
		{
			title: 'Deadline',
			dataIndex: 'deadline',
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			render: (status: TaskStatus) => (
				<Badge
					status={status === 'done' ? 'success' : status === 'in-progress' ? 'processing' : 'default'}
					text={statusText[status]}
				/>
			),
		},
		{
			title: 'Thao tác',
			render: (_, record) => (
				<Space>
					<Button size='small' onClick={() => openEditModal(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xác nhận xoá công việc?' onConfirm={() => handleDeleteTask(record.id)}>
						<Button size='small' danger>
							Xoá
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const renderTaskSection = () => (
		<div style={{ marginTop: 16 }}>
			<Row gutter={[24, 24]}>
				<Col xs={24} lg={10}>
					<Card title='Thêm công việc mới'>
						<Form layout='vertical' form={form} onFinish={handleAddTask} requiredMark={false}>
							<Form.Item label='Tên công việc' name='title' rules={[{ required: true, message: 'Nhập tên công việc' }]}>
								<Input placeholder='Ví dụ: Hoàn thiện báo cáo sprint' />
							</Form.Item>
							<Form.Item label='Người được giao' name='assignee' rules={[{ required: true, message: 'Nhập người được giao' }]}>
								<Input placeholder='Ví dụ: Nguyễn An' />
							</Form.Item>
							<Row gutter={12}>
								<Col xs={24} md={12}>
									<Form.Item label='Ưu tiên' name='priority' rules={[{ required: true, message: 'Chọn ưu tiên' }]}>
										<Select
											options={[
												{ label: 'Thấp', value: 'low' },
												{ label: 'Trung bình', value: 'medium' },
												{ label: 'Cao', value: 'high' },
											]}
										/>
									</Form.Item>
								</Col>
								<Col xs={24} md={12}>
									<Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
										<Select
											options={[
												{ label: 'Chưa làm', value: 'todo' },
												{ label: 'Đang làm', value: 'in-progress' },
												{ label: 'Đã xong', value: 'done' },
											]}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item label='Deadline' name='deadline' rules={[{ required: true, message: 'Chọn hạn hoàn thành' }]}>
								<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
							</Form.Item>
							<Form.Item label='Mô tả' name='description'>
								<Input.TextArea rows={3} placeholder='Ghi chú nhanh cho công việc' />
							</Form.Item>
							<Form.Item>
								<Space>
									<Button type='primary' htmlType='submit'>Thêm công việc</Button>
									<Button onClick={() => form.resetFields()}>Làm mới</Button>
								</Space>
							</Form.Item>
						</Form>
					</Card>
				</Col>
				<Col xs={24} lg={14}>
					<Card title='Danh sách công việc'>
						<Table<TaskItem> rowKey='id' dataSource={tasks} columns={columns} pagination={{ pageSize: 5 }} />
						<Typography.Paragraph style={{ marginTop: 16 }}>
							Tổng {stats.total} việc • {stats.done} đã hoàn thành • {stats.assignedToCurrent} giao cho bạn
						</Typography.Paragraph>
					</Card>
				</Col>
			</Row>

			<Modal
				title={`Chỉnh sửa công việc ${editingTask?.id}`}
				open={isModalVisible}
				onOk={handleUpdateTask}
				onCancel={() => {
					setIsModalVisible(false);
					setEditingTask(null);
				}}
				okText='Lưu thay đổi'
				cancelText='Hủy'
			>
				<Form layout='vertical' form={editForm}>
					<Form.Item label='Tên công việc' name='title' rules={[{ required: true, message: 'Nhập tên công việc' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Người được giao' name='assignee' rules={[{ required: true, message: 'Nhập người được giao' }]}>
						<Input />
					</Form.Item>
					<Form.Item label='Ưu tiên' name='priority' rules={[{ required: true, message: 'Chọn ưu tiên' }]}>
						<Select
							options={[
								{ label: 'Thấp', value: 'low' },
								{ label: 'Trung bình', value: 'medium' },
								{ label: 'Cao', value: 'high' },
							]}
						/>
					</Form.Item>
					<Form.Item label='Trạng thái' name='status' rules={[{ required: true, message: 'Chọn trạng thái' }]}>
						<Select
							options={[
								{ label: 'Chưa làm', value: 'todo' },
								{ label: 'Đang làm', value: 'in-progress' },
								{ label: 'Đã xong', value: 'done' },
							]}
						/>
					</Form.Item>
					<Form.Item label='Deadline' name='deadline' rules={[{ required: true, message: 'Chọn hạn hoàn thành' }]}>
						<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);

	const renderPlaceholder = (key: Exclude<SectionKey, 'tasks'>) => {
		if (key === 'calendar') {
			return (
				<Card style={{ marginTop: 16 }}>
					<Typography.Title level={4}>Lịch công việc</Typography.Title>
	
					<CalendarView tasks={tasks} />
				</Card>
			);
		}
	
		return (
			<Card style={{ marginTop: 16 }}>
				<Typography.Title level={4}>{PLACEHOLDER_TEXT[key].title}</Typography.Title>
				<Typography.Paragraph>{PLACEHOLDER_TEXT[key].description}</Typography.Paragraph>
				<Typography.Text type='secondary'>Người đang đăng nhập: {currentUser}</Typography.Text>
			</Card>
		);
	};

	const userMenu = (
		<Menu>
			<Menu.Item key='logout' onClick={handleLogout}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);

	return (
		<PageContainer header={false}>
			<Card>
				<div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
					<Menu
						mode='horizontal'
						selectedKeys={[activeSection]}
						onClick={({ key }) => setActiveSection(key as SectionKey)}
						style={{ flex: 1, minWidth: 280 }}
					>
						{SECTION_ITEMS.map((item) => (
							<Menu.Item key={item.key}>{item.label}</Menu.Item>
						))}
					</Menu>
					<Dropdown overlay={userMenu} trigger={['click']}>
						<Button type='text' icon={<UserOutlined />}>
							{currentUser}
							<DownOutlined style={{ marginLeft: 8 }} />
						</Button>
					</Dropdown>
				</div>
			</Card>
			{activeSection === 'tasks' ? renderTaskSection() : renderPlaceholder(activeSection as Exclude<SectionKey, 'tasks'>)}
		</PageContainer>
	);
};

export default Workspace;
