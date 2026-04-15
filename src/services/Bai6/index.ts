import halongBay from '@/assets/Bai6/halong_bay.png';
import sapaMountain from '@/assets/Bai6/sapa_mountain.png';
import danangBeach from '@/assets/Bai6/danang_beach.png';
import hoianTown from '@/assets/Bai6/hoian_town.png';
import phuquocIsland from '@/assets/Bai6/phuquoc_island.png';
import dalatCity from '@/assets/Bai6/dalat_city.png';
import type { DiemDen } from './typing';
import { LoaiDiemDen } from './typing';
export * from './typing';

export const tenLoai: Record<LoaiDiemDen, string> = {
	[LoaiDiemDen.Bien]: '🏖️ Biển',
	[LoaiDiemDen.Nui]: '⛰️ Núi',
	[LoaiDiemDen.ThanhPho]: '🏙️ Thành phố',
	[LoaiDiemDen.LangQue]: '🏡 Làng quê',
};

export const mauLoai: Record<LoaiDiemDen, string> = {
	[LoaiDiemDen.Bien]: '#1890ff',
	[LoaiDiemDen.Nui]: '#52c41a',
	[LoaiDiemDen.ThanhPho]: '#faad14',
	[LoaiDiemDen.LangQue]: '#f759ab',
};

export const danhSachDiemDen: DiemDen[] = [
	{
		id: '1',
		ten: 'Vịnh Hạ Long',
		moTa: 'Di sản thiên nhiên thế giới UNESCO với hàng nghìn đảo đá vôi kỳ vĩ giữa biển ngọc bích.',
		hinhAnh: halongBay,
		diaDiem: 'Quảng Ninh',
		loai: LoaiDiemDen.Bien,
		danhGia: 4.8,
		soLuotDanhGia: 12580,
		giaTien: 2500000,
		noiDung: ['Du thuyền', 'Chèo kayak', 'Hang Sửng Sốt', 'Đảo Ti Tốp'],
		tags: ['Di sản UNESCO', 'Hot'],
	},
	{
		id: '2',
		ten: 'Sa Pa',
		moTa: 'Thị trấn sương mù trên đỉnh núi với ruộng bậc thang tuyệt đẹp và văn hóa dân tộc độc đáo.',
		hinhAnh: sapaMountain,
		diaDiem: 'Lào Cai',
		loai: LoaiDiemDen.Nui,
		danhGia: 4.7,
		soLuotDanhGia: 9830,
		giaTien: 1800000,
		noiDung: ['Fansipan', 'Ruộng bậc thang', 'Bản Cát Cát', 'Chợ phiên'],
		tags: ['Trekking', 'Văn hóa'],
	},
	{
		id: '3',
		ten: 'Đà Nẵng',
		moTa: 'Thành phố đáng sống nhất Việt Nam với bãi biển đẹp, cầu Rồng và ẩm thực phong phú.',
		hinhAnh: danangBeach,
		diaDiem: 'Đà Nẵng',
		loai: LoaiDiemDen.Bien,
		danhGia: 4.6,
		soLuotDanhGia: 15420,
		giaTien: 2200000,
		noiDung: ['Bãi biển Mỹ Khê', 'Cầu Rồng', 'Bà Nà Hills', 'Ngũ Hành Sơn'],
		tags: ['Biển đẹp', 'Ẩm thực'],
	},
	{
		id: '4',
		ten: 'Hội An',
		moTa: 'Phố cổ đèn lồng lộng lẫy bên dòng sông Thu Bồn, nơi giao thoa văn hóa Đông - Tây.',
		hinhAnh: hoianTown,
		diaDiem: 'Quảng Nam',
		loai: LoaiDiemDen.ThanhPho,
		danhGia: 4.9,
		soLuotDanhGia: 18200,
		giaTien: 1500000,
		noiDung: ['Phố cổ', 'Chùa Cầu', 'Thả đèn hoa đăng', 'May áo dài'],
		tags: ['Di sản UNESCO', 'Lãng mạn'],
	},
	{
		id: '5',
		ten: 'Phú Quốc',
		moTa: 'Đảo ngọc thiên đường với bãi biển cát trắng, nước biển trong xanh và hoàng hôn tuyệt đẹp.',
		hinhAnh: phuquocIsland,
		diaDiem: 'Kiên Giang',
		loai: LoaiDiemDen.Bien,
		danhGia: 4.5,
		soLuotDanhGia: 11350,
		giaTien: 3200000,
		noiDung: ['Bãi Sao', 'Vinpearl Safari', 'Lặn biển', 'Sunset Town'],
		tags: ['Resort', 'Nghỉ dưỡng'],
	},
	{
		id: '6',
		ten: 'Đà Lạt',
		moTa: 'Thành phố ngàn hoa trên cao nguyên với khí hậu mát mẻ, kiến trúc Pháp và hồ Xuân Hương.',
		hinhAnh: dalatCity,
		diaDiem: 'Lâm Đồng',
		loai: LoaiDiemDen.Nui,
		danhGia: 4.7,
		soLuotDanhGia: 13750,
		giaTien: 1600000,
		noiDung: ['Hồ Xuân Hương', 'Thung lũng Tình Yêu', 'Thiền viện Trúc Lâm', 'Chợ đêm'],
		tags: ['Lãng mạn', 'Thiên nhiên'],
	},
];
