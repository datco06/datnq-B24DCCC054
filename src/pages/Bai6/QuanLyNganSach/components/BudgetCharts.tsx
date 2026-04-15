import React, { useMemo } from 'react';
import { Card, List } from 'antd';
import type { BudgetChartsProps } from '@/services/Bai6';
import Chart from 'react-apexcharts';



const BudgetCharts: React.FC<BudgetChartsProps> = ({ categoryTotals }) => {
	const chartSeries = [categoryTotals.food, categoryTotals.transport, categoryTotals.stay];
	const chartOptions = useMemo(
		() => ({
			labels: ['Ăn uống', 'Di chuyển', 'Lưu trú'],
			colors: ['#fa8c16', '#1890ff', '#9254de'],
			dataLabels: {
				formatter: (val: number) => `${val.toFixed(1)}%`,
			},
			legend: { position: 'bottom' as const },
			tooltip: {
				y: {
					formatter: (value: number) => `${value.toLocaleString('vi-VN')} đ`,
				},
			},
		}),
		[],
	);

	return (
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
	);
};

export default BudgetCharts;
