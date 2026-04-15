import React from 'react';
import { Card, List, Space, Statistic } from 'antd';
import type { MonthlyStatsProps } from '@/services/Bai6';

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ stats }) => {
	return (
		<Card title='Thống kê lịch trình theo tháng'>
			<List
				dataSource={stats}
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta title={item.month} description={`Loại phổ biến: ${item.popularType}`} />
						<Space size='large'>
							<Statistic title='Số chuyến' value={item.trips} />
							<Statistic title='Doanh thu' value={item.revenue} suffix='đ' />
						</Space>
					</List.Item>
				)}
			/>
		</Card>
	);
};

export default MonthlyStats;
