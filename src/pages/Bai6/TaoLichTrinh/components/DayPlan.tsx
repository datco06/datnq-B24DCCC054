import React from 'react';
import { Button, Card, Divider, List, Typography } from 'antd';
import type { DayPlanProps } from '@/services/Bai6';
import { estimateTravelCost } from '@/models/bai6/TaoLichTrinh';

const { Text } = Typography;



const DayPlan: React.FC<DayPlanProps> = ({
	day,
	itinerary,
	destinations,
	startPoint,
	addDestination,
	removeDestination
}) => {
	const getDestination = (id?: string) => destinations.find((item) => item.id === id);

	return (
		<Card title={day} extra={<Button onClick={() => addDestination(day)}>+ Thêm địa điểm</Button>}>
			<List
				dataSource={itinerary}
				locale={{ emptyText: 'Chưa có điểm đến' }}
				renderItem={(id, index) => {
					const dest = getDestination(id);
					const prevId = index === 0 ? startPoint : itinerary[index - 1];
					const cost = estimateTravelCost(getDestination(prevId), dest);
					return (
						<List.Item
							actions={[
								<Button size='small' danger onClick={() => removeDestination(day, index)}>
									Xóa
								</Button>,
							]}
						>
							<List.Item.Meta
								title={dest?.name ?? 'Không xác định'}
								description={
									dest && (
										<>
											<Text type='secondary'>{dest.location}</Text>
											<Divider type='vertical' />
											<Text>Thời gian gợi ý: {dest.recommendedDuration} giờ</Text>
										</>
									)
								}
							/>
							<Text type='secondary'>Chi phí di chuyển: {cost.toLocaleString('vi-VN')} đ</Text>
						</List.Item>
					);
				}}
			/>
		</Card>
	);
};

export default DayPlan;
