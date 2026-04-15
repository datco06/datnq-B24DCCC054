import React from 'react';
import { Card, Col, Empty, Progress, Row, Space, Statistic } from 'antd';
import Chart from 'react-apexcharts';
import type { StatsCardsProps } from '@/services/Bai6';

const StatsCards: React.FC<StatsCardsProps> = ({ stats, destinations }) => {

	if (!stats.length) {
		return (
			<Card>
				<Empty description='Chưa có thống kê' />
			</Card>
		);
	}

	const totalTrips = stats.reduce((sum, item) => sum + item.trips, 0);
	const totalRevenue = stats.reduce((sum, item) => sum + item.revenue, 0);
	const latest = stats[stats.length - 1];
	const latestTitle = `Tháng gần nhất (${latest.month})`;
	const percent = Math.min(100, (latest.revenue / (totalRevenue || 1)) * 100);
	const monthlyCategories = stats.map((item) => item.month);
	const chartSeries = [
		{ name: 'Số chuyến', data: stats.map((item) => item.trips) },
		{ name: 'Doanh thu (triệu)', data: stats.map((item) => Math.round(item.revenue / 1_000_000)) },
	];
	const costByCategory = destinations.reduce(
		(acc, item) => {
			acc.food += item.costs.food;
			acc.transport += item.costs.transport;
			acc.stay += item.costs.stay;
			return acc;
		},
		{ food: 0, transport: 0, stay: 0 },
	);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Tổng lượt lịch trình' value={totalTrips} suffix='tour' />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card>
						<Statistic title='Doanh thu ước tính' value={totalRevenue} suffix='đ' precision={0} />
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title={latestTitle}>
						<Statistic title='Số chuyến' value={latest.trips} />
						<Statistic title='Loại phổ biến' value={latest.popularType} />
						<Progress percent={percent} showInfo={false} />
					</Card>
				</Col>
			</Row>
			<Card title='Biểu đồ lịch trình theo tháng'>
				<Chart
					type='area'
					series={chartSeries}
					height={320}
					options={{
						xaxis: { categories: monthlyCategories },
						dataLabels: { enabled: false },
						stroke: { curve: 'smooth' },
						yaxis: [
							{ title: { text: 'Số chuyến' } },
							{ opposite: true, title: { text: 'Doanh thu (triệu)' } },
						],
					}}
				/>
			</Card>
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Card title='Cơ cấu chi phí'>
						<Chart
							type='donut'
							series={[costByCategory.food, costByCategory.transport, costByCategory.stay]}
							options={{
								labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
								dataLabels: { formatter: (value: number) => `${value.toFixed(1)}%` },
							}}
							height={320}
						/>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};

export default StatsCards;
