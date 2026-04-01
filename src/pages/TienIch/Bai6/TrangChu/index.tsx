import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Bai6TrangChu: React.FC = () => {
	return (
		<Card>
			<Title level={3}>Bài 6: Trang chủ</Title>
			<Paragraph>Khung trang chủ để tổng quan nhanh tình hình hoạt động của dự án.</Paragraph>
			<Paragraph type='secondary'>Sẽ bổ sung biểu đồ, thống kê sau khi hoàn thiện nghiệp vụ.</Paragraph>
		</Card>
	);
};

export default Bai6TrangChu;
