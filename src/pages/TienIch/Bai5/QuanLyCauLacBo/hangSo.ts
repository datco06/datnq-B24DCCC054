import type { TrangThaiDon } from './typing';

export const khoaTabQuanLyCauLacBo = {
	cauLacBo: 'cau-lac-bo',
	donDangKy: 'don-dang-ky',
	thanhVien: 'thanh-vien',
	baoCao: 'bao-cao',
} as const;

export const mauTrangThaiDon: Record<TrangThaiDon, string> = {
	pending: 'gold',
	approved: 'green',
	rejected: 'red',
};

export const nhanTrangThaiDon: Record<TrangThaiDon, string> = {
	pending: 'Pending',
	approved: 'Approved',
	rejected: 'Rejected',
};

export const nhanGioiTinh: Record<string, string> = {
	nam: 'Nam',
	nu: 'Nữ',
	khac: 'Khác',
};
