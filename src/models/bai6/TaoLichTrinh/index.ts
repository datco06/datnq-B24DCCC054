import type { Destination, DiemDen } from '@/services/Bai6';

export const estimateTravelCost = (from?: Destination, to?: Destination) => {
	if (!from || !to) return 0;
	return Math.round((from.costs.transport + to.costs.transport) / 2);
};

export const getFallbackDestinations = (source: DiemDen[]): Destination[] => {
	return source.map((item) => ({
		id: item.id,
		name: item.ten,
		location: item.diaDiem,
		type: item.loai as unknown as Destination['type'],
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
};
