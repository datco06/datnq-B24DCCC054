import React from 'react';
import { Card, List, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Bai6QuanLyNganSach: React.FC = () => {
	const placeholderItems = ['Dữ liệu thu', 'Dữ liệu chi', 'Báo cáo dự toán'];
	return (
		<Card>
			<Title level={3}>Bài 6: Quản lý ngân sách</Title>
			<Paragraph>
				Khu vực này sẽ quản lý các khoản thu chi, dự toán và báo cáo hiệu quả sử dụng nguồn lực trong các đợt
				hoạt động.
			</Paragraph>
			<List
				size='small'
				dataSource={placeholderItems}
				renderItem={(item) => (
					<List.Item>
						<Text type='secondary'>• {item}</Text>
					</List.Item>
				)}
			/>
		</Card>
	);
};

export default Bai6QuanLyNganSach;
