import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, InputNumber, List, Progress, Row, Slider, Space, Statistic, Typography } from 'antd';
import { loadDestinations, loadStats } from '../TrangQuanTri/admin/storage';
import type { Destination, DestinationStat } from '../TrangQuanTri/admin/typing';
import Chart from 'react-apexcharts';

const { Title, Paragraph } = Typography;

const Bai6QuanLyNganSach: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>(() => loadDestinations());
	const [stats] = useState<DestinationStat[]>(() => loadStats());
	const [budgetLimit, setBudgetLimit] = useState<number>(15000000);

	useEffect(() => {
		const syncData = () => setDestinations(loadDestinations());
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', syncData);
			return () => window.removeEventListener('storage', syncData);
		}
		return () => undefined;
	}, []);

	const categoryTotals = useMemo(() => {
		return destinations.reduce(
			(acc, item) => {
				acc.food += item.costs.food;
				acc.transport += item.costs.transport;
				acc.stay += item.costs.stay;
				return acc;
			},
			{ food: 0, transport: 0, stay: 0 },
		);
	}, [destinations]);

	const totalSpending = categoryTotals.food + categoryTotals.transport + categoryTotals.stay;
	const overBudget = totalSpending > budgetLimit && budgetLimit > 0;

	const chartSeries = [categoryTotals.food, categoryTotals.transport, categoryTotals.stay];
	const chartOptions = useMemo(
		() => ({
			labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
			colors: ['#fa8c16', '#1890ff', '#9254de'],
			dataLabels: {
				formatter: (val: number) => `${val.toFixed(1)}%`,
			},
			legend: { position: 'bottom' },
			tooltip: {
				y: {
					formatter: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
				},
			},
		}),
		[],
	);

	const topExpensive = useMemo(() => {
		return [...destinations]
			.map((item) => ({
				id: item.id,
				name: item.name,
				location: item.location,
				cost: item.costs.food + item.costs.transport + item.costs.stay,
			}))
			.sort((a, b) => b.cost - a.cost)
			.slice(0, 5);
	}, [destinations]);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Title level={3}>Bài 6: Quản lý ngân sách</Title>
			<Paragraph>
				Theo dõi nhanh chi phí dự kiến cho từng hạng mục trong kế hoạch du lịch. Số liệu lấy trực tiếp từ danh sách điểm đến
				ở mục Trang quản trị.
			</Paragraph>
			<Card>
				<Space direction='vertical' style={{ width: '100%' }}>
					<Space align='center'>
						<Paragraph style={{ marginBottom: 0 }}>Ngân sách mục tiêu:</Paragraph>
						<InputNumber
							value={budgetLimit}
							onChange={(val) => setBudgetLimit(Number(val) || 0)}
							step={500000}
							min={0}
							formatter={(value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`}
						/>
					</Space>
					<Slider min={5000000} max={50000000} step={500000} value={budgetLimit} onChange={(val) => setBudgetLimit(val as number)} />
				</Space>
			</Card>
			{overBudget ? (
				<Alert
					message='Cảnh báo vượt ngân sách'
					description={`Tổng chi phí hiện tại đạt ${totalSpending.toLocaleString('vi-VN')} đ, vượt giới hạn ${budgetLimit.toLocaleString('vi-VN')} đ.`}
					type='error'
					showIcon
				/>
			) : (
				<Alert
					message='Ngân sách trong tầm kiểm soát'
					description={`Bạn còn ${Math.max(0, budgetLimit - totalSpending).toLocaleString('vi-VN')} đ trước khi chạm giới hạn.`}
					type='success'
					showIcon
				/>
			)}
			<Row gutter={[16, 16]}>
				{[
					{ key: 'food', label: 'Ăn uống', color: 'volcano', value: categoryTotals.food },
					{ key: 'transport', label: 'Di chuyển', color: 'blue', value: categoryTotals.transport },
					{ key: 'stay', label: 'Lưu trú', color: 'purple', value: categoryTotals.stay },
				].map((item) => (
					<Col xs={24} md={8} key={item.key}>
						<Card>
							<Statistic title={item.label} value={item.value} suffix='đ' precision={0} />
							<Progress percent={budgetLimit ? Math.min(100, (item.value / budgetLimit) * 100) : 0} strokeColor={item.color} showInfo={false} />
						</Card>
					</Col>
				))}
			</Row>
			<Card title='Phân bổ ngân sách'>
				{typeof window !== 'undefined' && chartSeries.some((value) => value > 0) ? (
					<Chart type='donut' options={chartOptions} series={chartSeries} height={320} />
				) : (
					<List
						dataSource={['Ăn uống', 'Di chuyển', 'Lưu trú']}
						renderItem={(label, index) => (
							<List.Item>
								{label}: {chartSeries[index]?.toLocaleString('vi-VN') ?? 0} đ
							</List.Item>
						)}
					/>
				)}
			</Card>
			<Card title='Top điểm đến tốn kém'>
				<List
					dataSource={topExpensive}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta title={item.name} description={item.location} />
							<Statistic value={item.cost} suffix='đ' />
						</List.Item>
					)}
				/>
			</Card>
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
		</Space>
	);
};

export default Bai6QuanLyNganSach;
