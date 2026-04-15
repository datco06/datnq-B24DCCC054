import React from 'react';
import { Alert, Card, Col, InputNumber, Progress, Row, Slider, Space, Statistic, Typography } from 'antd';
import type { BudgetOverviewProps } from '@/services/Bai6';

const { Paragraph } = Typography;




const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgetLimit, setBudgetLimit, categoryTotals }) => {
	const totalSpending = categoryTotals.food + categoryTotals.transport + categoryTotals.stay;
	const overBudget = totalSpending > budgetLimit && budgetLimit > 0;

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
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
		</Space>
	);
};

export default BudgetOverview;
