import React, { useEffect, useMemo, useState } from 'react';
import { message, Space, Typography } from 'antd';
import { useModel } from 'umi';
import { danhSachDiemDen } from '@/services/Bai6';
import { estimateTravelCost, getFallbackDestinations } from '@/models/bai6/TaoLichTrinh';
import SelectionControl from './components/SelectionControl';
import ItineraryOverview from './components/ItineraryOverview';
import DayPlan from './components/DayPlan';

const { Title } = Typography;

const Bai6TaoLichTrinh: React.FC = () => {
	const { rawDestinations, loadData } = useModel('bai6.bai6Model');

	const destinations = useMemo(() => {
		return rawDestinations.length ? rawDestinations : getFallbackDestinations(danhSachDiemDen);
	}, [rawDestinations]);

	useEffect(() => {
		loadData();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', loadData);
			return () => window.removeEventListener('storage', loadData);
		}
		return () => undefined;
	}, [loadData]);

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

			<SelectionControl
				destinations={destinations}
				startPoint={startPoint}
				setStartPoint={setStartPoint}
				selected={selected}
				setSelected={setSelected}
				addDay={addDay}
			/>

			<ItineraryOverview
				travelCost={travelCost}
				stayCost={stayCost}
				totalDuration={totalDuration}
			/>

			{dayOrder.map((day) => (
				<DayPlan
					key={day}
					day={day}
					itinerary={itinerary[day]}
					destinations={destinations}
					startPoint={startPoint}
					addDestination={addDestination}
					removeDestination={removeDestination}
				/>
			))}
		</Space>
	);
};

export default Bai6TaoLichTrinh;
