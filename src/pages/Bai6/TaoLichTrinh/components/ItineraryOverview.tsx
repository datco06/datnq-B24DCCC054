import React from 'react';
import { Card, Statistic } from 'antd';
import type { ItineraryOverviewProps } from '@/services/Bai6';

const ItineraryOverview: React.FC<ItineraryOverviewProps> = ({ travelCost, stayCost, totalDuration }) => {
	return (
		<Card title='Tổng quan chi phí/ thời gian'>
			<Statistic title='Chi phí di chuyển' value={travelCost} suffix='đ' precision={0} />
			<Statistic title='Chi phí ăn ở' value={stayCost} suffix='đ' precision={0} />
			<Statistic title='Thời gian gợi ý' value={totalDuration} suffix='giờ' precision={0} />
		</Card>
	);
};

export default ItineraryOverview;
