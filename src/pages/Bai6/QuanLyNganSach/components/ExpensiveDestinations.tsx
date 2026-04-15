import React from 'react';
import { Card, List, Statistic } from 'antd';
import type { ExpensiveDestinationsProps } from '@/services/Bai6';

const ExpensiveDestinations: React.FC<ExpensiveDestinationsProps> = ({ destinations }) => {
	const topExpensive = [...destinations]
		.map((item) => ({
			id: item.id,
			name: item.name,
			location: item.location,
			cost: item.costs.food + item.costs.transport + item.costs.stay,
		}))
		.sort((a, b) => b.cost - a.cost)
		.slice(0, 5);

	return (
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
	);
};

export default ExpensiveDestinations;
