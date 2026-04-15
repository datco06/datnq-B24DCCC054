import type { Destination, DiemDen } from '@/services/Bai6';
import { LoaiDiemDen, SortMode } from '@/services/Bai6';

export const mapDestinations = (source: DiemDen[]): Destination[] => {
	return source.map((item) => ({
		id: item.id,
		name: item.ten,
		location: item.diaDiem,
		type: item.loai as unknown as Destination['type'],
		description: item.moTa,
		priceCategory: item.giaTien < 1500000 ? 'tiet-kiem' : item.giaTien > 2500000 ? 'cao-cap' : 'tieu-chuan',
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

export const filterAndSortDestinations = (
	list: Destination[],
	tuKhoa: string,
	loai: LoaiDiemDen | 'tat-ca',
	khoangGia: [number, number],
	danhGia: number,
	sapXep: SortMode,
): Destination[] => {
	let ketQua = list.filter((item) => {
		const matchTuKhoa =
			item.name.toLowerCase().includes(tuKhoa.toLowerCase()) || item.location.toLowerCase().includes(tuKhoa.toLowerCase());
		const matchLoai = loai === 'tat-ca' || item.type === (loai as unknown as Destination['type']);
		const totalCost = item.costs.food + item.costs.transport + item.costs.stay;
		const matchGia = totalCost >= khoangGia[0] && totalCost <= khoangGia[1];
		const matchDanhGia = item.rating >= danhGia;

		return matchTuKhoa && matchLoai && matchGia && matchDanhGia;
	});

	switch (sapXep) {
		case SortMode.RatingDesc:
			ketQua.sort((a, b) => b.rating - a.rating);
			break;
		case SortMode.RatingAsc:
			ketQua.sort((a, b) => a.rating - b.rating);
			break;
		case SortMode.PriceAsc:
			ketQua.sort(
				(a, b) =>
					a.costs.food + a.costs.transport + a.costs.stay - (b.costs.food + b.costs.transport + b.costs.stay),
			);
			break;
		case SortMode.PriceDesc:
			ketQua.sort(
				(a, b) =>
					b.costs.food + b.costs.transport + b.costs.stay - (a.costs.food + a.costs.transport + a.costs.stay),
			);
			break;
		case SortMode.NameAsc:
			ketQua.sort((a, b) => a.name.localeCompare(b.name));
			break;
		default:
			break;
	}

	return ketQua;
};
