import { message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { genExcelFile } from '@/utils/utils';
import { duLieuQuanLyCauLacBoMau } from '@/pages/TienIch/QuanLyCauLacBo/duLieuMau';
import { luuDuLieuQuanLyCauLacBo, taiDuLieuQuanLyCauLacBo } from '@/pages/TienIch/QuanLyCauLacBo/khoDuLieu';
import type { CauLacBo, DonDangKy, DuLieuBieuDo, DuLieuDonDangKyForm, LichSuXuLy, ThongKeTongQuan, ThanhVienCauLacBo, TrangThaiDon } from '@/pages/TienIch/QuanLyCauLacBo/typing';

const taoMa = (tienTo: string) => `${tienTo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const layThoiGianHienTai = () => new Date().toISOString();

const sapXepTheoNgayMoiNhat = <T extends { ngayCapNhat: string }>(danhSach: T[]) =>
	[...danhSach].sort((a, b) => new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime());

const taoLichSuXuLy = (hanhDong: string, ghiChu?: string): LichSuXuLy => ({
	id: taoMa('lsxl'),
	thoiGian: layThoiGianHienTai(),
	nguoiXuLy: 'Admin',
	hanhDong,
	ghiChu,
});

const themLichSuChoDon = (don: DonDangKy, hanhDong: string, ghiChu?: string): DonDangKy => {
	const lichSu = taoLichSuXuLy(hanhDong, ghiChu);
	return {
		...don,
		ghiChu,
		ngayCapNhat: lichSu.thoiGian,
		lichSuXuLy: [lichSu, ...don.lichSuXuLy],
	};
};

export default () => {
	const duLieuBanDau = taiDuLieuQuanLyCauLacBo();
	const [danhSachCauLacBo, setDanhSachCauLacBo] = useState<CauLacBo[]>(duLieuBanDau.danhSachCauLacBo);
	const [danhSachDonDangKy, setDanhSachDonDangKy] = useState<DonDangKy[]>(duLieuBanDau.danhSachDonDangKy);
	const [cauLacBoDangLoc, setCauLacBoDangLoc] = useState<string>();

	const capNhatDanhSachCauLacBo = (hamCapNhat: (danhSach: CauLacBo[]) => CauLacBo[]) => {
		setDanhSachCauLacBo((truocDo) => sapXepTheoNgayMoiNhat(hamCapNhat(truocDo)));
	};

	const capNhatDanhSachDonDangKy = (hamCapNhat: (danhSach: DonDangKy[]) => DonDangKy[]) => {
		setDanhSachDonDangKy((truocDo) => sapXepTheoNgayMoiNhat(hamCapNhat(truocDo)));
	};

	useEffect(() => {
		luuDuLieuQuanLyCauLacBo({
			danhSachCauLacBo,
			danhSachDonDangKy,
		});
	}, [danhSachCauLacBo, danhSachDonDangKy]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const dongBoDuLieu = () => {
			const duLieuMoi = taiDuLieuQuanLyCauLacBo();
			setDanhSachCauLacBo(duLieuMoi.danhSachCauLacBo);
			setDanhSachDonDangKy(duLieuMoi.danhSachDonDangKy);
		};
		window.addEventListener('storage', dongBoDuLieu);
		return () => window.removeEventListener('storage', dongBoDuLieu);
	}, []);

	const layTenCauLacBo = (cauLacBoId: string) =>
		danhSachCauLacBo.find((cauLacBo) => cauLacBo.id === cauLacBoId)?.tenCauLacBo ?? 'Chưa xác định';

	const danhSachThanhVien = useMemo<ThanhVienCauLacBo[]>(
		() =>
			danhSachDonDangKy
				.filter((don) => don.trangThai === 'approved')
				.map((don) => ({
					...don,
					trangThai: 'approved',
					tenCauLacBo: layTenCauLacBo(don.cauLacBoId),
				})),
		[danhSachDonDangKy, danhSachCauLacBo],
	);

	const thongKeTongQuan = useMemo<ThongKeTongQuan>(
		() => ({
			tongCauLacBo: danhSachCauLacBo.length,
			tongDonChoDuyet: danhSachDonDangKy.filter((don) => don.trangThai === 'pending').length,
			tongDonDaDuyet: danhSachDonDangKy.filter((don) => don.trangThai === 'approved').length,
			tongDonTuChoi: danhSachDonDangKy.filter((don) => don.trangThai === 'rejected').length,
		}),
		[danhSachCauLacBo, danhSachDonDangKy],
	);

	const duLieuBieuDo = useMemo<DuLieuBieuDo>(() => {
		const demDonTheoTrangThai = (cauLacBoId: string, trangThai: TrangThaiDon) =>
			danhSachDonDangKy.filter((don) => don.cauLacBoId === cauLacBoId && don.trangThai === trangThai).length;

		return {
			trucX: danhSachCauLacBo.map((cauLacBo) => cauLacBo.tenCauLacBo),
			donChoDuyet: danhSachCauLacBo.map((cauLacBo) => demDonTheoTrangThai(cauLacBo.id, 'pending')),
			donDaDuyet: danhSachCauLacBo.map((cauLacBo) => demDonTheoTrangThai(cauLacBo.id, 'approved')),
			donTuChoi: danhSachCauLacBo.map((cauLacBo) => demDonTheoTrangThai(cauLacBo.id, 'rejected')),
		};
	}, [danhSachCauLacBo, danhSachDonDangKy]);

	const themCauLacBo = (duLieu: Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
		const thoiGian = layThoiGianHienTai();
		const cauLacBoMoi: CauLacBo = {
			...duLieu,
			id: taoMa('clb'),
			ngayTao: thoiGian,
			ngayCapNhat: thoiGian,
		};
		capNhatDanhSachCauLacBo((truocDo) => [cauLacBoMoi, ...truocDo]);
		message.success('Đã thêm câu lạc bộ');
	};

	const capNhatCauLacBo = (id: string, duLieu: Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
		capNhatDanhSachCauLacBo((truocDo) =>
			truocDo.map((cauLacBo) =>
				cauLacBo.id === id
					? {
							...cauLacBo,
							...duLieu,
							ngayCapNhat: layThoiGianHienTai(),
					  }
					: cauLacBo,
			),
		);
		message.success('Đã cập nhật câu lạc bộ');
	};

	const xoaCauLacBo = (id: string) => {
		if (danhSachDonDangKy.some((don) => don.cauLacBoId === id)) {
			message.error('Không thể xóa câu lạc bộ đang có đơn đăng ký hoặc thành viên');
			return false;
		}
		setDanhSachCauLacBo((truocDo) => truocDo.filter((cauLacBo) => cauLacBo.id !== id));
		if (cauLacBoDangLoc === id) {
			setCauLacBoDangLoc(undefined);
		}
		message.success('Đã xóa câu lạc bộ');
		return true;
	};

	const themDonDangKy = (duLieu: DuLieuDonDangKyForm) => {
		const thoiGian = layThoiGianHienTai();
		const lichSuXuLy =
			duLieu.trangThai && duLieu.trangThai !== 'pending'
				? [taoLichSuXuLy(duLieu.trangThai === 'approved' ? 'Tạo đơn và duyệt ngay' : 'Tạo đơn và từ chối ngay', duLieu.ghiChu)]
				: [];

		const donMoi: DonDangKy = {
			id: taoMa('don'),
			hoTen: duLieu.hoTen,
			email: duLieu.email,
			soDienThoai: duLieu.soDienThoai,
			gioiTinh: duLieu.gioiTinh,
			diaChi: duLieu.diaChi,
			soTruong: duLieu.soTruong,
			cauLacBoId: duLieu.cauLacBoId,
			lyDoDangKy: duLieu.lyDoDangKy,
			trangThai: duLieu.trangThai ?? 'pending',
			ghiChu: duLieu.ghiChu,
			ngayTao: thoiGian,
			ngayCapNhat: thoiGian,
			lichSuXuLy,
		};

		capNhatDanhSachDonDangKy((truocDo) => [donMoi, ...truocDo]);
		message.success('Đã thêm đơn đăng ký');
	};

	const capNhatDonDangKy = (id: string, duLieu: DuLieuDonDangKyForm) => {
		capNhatDanhSachDonDangKy((truocDo) =>
			truocDo.map((don) =>
				don.id === id
					? {
							...don,
							...duLieu,
							trangThai: duLieu.trangThai ?? don.trangThai,
							ngayCapNhat: layThoiGianHienTai(),
					  }
					: don,
			),
		);
		message.success('Đã cập nhật đơn đăng ký');
	};

	const xoaDonDangKy = (id: string) => {
		setDanhSachDonDangKy((truocDo) => truocDo.filter((don) => don.id !== id));
		message.success('Đã xóa đơn đăng ký');
	};

	const capNhatTrangThaiDon = (danhSachId: string[], trangThai: TrangThaiDon, hanhDong: string, ghiChu?: string) => {
		capNhatDanhSachDonDangKy((truocDo) =>
			truocDo.map((don) =>
				danhSachId.includes(don.id)
					? {
							...themLichSuChoDon(don, hanhDong, ghiChu),
							trangThai,
					  }
					: don,
			),
		);
	};

	const duyetDonDangKy = (danhSachId: string[]) => {
		if (!danhSachId.length) return;
		capNhatTrangThaiDon(danhSachId, 'approved', 'Duyệt đơn');
		message.success(`Đã duyệt ${danhSachId.length} đơn đăng ký`);
	};

	const tuChoiDonDangKy = (danhSachId: string[], lyDo: string) => {
		if (!danhSachId.length) return;
		capNhatTrangThaiDon(danhSachId, 'rejected', 'Từ chối đơn', lyDo);
		message.success(`Đã từ chối ${danhSachId.length} đơn đăng ký`);
	};

	const chuyenThanhVienSangCauLacBo = (danhSachId: string[], cauLacBoIdMoi: string) => {
		const tenCauLacBoMoi = layTenCauLacBo(cauLacBoIdMoi);
		capNhatDanhSachDonDangKy((truocDo) =>
			truocDo.map((don) =>
				danhSachId.includes(don.id)
					? {
							...themLichSuChoDon(don, `Chuyển thành viên sang ${tenCauLacBoMoi}`),
							cauLacBoId: cauLacBoIdMoi,
					  }
					: don,
			),
		);
		message.success(`Đã chuyển ${danhSachId.length} thành viên`);
	};

	const xuatDanhSachThanhVien = (cauLacBoId: string) => {
		const tenCauLacBo = layTenCauLacBo(cauLacBoId);
		const danhSachXuat = danhSachThanhVien.filter((thanhVien) => thanhVien.cauLacBoId === cauLacBoId);
		if (!danhSachXuat.length) {
			message.warning('Câu lạc bộ này chưa có thành viên được duyệt');
			return;
		}

		genExcelFile(
			[
				['Họ tên', 'Email', 'SĐT', 'Giới tính', 'Địa chỉ', 'Sở trường', 'Câu lạc bộ', 'Ngày duyệt'],
				...danhSachXuat.map((thanhVien) => [
					thanhVien.hoTen,
					thanhVien.email,
					thanhVien.soDienThoai,
					thanhVien.gioiTinh,
					thanhVien.diaChi,
					thanhVien.soTruong,
					thanhVien.tenCauLacBo,
					new Date(thanhVien.ngayCapNhat).toLocaleString('vi-VN'),
				]),
			],
			`thanh-vien-${tenCauLacBo}.xlsx`,
			'ThanhVien',
		);
		message.success('Đã xuất file XLSX');
	};

	const khoiPhucDuLieuMau = () => {
		setDanhSachCauLacBo(duLieuQuanLyCauLacBoMau.danhSachCauLacBo);
		setDanhSachDonDangKy(duLieuQuanLyCauLacBoMau.danhSachDonDangKy);
		setCauLacBoDangLoc(undefined);
		message.success('Đã khôi phục dữ liệu mẫu');
	};

	return {
		danhSachCauLacBo,
		danhSachDonDangKy,
		danhSachThanhVien,
		thongKeTongQuan,
		duLieuBieuDo,
		cauLacBoDangLoc,
		setCauLacBoDangLoc,
		layTenCauLacBo,
		themCauLacBo,
		capNhatCauLacBo,
		xoaCauLacBo,
		themDonDangKy,
		capNhatDonDangKy,
		xoaDonDangKy,
		duyetDonDangKy,
		tuChoiDonDangKy,
		chuyenThanhVienSangCauLacBo,
		xuatDanhSachThanhVien,
		khoiPhucDuLieuMau,
	};
};
