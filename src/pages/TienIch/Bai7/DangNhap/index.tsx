import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input } from 'antd';
import { history } from 'umi';

const STORAGE_KEY = 'bai7-current-user';

interface LoginForm {
	username: string;
}

const DangNhap: React.FC = () => {
	const [form] = Form.useForm<LoginForm>();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			form.setFieldsValue({ username: saved });
		}
	}, [form]);

	const handleLogin = (values: LoginForm) => {
		const trimmed = values.username?.trim();
		if (!trimmed) {
			return;
		}

		if (typeof window !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, trimmed);
		}
		history.push('/bai-7/workspace');
	};

	return (
		<PageContainer header={false}>
			<div style={{ maxWidth: 440, margin: '0 auto' }}>
				<Card>
					<Form layout='vertical' form={form} onFinish={handleLogin} requiredMark={false}>
						<Form.Item
							label='Tên người dùng'
							name='username'
							rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
						>
							<Input placeholder='Ví dụ: nhom7_lechi' autoComplete='off' allowClear />
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit' block>
								Đăng nhập
							</Button>
						</Form.Item>
					</Form>
				</Card>
			</div>
		</PageContainer>
	);
};

export default DangNhap;
