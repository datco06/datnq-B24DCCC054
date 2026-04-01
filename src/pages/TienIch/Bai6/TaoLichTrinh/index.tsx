import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Divider, List, message, Row, Select, Space, Statistic, Typography } from 'antd';
import { loadDestinations } from '../TrangQuanTri/admin/storage';
import type { Destination } from '../TrangQuanTri/admin/typing';
import { danhSachDiemDen } from '../TrangChu/data';

const { Option } = Select;
const { Title, Text } = Typography;

const fallbackDestinations: Destination[] = danhSachDiemDen.map((item) => ({
	id: item.id,
	name: item.ten,
	location: item.diaDiem,
	type: item.loai === 'thanhpho' ? 'thanh-pho' : (item.loai as Destination['type']),
	description: item.moTa,
	priceCategory: 'tieu-chuan',
	rating: item.danhGia,
	recommendedDuration: 24,
	image: item.hinhAnh,
	costs: {
		food: item.giaTien * 0.3,
		transport: item.giaTien * 0.4,
		stay: item.giaTien * 0.3,
	},
}));

const estimateTravelCost = (from?: Destination, to?: Destination) => {
	if (!from || !to) return 0;
	return Math.round((from.costs.transport + to.costs.transport) / 2);
};

const Bai6TaoLichTrinh: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>(() => {
		const stored = loadDestinations();
		return stored.length ? stored : fallbackDestinations;
	});

	useEffect(() => {
		const syncData = () => {
			const stored = loadDestinations();
			setDestinations(stored.length ? stored : fallbackDestinations);
		};
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', syncData);
			return () => window.removeEventListener('storage', syncData);
		}
		return () => undefined;
	}, []);

	const [startPoint, setStartPoint] = useState<string>();
	const [selected, setSelected] = useState<string>();
	const [dayOrder, setDayOrder] = useState<string[]>(['Ngày 1']);
	const [itinerary, setItinerary] = useState<Record<string, string[]>>({ 'Ngày 1': [] });

	const getDestination = (id?: string) => destinations.find((item) => item.id === id);

	const addDay = () => {
		const nextIndex = dayOrder.length + 1;
		const newDay = `Ngày ${nextIndex}`;
		setDayOrder((prev) => [...prev, newDay]);
		setItinerary((prev) => ({ ...prev, [newDay]: [] }));
	};

	const addDestination = (day: string) => {
		if (!startPoint) {
			message.warning('Vui lòng chọn điểm bắt đầu trước.');
			return;
		}
		if (!selected) {
			message.warning('Hãy chọn điểm đến muốn thêm.');
			return;
		}
		setItinerary((prev) => ({ ...prev, [day]: [...prev[day], selected] }));
	};

	const removeDestination = (day: string, index: number) => {
		setItinerary((prev) => {
			const clone = [...prev[day]];
			clone.splice(index, 1);
			return { ...prev, [day]: clone };
		});
	};

	const flattenItinerary = () => dayOrder.flatMap((day) => itinerary[day]);

	const travelCost = useMemo(() => {
		const allStops = flattenItinerary();
		let total = 0;
		let prev = getDestination(startPoint);
		allStops.forEach((id) => {
			const current = getDestination(id);
			total += estimateTravelCost(prev, current);
			prev = current;
		});
		return total;
	}, [startPoint, itinerary, destinations, dayOrder]);

	const stayCost = useMemo(() => {
		return flattenItinerary().reduce((sum, id) => {
			const dest = getDestination(id);
			if (!dest) return sum;
			return sum + dest.costs.food + dest.costs.stay;
		}, 0);
	}, [itinerary, destinations, dayOrder]);

	const totalDuration = useMemo(() => {
		return flattenItinerary().reduce((sum, id) => {
			const dest = getDestination(id);
			return sum + (dest?.recommendedDuration ?? 0);
		}, 0);
	}, [itinerary, destinations, dayOrder]);

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Title level={3}>Bài 6: Tạo lịch trình du lịch</Title>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Card title='Điểm bắt đầu'>
						<Select
							style={{ width: '100%' }}
							placeholder='Chọn điểm bắt đầu'
							value={startPoint}
							onChange={setStartPoint}
							allowClear
						>
							{destinations.map((dest) => (
								<Option key={dest.id} value={dest.id}>
									{dest.name}
								</Option>
							))}
						</Select>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title='Điểm đến tiếp theo'>
						<Select
							style={{ width: '100%' }}
							placeholder='Chọn điểm đến'
							value={selected}
							onChange={setSelected}
						>
							{destinations.map((dest) => (
								<Option key={dest.id} value={dest.id}>
									{dest.name}
								</Option>
							))}
						</Select>
						<Button style={{ marginTop: 12 }} onClick={addDay} block>
							+ Thêm ngày
						</Button>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title='Tổng quan chi phí/ thời gian'>
						<Statistic title='Chi phí di chuyển' value={travelCost} suffix='đ' precision={0} />
						<Statistic title='Chi phí ăn ở' value={stayCost} suffix='đ' precision={0} />
						<Statistic title='Thời gian gợi ý' value={totalDuration} suffix='giờ' precision={0} />
					</Card>
				</Col>
			</Row>

			{dayOrder.map((day) => (
				<Card key={day} title={day} extra={<Button onClick={() => addDestination(day)}>+ Thêm địa điểm</Button>}>
					<List
						dataSource={itinerary[day]}
						locale={{ emptyText: 'Chưa có điểm đến' }}
						renderItem={(id, index) => {
							const dest = getDestination(id);
							const prevId = index === 0 ? startPoint : itinerary[day][index - 1];
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
			))}
		</Space>
	);
};

export default Bai6TaoLichTrinh;
