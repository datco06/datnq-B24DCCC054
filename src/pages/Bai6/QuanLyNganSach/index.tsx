import React, { useEffect, useMemo, useState } from 'react';
import { Space, Typography } from 'antd';
import { useModel } from 'umi';
import BudgetOverview from './components/BudgetOverview';
import BudgetCharts from './components/BudgetCharts';
import ExpensiveDestinations from './components/ExpensiveDestinations';
import MonthlyStats from './components/MonthlyStats';

const { Title, Paragraph } = Typography;

const Bai6QuanLyNganSach: React.FC = () => {
	const { rawDestinations, stats, loadData } = useModel('bai6Model');
	const [budgetLimit, setBudgetLimit] = useState<number>(15000000);

	useEffect(() => {
		loadData();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', loadData);
			return () => window.removeEventListener('storage', loadData);
		}
		return () => undefined;
	}, [loadData]);

	const categoryTotals = useMemo(() => {
		return rawDestinations.reduce(
			(acc, item) => {
				acc.food += item.costs.food;
				acc.transport += item.costs.transport;
				acc.stay += item.costs.stay;
				return acc;
			},
			{ food: 0, transport: 0, stay: 0 },
		);
	}, [rawDestinations]);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Title level={3}>Bài 6: Quản lý ngân sách</Title>
			<Paragraph>
				Theo dõi nhanh chi phí dự kiến cho từng hạng mục trong kế hoạch du lịch. Số liệu lấy trực tiếp từ danh sách điểm đến
				ở mục Trang quản trị.
			</Paragraph>

			<BudgetOverview
				budgetLimit={budgetLimit}
				setBudgetLimit={setBudgetLimit}
				categoryTotals={categoryTotals}
			/>

			<BudgetCharts categoryTotals={categoryTotals} />

			<ExpensiveDestinations destinations={rawDestinations} />

			<MonthlyStats stats={stats} />
		</Space>
	);
};

export default Bai6QuanLyNganSach;
