import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Checkbox, Empty, Form, Input, List, Modal, Space, Statistic, Typography, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const STORAGE_KEY = 'todoList';
const isBrowser = typeof window !== 'undefined';

type Todo = {
	id: string;
	title: string;
	completed: boolean;
	createdAt: string;
};

const readTodos = (): Todo[] => {
	if (!isBrowser) {
		return [];
	}

	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed;
		}
		return [];
	} catch (error) {
		console.error('Không thể đọc todoList từ localStorage', error);
		return [];
	}
};

const TodoListPage: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>(() => readTodos());
	const [form] = Form.useForm();
	const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
	const [editingValue, setEditingValue] = useState('');

	useEffect(() => {
		if (!isBrowser) {
			return;
		}
		setTodos(readTodos());
	}, []);

	useEffect(() => {
		if (!isBrowser) {
			return;
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}, [todos]);

	const remaining = useMemo(() => todos.filter((item) => !item.completed).length, [todos]);

	const addTodo = (values: { title: string }) => {
		const trimmed = values.title.trim();
		if (!trimmed) {
			message.warning('Nội dung không được để trống.');
			return;
		}

		setTodos((prev) => [
			...prev,
			{
				id: Date.now().toString(),
				title: trimmed,
				completed: false,
				createdAt: new Date().toISOString(),
			},
		]);
		form.resetFields();
	};

	const toggleStatus = (id: string) => {
		setTodos((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
	};

	const startEdit = (todo: Todo) => {
		setEditingTodo(todo);
		setEditingValue(todo.title);
	};

	const handleEditOk = () => {
		if (!editingTodo) {
			return;
		}
		const trimmed = editingValue.trim();
		if (!trimmed) {
			message.warning('Nội dung không được để trống.');
			return;
		}
		setTodos((prev) => prev.map((item) => (item.id === editingTodo.id ? { ...item, title: trimmed } : item)));
		setEditingTodo(null);
	};

	const handleDelete = (id: string) => {
		setTodos((prev) => prev.filter((item) => item.id !== id));
	};

	const handleEditCancel = () => {
		setEditingTodo(null);
	};

	return (
		<Card>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={3}>Bài 1: TodoList</Title>
				</div>
				<Statistic title='Công việc chưa hoàn thành' value={remaining} suffix={`/ ${todos.length}`} />
				<Form form={form} layout='inline' onFinish={addTodo} style={{ gap: 12, flexWrap: 'wrap' }}>
					<Form.Item name='title' rules={[{ required: true, message: 'Vui lòng nhập nội dung công việc' }]}>
						<Input allowClear placeholder='Nhập việc cần làm' style={{ minWidth: 240 }} />
					</Form.Item>
					<Form.Item>
						<Button type='primary' htmlType='submit' icon={<PlusOutlined />}>
							Thêm công việc
						</Button>
					</Form.Item>
				</Form>
				<List
					dataSource={todos}
					locale={{ emptyText: <Empty description='Chưa có công việc nào' /> }}
					renderItem={(item) => (
						<List.Item
							key={item.id}
							actions={[
								<Button key='edit' icon={<EditOutlined />} type='link' onClick={() => startEdit(item)}>
									Sửa
								</Button>,
								<Button key='delete' danger type='link' icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)}>
									Xóa
								</Button>,
							]}
						>
							<Space size='large'>
								<Checkbox checked={item.completed} onChange={() => toggleStatus(item.id)}>
									<Text delete={item.completed}>{item.title}</Text>
								</Checkbox>
								<Text type='secondary'>Tạo lúc: {new Date(item.createdAt).toLocaleString()}</Text>
							</Space>
						</List.Item>
					)}
				/>
			</Space>

			<Modal
				title='Chỉnh sửa công việc'
				open={Boolean(editingTodo)}
				okText='Lưu'
				cancelText='Hủy'
				onOk={handleEditOk}
				onCancel={handleEditCancel}
			>
				<Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} placeholder='Nhập nội dung mới' />
			</Modal>
		</Card>
	);
};

export default TodoListPage;
