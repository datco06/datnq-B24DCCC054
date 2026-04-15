import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CalendarView from '../Lich/CalendarView';
import {
	Badge,
	Button,
	Card,
	Col,
	DatePicker,
	Dropdown,
	Empty,
	Form,
	Input,
	Menu,
	Modal,
	Popconfirm,
	Progress,
	Row,
	Select,
	Space,
	Statistic,
	Table,
	Tag,
	Typography,
	message,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import {
	ClearOutlined,
	DownOutlined,
	FilterOutlined,
	SearchOutlined,
	TeamOutlined,
	UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import type { Moment } from 'moment';
import { history, useModel } from 'umi';
import type { TaskItem } from '@/services/Bai7';
import { TaskPriority, TaskStatus } from '@/services/Bai7';

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
	[TaskStatus.Todo]: 'Chưa làm',
	[TaskStatus.InProgress]: 'Đang làm',
	[TaskStatus.Done]: 'Đã xong',
};

const statusColor: Record<TaskStatus, string> = {
	[TaskStatus.Todo]: 'default',
	[TaskStatus.InProgress]: 'processing',
	[TaskStatus.Done]: 'success',
};

const priorityText: Record<TaskPriority, string> = {
	[TaskPriority.Low]: 'Thấp',
	[TaskPriority.Medium]: 'Trung bình',
	[TaskPriority.High]: 'Cao',
};

const SECTION_ITEMS = [
	{ key: 'tasks', label: 'Danh sách công việc' },
	{ key: 'filters', label: 'Bộ lọc & Tìm kiếm' },
	{ key: 'assignment', label: 'Phân công & Việc của tôi' },
	{ key: 'calendar', label: 'Lịch' },
] as const;




const Workspace: React.FC = () => {
	const { currentUser, logout } = useModel('bai7.DangNhap.index');
	const {
		tasks,
		filteredTasks,
		addTask,
		updateTask,
		deleteTask,
		filterKeyword,
		setFilterKeyword,
		filterStatus,
		setFilterStatus,
		filterAssignee,
		setFilterAssignee,
	} = useModel('bai7.Workspace.index');

	const [form] = Form.useForm<TaskFormValues>();
	const [editForm] = Form.useForm<TaskFormValues>();
	const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeSection, setActiveSection] = useState<SectionKey>('tasks');


	const [assignmentView, setAssignmentView] = useState<'all' | 'mine'>('all');

	useEffect(() => {
		if (!currentUser) {
			history.replace('/bai-7/dang-nhap');
		}
	}, [currentUser]);

	const uniqueAssignees = useMemo(() => {
		const set = new Set(tasks.map((t) => t.assignee));
		return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'));
	}, [tasks]);


	const myTasks = useMemo(() => {
		if (!currentUser) return [];
		return tasks.filter((task) => task.assignee === currentUser.username);
	}, [tasks, currentUser]);


	const stats = useMemo(() => {
		const total = tasks.length;
		const done = tasks.filter((task) => task.status === TaskStatus.Done).length;
		const inProgress = tasks.filter((task) => task.status === TaskStatus.InProgress).length;
		const todo = tasks.filter((task) => task.status === TaskStatus.Todo).length;
		const assignedToCurrent = currentUser ? tasks.filter((task) => task.assignee === currentUser.username).length : 0;
		return { total, done, inProgress, todo, assignedToCurrent };
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
		addTask(newTask);
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
				if (editingTask) {
					updateTask(editingTask.id, { ...values, deadline: values.deadline.format('YYYY-MM-DD') });
				}
				setIsModalVisible(false);
				setEditingTask(null);
				message.success('Đã cập nhật công việc.');
			})
			.catch(() => null);
	};

	const handleDeleteTask = (taskId: string) => {
		deleteTask(taskId);
		message.info('Đã xoá công việc.');
	};

	const handleLogout = () => {
		logout();
		history.replace('/bai-7/dang-nhap');
	};

	/* Hàm xoá bộ lọc */
	const clearFilters = useCallback(() => {
		setFilterKeyword('');
		setFilterStatus('all');
		setFilterAssignee('all');
	}, []);

	const columns: ColumnsType<TaskItem> = [
		{
			title: 'Tên công việc',
			dataIndex: 'title',
			render: (value: string, record) => (
				<Space direction='vertical' size={0}>
					<Typography.Text strong>{value}</Typography.Text>
					{record.description && (
						<Typography.Text type='secondary' style={{ fontSize: 12 }}>
							{record.description}
						</Typography.Text>
					)}
				</Space>
			),
		},
		{
			title: 'Người được giao',
			dataIndex: 'assignee',
			render: (value: string) => (
				<Tag icon={<UserOutlined />} color={value === currentUser?.username ? 'blue' : undefined}>
					{value}
					{value === currentUser?.username && ' (Tôi)'}
				</Tag>
			),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			render: (priority: TaskPriority) => (
				<Tag color={priority === TaskPriority.High ? 'red' : priority === TaskPriority.Medium ? 'blue' : 'green'}>
					{priorityText[priority]}
				</Tag>
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
			render: (status: TaskStatus) => <Badge status={statusColor[status] as any} text={statusText[status]} />,
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


	const renderEditModal = () => (
		<Modal
			title={`Chỉnh sửa công việc ${editingTask?.id}`}
			visible={isModalVisible}
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
				<Form.Item
					label='Người được giao'
					name='assignee'
					rules={[{ required: true, message: 'Nhập người được giao' }]}
				>
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
	);


	const renderTaskSection = () => (
		<div style={{ marginTop: 16 }}>
			<Row gutter={[24, 24]}>
				<Col xs={24} lg={10}>
					<Card title='Thêm công việc mới'>
						<Form layout='vertical' form={form} onFinish={handleAddTask} requiredMark={false}>
							<Form.Item label='Tên công việc' name='title' rules={[{ required: true, message: 'Nhập tên công việc' }]}>
								<Input placeholder='Ví dụ: Hoàn thiện báo cáo sprint' />
							</Form.Item>
							<Form.Item
								label='Người được giao'
								name='assignee'
								rules={[{ required: true, message: 'Nhập người được giao' }]}
							>
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
									<Button type='primary' htmlType='submit'>
										Thêm công việc
									</Button>
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
			{renderEditModal()}
		</div>
	);

	const renderPlaceholder1 = (key: Exclude<SectionKey, 'tasks'>) => {
		if (key === 'calendar') {
			return (
				<Card style={{ marginTop: 16 }}>
					<Typography.Title level={4}>Lịch công việc</Typography.Title>

					<CalendarView tasks={tasks} />
				</Card>
			);
		}

		return null;
	};

	const renderFilterSection = () => {
		const isFiltering = filterKeyword.trim() || filterStatus !== 'all' || filterAssignee !== 'all';

		return (
			<div style={{ marginTop: 16 }}>
				{/* Thanh bộ lọc */}
				<Card
					title={
						<Space>
							<FilterOutlined />
							<span>Bộ lọc & Tìm kiếm</span>
						</Space>
					}
					extra={
						<Space>
							<Typography.Text type='secondary'>
								Tìm thấy{' '}
								<Typography.Text strong style={{ color: '#1890ff' }}>
									{filteredTasks.length}
								</Typography.Text>{' '}
								/ {tasks.length} công việc
							</Typography.Text>
							{isFiltering && (
								<Button icon={<ClearOutlined />} size='small' onClick={clearFilters}>
									Xoá lọc
								</Button>
							)}
						</Space>
					}
				>
					<Row gutter={[16, 16]}>
						{/* Ô tìm kiếm theo tên công việc */}
						<Col xs={24} md={8}>
							<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
								🔍 Tìm kiếm theo tên
							</Typography.Text>
							<Input
								id='filter-search-input'
								placeholder='Nhập từ khoá tên công việc...'
								prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
								value={filterKeyword}
								onChange={(e) => setFilterKeyword(e.target.value)}
								allowClear
							/>
						</Col>

						{/* Dropdown lọc theo trạng thái */}
						<Col xs={24} md={8}>
							<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
								📋 Trạng thái
							</Typography.Text>
							<Select
								id='filter-status-select'
								value={filterStatus}
								onChange={(value) => setFilterStatus(value)}
								style={{ width: '100%' }}
							>
								<Select.Option value='all'>Tất cả trạng thái</Select.Option>
								<Select.Option value='todo'>🔘 Chưa làm</Select.Option>
								<Select.Option value='in-progress'>🔄 Đang làm</Select.Option>
								<Select.Option value='done'>✅ Đã xong</Select.Option>
							</Select>
						</Col>

						{/* Dropdown lọc theo người được giao */}
						<Col xs={24} md={8}>
							<Typography.Text type='secondary' style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>
								👤 Người được giao
							</Typography.Text>
							<Select
								id='filter-assignee-select'
								value={filterAssignee}
								onChange={(value) => setFilterAssignee(value)}
								style={{ width: '100%' }}
								showSearch
								optionFilterProp='children'
							>
								<Select.Option value='all'>Tất cả thành viên</Select.Option>
								{uniqueAssignees.map((name) => (
									<Select.Option key={name} value={name}>
										{name}
										{name === currentUser?.username ? ' (Tôi)' : ''}
									</Select.Option>
								))}
							</Select>
						</Col>
					</Row>
				</Card>

				{/* Thống kê nhanh về kết quả lọc */}
				{isFiltering && (
					<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
						<Col xs={8}>
							<Card size='small'>
								<Statistic
									title='Chưa làm'
									value={filteredTasks.filter((t) => t.status === 'todo').length}
									valueStyle={{ color: '#8c8c8c' }}
								/>
							</Card>
						</Col>
						<Col xs={8}>
							<Card size='small'>
								<Statistic
									title='Đang làm'
									value={filteredTasks.filter((t) => t.status === 'in-progress').length}
									valueStyle={{ color: '#1890ff' }}
								/>
							</Card>
						</Col>
						<Col xs={8}>
							<Card size='small'>
								<Statistic
									title='Đã xong'
									value={filteredTasks.filter((t) => t.status === 'done').length}
									valueStyle={{ color: '#52c41a' }}
								/>
							</Card>
						</Col>
					</Row>
				)}

				{/* Bảng kết quả đã lọc */}
				<Card title='Kết quả lọc' style={{ marginTop: 16 }}>
					{filteredTasks.length > 0 ? (
						<Table<TaskItem>
							rowKey='id'
							dataSource={filteredTasks}
							columns={columns}
							pagination={{ pageSize: 5, showSizeChanger: true, showTotal: (total) => `Tổng ${total} kết quả` }}
						/>
					) : (
						<Empty description='Không tìm thấy công việc phù hợp với bộ lọc'>
							<Button type='primary' onClick={clearFilters}>
								Xoá bộ lọc
							</Button>
						</Empty>
					)}
				</Card>

				{renderEditModal()}
			</div>
		);
	};


	const memberStats = useMemo(() => {
		const map = new Map<string, { total: number; done: number; inProgress: number; todo: number }>();
		tasks.forEach((task) => {
			const existing = map.get(task.assignee) || { total: 0, done: 0, inProgress: 0, todo: 0 };
			existing.total += 1;
			if (task.status === 'done') existing.done += 1;
			else if (task.status === 'in-progress') existing.inProgress += 1;
			else existing.todo += 1;
			map.set(task.assignee, existing);
		});
		return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
	}, [tasks]);

	const renderAssignmentSection = () => {
		const displayTasks = assignmentView === 'mine' ? myTasks : tasks;

		const myDone = myTasks.filter((t) => t.status === 'done').length;
		const myInProgress = myTasks.filter((t) => t.status === 'in-progress').length;
		const myTodo = myTasks.filter((t) => t.status === 'todo').length;

		return (
			<div style={{ marginTop: 16 }}>
				{/* Thống kê cá nhân */}
				<Row gutter={[16, 16]}>
					<Col xs={24} md={6}>
						<Card size='small'>
							<Statistic
								title='Việc của tôi'
								value={myTasks.length}
								prefix={<UserOutlined />}
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col xs={24} md={6}>
						<Card size='small'>
							<Statistic title='Chưa làm' value={myTodo} valueStyle={{ color: '#8c8c8c' }} />
						</Card>
					</Col>
					<Col xs={24} md={6}>
						<Card size='small'>
							<Statistic title='Đang làm' value={myInProgress} valueStyle={{ color: '#1890ff' }} />
						</Card>
					</Col>
					<Col xs={24} md={6}>
						<Card size='small'>
							<Statistic
								title='Đã hoàn thành'
								value={myDone}
								valueStyle={{ color: '#52c41a' }}
								suffix={myTasks.length > 0 ? `/ ${myTasks.length}` : undefined}
							/>
						</Card>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginTop: 16 }}>
					{/* Danh sách công việc + nút chuyển đổi */}
					<Col xs={24} lg={16}>
						<Card
							title={
								<Space>
									{assignmentView === 'mine' ? <UserOutlined /> : <TeamOutlined />}
									<span>{assignmentView === 'mine' ? 'Việc của tôi' : 'Tất cả công việc'}</span>
								</Space>
							}
							extra={
								<Button.Group>
									<Button
										type={assignmentView === 'all' ? 'primary' : 'default'}
										onClick={() => setAssignmentView('all')}
										icon={<TeamOutlined />}
									>
										Tất cả ({tasks.length})
									</Button>
									<Button
										type={assignmentView === 'mine' ? 'primary' : 'default'}
										onClick={() => setAssignmentView('mine')}
										icon={<UserOutlined />}
									>
										Việc của tôi ({myTasks.length})
									</Button>
								</Button.Group>
							}
						>
							{displayTasks.length > 0 ? (
								<Table<TaskItem> rowKey='id' dataSource={displayTasks} columns={columns} pagination={{ pageSize: 5 }} />
							) : (
								<Empty
									description={assignmentView === 'mine' ? 'Bạn chưa được giao công việc nào' : 'Chưa có công việc nào'}
								/>
							)}
						</Card>
					</Col>

					{/* Panel workload thành viên */}
					<Col xs={24} lg={8}>
						<Card
							title={
								<Space>
									<TeamOutlined /> Khối lượng công việc
								</Space>
							}
						>
							{memberStats.map(([name, stat]) => {
								const percent = stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0;
								const isMe = name === currentUser?.username;
								return (
									<div
										key={name}
										style={{
											marginBottom: 16,
											padding: 12,
											background: isMe ? '#e6f7ff' : '#fafafa',
											borderRadius: 8,
											border: isMe ? '1px solid #91d5ff' : '1px solid #f0f0f0',
										}}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												marginBottom: 4,
											}}
										>
											<Typography.Text strong>
												{name}
												{isMe ? ' (Tôi)' : ''}
											</Typography.Text>
											<Typography.Text type='secondary'>{stat.total} việc</Typography.Text>
										</div>
										<Progress
											percent={percent}
											size='small'
											strokeColor={isMe ? '#1890ff' : '#667eea'}
											format={() => `${stat.done}/${stat.total}`}
										/>
										<Space style={{ marginTop: 4, fontSize: 12 }}>
											<Tag color='default'>{stat.todo} chưa làm</Tag>
											<Tag color='processing'>{stat.inProgress} đang làm</Tag>
											<Tag color='success'>{stat.done} xong</Tag>
										</Space>
									</div>
								);
							})}
						</Card>
					</Col>
				</Row>

				{renderEditModal()}
			</div>
		);
	};




	const userMenu = (
		<Menu>
			<Menu.Item key='logout' onClick={handleLogout}>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);


	const renderActiveSection = () => {
		switch (activeSection) {
			case 'tasks':
				return renderTaskSection();
			case 'filters':
				return renderFilterSection();
			case 'assignment':
				return renderAssignmentSection();
			case 'calendar':
				return renderPlaceholder1('calendar');

			default:
				return null;
		}
	};

	return (
		<PageContainer>
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
							{currentUser?.fullName || currentUser?.username}
							<DownOutlined style={{ marginLeft: 8 }} />
						</Button>
					</Dropdown>
				</div>
			</Card>
			{renderActiveSection()}
		</PageContainer>
	);
};

export default Workspace;
