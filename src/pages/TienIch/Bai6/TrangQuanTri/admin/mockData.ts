import type { Destination, DestinationStat } from './typing';

export const destinationMocks: Destination[] = [
	{
		id: 'dest-binh-minh',
		name: 'Bãi biển Bình Minh',
		location: 'Quảng Nam',
		type: 'bien',
		description: 'Biển hoang sơ, nước trong, thích hợp nghỉ dưỡng cuối tuần.',
		priceCategory: 'tieu-chuan',
		rating: 4.6,
		recommendedDuration: 48,
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
		costs: {
			food: 1500000,
			transport: 1200000,
			stay: 2400000,
		},
	},
	{
		id: 'dest-lang-bac',
		name: 'Làng Bắc Hà',
		location: 'Lào Cai',
		type: 'lang-que',
		description: 'Không gian bản sắc vùng cao, chợ phiên nổi tiếng.',
		priceCategory: 'tiet-kiem',
		rating: 4.3,
		recommendedDuration: 36,
		image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=60',
		costs: {
			food: 900000,
			transport: 1800000,
			stay: 900000,
		},
	},
	{
		id: 'dest-skyline',
		name: 'Thành phố Skyline',
		location: 'Singapore',
		type: 'thanh-pho',
		description: 'Thiên đường mua sắm, công viên và ẩm thực cao cấp.',
		priceCategory: 'cao-cap',
		rating: 4.8,
		recommendedDuration: 72,
		image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=800&q=60',
		costs: {
			food: 4500000,
			transport: 6000000,
			stay: 9000000,
		},
	},
];

export const destinationStatsMock: DestinationStat[] = [
	{ month: '01/2026', trips: 32, revenue: 420000000, popularType: 'bien' },
	{ month: '02/2026', trips: 28, revenue: 380000000, popularType: 'lang-que' },
	{ month: '03/2026', trips: 41, revenue: 560000000, popularType: 'thanh-pho' },
];
