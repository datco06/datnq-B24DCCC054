import halongBay from './images/halong_bay.png';
import sapaMountain from './images/sapa_mountain.png';
import danangBeach from './images/danang_beach.png';
import hoianTown from './images/hoian_town.png';
import phuquocIsland from './images/phuquoc_island.png';
import dalatCity from './images/dalat_city.png';

export type LoaiDiemDen = 'bien' | 'nui' | 'thanhpho';

export interface DiemDen {
	id: string;
	ten: string;
	moTa: string;
	hinhAnh: string;
	diaDiem: string;
	loai: LoaiDiemDen;
	danhGia: number;
	soLuotDanhGia: number;
	giaTien: number; // VND / người
	noiDung: string[];
	tags: string[];
}

export const tenLoai: Record<LoaiDiemDen, string> = {
	bien: '🏖️ Biển',
	nui: '⛰️ Núi',
	thanhpho: '🏙️ Thành phố',
};

export const mauLoai: Record<LoaiDiemDen, string> = {
	bien: '#1890ff',
	nui: '#52c41a',
	thanhpho: '#faad14',
};

export const danhSachDiemDen: DiemDen[] = [
	{
		id: '1',
		ten: 'Vịnh Hạ Long',
		moTa: 'Di sản thiên nhiên thế giới UNESCO với hàng nghìn đảo đá vôi kỳ vĩ giữa biển ngọc bích.',
		hinhAnh: halongBay,
		diaDiem: 'Quảng Ninh',
		loai: 'bien',
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
		loai: 'nui',
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
		loai: 'bien',
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
		loai: 'thanhpho',
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
		loai: 'bien',
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
		loai: 'nui',
		danhGia: 4.7,
		soLuotDanhGia: 13750,
		giaTien: 1600000,
		noiDung: ['Hồ Xuân Hương', 'Thung lũng Tình Yêu', 'Thiền viện Trúc Lâm', 'Chợ đêm'],
		tags: ['Lãng mạn', 'Thiên nhiên'],
	},
	{
		id: '7',
		ten: 'Nha Trang',
		moTa: 'Thành phố biển sôi động với vịnh biển đẹp nhất thế giới, tháp Ponagar cổ kính.',
		hinhAnh: danangBeach,
		diaDiem: 'Khánh Hòa',
		loai: 'bien',
		danhGia: 4.4,
		soLuotDanhGia: 10200,
		giaTien: 2000000,
		noiDung: ['Vinpearl Land', 'Tháp Bà Ponagar', 'Đảo Hòn Mun', 'Tắm bùn'],
		tags: ['Biển đẹp', 'Giải trí'],
	},
	{
		id: '8',
		ten: 'Hà Nội',
		moTa: 'Thủ đô ngàn năm văn hiến với phố cổ 36 phố phường, hồ Hoàn Kiếm và ẩm thực đường phố.',
		hinhAnh: hoianTown,
		diaDiem: 'Hà Nội',
		loai: 'thanhpho',
		danhGia: 4.6,
		soLuotDanhGia: 20100,
		giaTien: 1200000,
		noiDung: ['Hồ Hoàn Kiếm', 'Phố cổ', 'Lăng Bác', 'Ẩm thực đường phố'],
		tags: ['Văn hóa', 'Ẩm thực'],
	},
	{
		id: '9',
		ten: 'Mũi Né',
		moTa: 'Thiên đường cát trắng với đồi cát bay huyền bí, suối tiên kỳ ảo và biển xanh.',
		hinhAnh: phuquocIsland,
		diaDiem: 'Bình Thuận',
		loai: 'bien',
		danhGia: 4.3,
		soLuotDanhGia: 7800,
		giaTien: 1800000,
		noiDung: ['Đồi cát trắng', 'Suối Tiên', 'Bãi biển', 'Lướt ván diều'],
		tags: ['Phiêu lưu', 'Thiên nhiên'],
	},
];
