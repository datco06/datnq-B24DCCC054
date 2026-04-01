import React from 'react';
import { Calendar, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Bai6TaoLichTrinh: React.FC = () => {
	return (
		<Card>
			<Title level={3}>Bài 6: Tạo lịch trình</Title>
			<Paragraph>Khung trống để xây dựng giao diện lên lịch cho từng sự kiện hoặc chiến dịch.</Paragraph>
			<Paragraph type='secondary'>Tạm thời hiển thị lịch tháng mặc định.</Paragraph>
			<Calendar fullscreen={false} disabled />
		</Card>
	);
};

export default Bai6TaoLichTrinh;
