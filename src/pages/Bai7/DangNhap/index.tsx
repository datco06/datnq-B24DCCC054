import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Form, Input } from 'antd';
import { history, useModel } from 'umi';

interface LoginForm {
	username: string;
	password?: string;
}

const DangNhap: React.FC = () => {
	const [form] = Form.useForm<LoginForm>();
	const { login, currentUser } = useModel('bai7.DangNhap.index');

	useEffect(() => {
		if (currentUser) {
			history.push('/bai-7/workspace');
		} else {
			const saved = localStorage.getItem('bai7-current-user');
			if (saved) {
				form.setFieldsValue({ username: saved });
			}
		}
	}, [currentUser, form]);

	const handleLogin = (values: LoginForm) => {
		const success = login(values.username, values.password);
		if (success) {
			history.push('/bai-7/workspace');
		} else {
			form.setFields([{ name: 'password', errors: ['Sai tên đăng nhập hoặc mật khẩu!'] }]);
		}
	};

	return (
		<PageContainer>
			<div style={{ maxWidth: 440, margin: '0 auto' }}>
				<Card>
					<Form layout='vertical' form={form} onFinish={handleLogin} requiredMark={false}>
						<Form.Item
							label='Tên người dùng'
							name='username'
							rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
						>
							<Input placeholder='Ví dụ: nguyenan' autoComplete='off' allowClear />
						</Form.Item>
						<Form.Item
							label='Mật khẩu'
							name='password'
							rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
						>
							<Input.Password placeholder='Nhập mật khẩu (vd: 123)' />
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
