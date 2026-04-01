export type TrangThaiDon = 'pending' | 'approved' | 'rejected';

export type GioiTinh = 'nam' | 'nu' | 'khac';

export interface LichSuXuLy {
	id: string;
	thoiGian: string;
	nguoiXuLy: string;
	hanhDong: string;
	ghiChu?: string;
}

export interface CauLacBo {
	id: string;
	anhDaiDien?: string;
	tenCauLacBo: string;
	ngayThanhLap: string;
	moTa: string;
	chuNhiem: string;
	dangHoatDong: boolean;
	ngayTao: string;
	ngayCapNhat: string;
}

export interface DonDangKy {
	id: string;
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: GioiTinh;
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	lyDoDangKy: string;
	trangThai: TrangThaiDon;
	ghiChu?: string;
	ngayTao: string;
	ngayCapNhat: string;
	lichSuXuLy: LichSuXuLy[];
}

export interface ThanhVienCauLacBo extends Omit<DonDangKy, 'trangThai'> {
	trangThai: 'approved';
	tenCauLacBo: string;
}

export interface DuLieuQuanLyCauLacBo {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
}

export interface DuLieuBieuDo {
	trucX: string[];
	donChoDuyet: number[];
	donDaDuyet: number[];
	donTuChoi: number[];
}

export interface ThongKeTongQuan {
	tongCauLacBo: number;
	tongDonChoDuyet: number;
	tongDonDaDuyet: number;
	tongDonTuChoi: number;
}

export interface DuLieuCauLacBoForm {
	anhDaiDienTaiLen?: any;
	tenCauLacBo: string;
	ngayThanhLap: any;
	moTa: string;
	chuNhiem: string;
	dangHoatDong: boolean;
}

export interface DuLieuDonDangKyForm {
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: GioiTinh;
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	lyDoDangKy: string;
	trangThai?: TrangThaiDon;
	ghiChu?: string;
}
