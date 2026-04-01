import React from 'react';
import { Card, Descriptions, Typography } from 'antd';

const { Title } = Typography;

const Bai6TrangQuanTri: React.FC = () => {
	return (
		<Card>
			<Title level={3}>Bài 6: Trang quản trị</Title>
			<Descriptions bordered column={1} size='small'>
				<Descriptions.Item label='Quyền truy cập'>Chưa định nghĩa</Descriptions.Item>
				<Descriptions.Item label='Nhật ký hệ thống'>Chưa có dữ liệu</Descriptions.Item>
				<Descriptions.Item label='Cấu hình'>Đang xây dựng</Descriptions.Item>
			</Descriptions>
		</Card>
	);
};

export default Bai6TrangQuanTri;
