import type { CauLacBo, DonDangKy, DuLieuBieuDo, DuLieuDonDangKyForm, ThanhVienCauLacBo, ThongKeTongQuan } from './typing';

export interface QuanLyCauLacBoModel {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	danhSachThanhVien: ThanhVienCauLacBo[];
	thongKeTongQuan: ThongKeTongQuan;
	duLieuBieuDo: DuLieuBieuDo;
	cauLacBoDangLoc?: string;
	setCauLacBoDangLoc: (cauLacBoId?: string) => void;
	layTenCauLacBo: (cauLacBoId: string) => string;
	themCauLacBo: (duLieu: Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
	capNhatCauLacBo: (id: string, duLieu: Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
	xoaCauLacBo: (id: string) => boolean;
	themDonDangKy: (duLieu: DuLieuDonDangKyForm) => void;
	capNhatDonDangKy: (id: string, duLieu: DuLieuDonDangKyForm) => void;
	xoaDonDangKy: (id: string) => void;
	duyetDonDangKy: (danhSachId: string[]) => void;
	tuChoiDonDangKy: (danhSachId: string[], lyDo: string) => void;
	chuyenThanhVienSangCauLacBo: (danhSachId: string[], cauLacBoIdMoi: string) => void;
	xuatDanhSachThanhVien: (cauLacBoId: string) => void;
	khoiPhucDuLieuMau: () => void;
}
