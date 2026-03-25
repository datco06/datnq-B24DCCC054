import { ApartmentOutlined, BarChartOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import type { Key } from 'react';
import { useMemo, useState } from 'react';
import { useModel } from 'umi';
import { khoaTabQuanLyCauLacBo } from './hangSo';
import type { QuanLyCauLacBoModel } from './model';
import type { CauLacBo, DonDangKy, DuLieuDonDangKyForm } from './typing';
import CauLacBoForm from './components/CauLacBoForm';
import ChiTietDonDangKyModal from './components/ChiTietDonDangKyModal';
import DonDangKyForm from './components/DonDangKyForm';
import ModalChuyenCauLacBo from './components/ModalChuyenCauLacBo';
import ModalDuyetTuChoi from './components/ModalDuyetTuChoi';
import ModalLichSuXuLy from './components/ModalLichSuXuLy';
import BaoCaoTab from './tabs/BaoCaoTab';
import DanhSachCauLacBoTab from './tabs/DanhSachCauLacBoTab';
import DonDangKyTab from './tabs/DonDangKyTab';
import ThanhVienTab from './tabs/ThanhVienTab';

const QuanLyCauLacBoPage = () => {
	const model = useModel('tienich.quanlycaulacbo' as any) as QuanLyCauLacBoModel;
	const {
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
	} = model;

	const [tabDangChon, setTabDangChon] = useState<string>(khoaTabQuanLyCauLacBo.cauLacBo);
	const [moFormCauLacBo, setMoFormCauLacBo] = useState(false);
	const [cauLacBoDangSua, setCauLacBoDangSua] = useState<CauLacBo>();
	const [moFormDonDangKy, setMoFormDonDangKy] = useState(false);
	const [donDangSua, setDonDangSua] = useState<DonDangKy>();
	const [donChiTiet, setDonChiTiet] = useState<DonDangKy>();
	const [donXemLichSu, setDonXemLichSu] = useState<DonDangKy>();
	const [moXacNhan, setMoXacNhan] = useState(false);
	const [cheDoXacNhan, setCheDoXacNhan] = useState<'duyet' | 'tuChoi'>('duyet');
	const [danhSachDonDuocChon, setDanhSachDonDuocChon] = useState<Key[]>([]);
	const [danhSachThanhVienDuocChon, setDanhSachThanhVienDuocChon] = useState<Key[]>([]);
	const [moChuyenCauLacBo, setMoChuyenCauLacBo] = useState(false);
	const [cauLacBoXuatBaoCao, setCauLacBoXuatBaoCao] = useState<string>();

	const danhSachThanhVienHienThi = useMemo(
		() => (cauLacBoDangLoc ? danhSachThanhVien.filter((thanhVien) => thanhVien.cauLacBoId === cauLacBoDangLoc) : danhSachThanhVien),
		[cauLacBoDangLoc, danhSachThanhVien],
	);

	const thongKeTheoCauLacBo = useMemo(
		() =>
			danhSachCauLacBo.map((cauLacBo) => ({
				id: cauLacBo.id,
				tenCauLacBo: cauLacBo.tenCauLacBo,
				pending: danhSachDonDangKy.filter((don) => don.cauLacBoId === cauLacBo.id && don.trangThai === 'pending').length,
				approved: danhSachDonDangKy.filter((don) => don.cauLacBoId === cauLacBo.id && don.trangThai === 'approved').length,
				rejected: danhSachDonDangKy.filter((don) => don.cauLacBoId === cauLacBo.id && don.trangThai === 'rejected').length,
			})),
		[danhSachCauLacBo, danhSachDonDangKy],
	);

	const dongFormCauLacBo = () => {
		setMoFormCauLacBo(false);
		setCauLacBoDangSua(undefined);
	};

	const dongFormDonDangKy = () => {
		setMoFormDonDangKy(false);
		setDonDangSua(undefined);
	};

	const moDuyetHoacTuChoi = (cheDo: 'duyet' | 'tuChoi', danhSachId: Key[]) => {
		setDanhSachDonDuocChon(danhSachId);
		setCheDoXacNhan(cheDo);
		setMoXacNhan(true);
	};

	const moTabThanhVienTheoCauLacBo = (cauLacBoId: string) => {
		setCauLacBoDangLoc(cauLacBoId);
		setTabDangChon(khoaTabQuanLyCauLacBo.thanhVien);
	};

	const xuLyLuuDon = (duLieu: DuLieuDonDangKyForm) => {
		if (donDangSua) {
			capNhatDonDangKy(donDangSua.id, duLieu);
		} else {
			themDonDangKy(duLieu);
		}
		dongFormDonDangKy();
	};

	return (
		<>
			<Card>
				<Tabs activeKey={tabDangChon} onChange={setTabDangChon}>
					<Tabs.TabPane
						key={khoaTabQuanLyCauLacBo.cauLacBo}
						tab={
							<span>
								<ApartmentOutlined /> Danh sách CLB
							</span>
						}
					>
						<DanhSachCauLacBoTab
							danhSachCauLacBo={danhSachCauLacBo}
							danhSachThanhVien={danhSachThanhVien}
							onThemMoi={() => {
								setCauLacBoDangSua(undefined);
								setMoFormCauLacBo(true);
							}}
							onChinhSua={(cauLacBo) => {
								setCauLacBoDangSua(cauLacBo);
								setMoFormCauLacBo(true);
							}}
							onXoa={xoaCauLacBo}
							onXemThanhVien={moTabThanhVienTheoCauLacBo}
							onKhoiPhucDuLieuMau={khoiPhucDuLieuMau}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						key={khoaTabQuanLyCauLacBo.donDangKy}
						tab={
							<span>
								<CheckCircleOutlined /> Quản lý đơn đăng ký
							</span>
						}
					>
						<DonDangKyTab
							danhSachCauLacBo={danhSachCauLacBo}
							danhSachDonDangKy={danhSachDonDangKy}
							danhSachDonDuocChon={danhSachDonDuocChon}
							setDanhSachDonDuocChon={setDanhSachDonDuocChon}
							layTenCauLacBo={layTenCauLacBo}
							onThemMoi={() => {
								setDonDangSua(undefined);
								setMoFormDonDangKy(true);
							}}
							onChinhSua={(don) => {
								setDonDangSua(don);
								setMoFormDonDangKy(true);
							}}
							onXoa={xoaDonDangKy}
							onXemChiTiet={setDonChiTiet}
							onXemLichSu={setDonXemLichSu}
							onMoDuyetHoacTuChoi={moDuyetHoacTuChoi}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						key={khoaTabQuanLyCauLacBo.thanhVien}
						tab={
							<span>
								<TeamOutlined /> Quản lý thành viên
							</span>
						}
					>
						<ThanhVienTab
							danhSachCauLacBo={danhSachCauLacBo}
							danhSachThanhVienHienThi={danhSachThanhVienHienThi}
							cauLacBoDangLoc={cauLacBoDangLoc}
							setCauLacBoDangLoc={setCauLacBoDangLoc}
							danhSachThanhVienDuocChon={danhSachThanhVienDuocChon}
							setDanhSachThanhVienDuocChon={setDanhSachThanhVienDuocChon}
							onXemLichSu={setDonXemLichSu}
							onMoChuyenCauLacBo={() => setMoChuyenCauLacBo(true)}
						/>
					</Tabs.TabPane>
					<Tabs.TabPane
						key={khoaTabQuanLyCauLacBo.baoCao}
						tab={
							<span>
								<BarChartOutlined /> Báo cáo thống kê
							</span>
						}
					>
						<BaoCaoTab
							danhSachCauLacBo={danhSachCauLacBo}
							thongKeTongQuan={thongKeTongQuan}
							duLieuBieuDo={duLieuBieuDo}
							thongKeTheoCauLacBo={thongKeTheoCauLacBo}
							cauLacBoXuatBaoCao={cauLacBoXuatBaoCao}
							setCauLacBoXuatBaoCao={setCauLacBoXuatBaoCao}
							onXuatDanhSachThanhVien={xuatDanhSachThanhVien}
						/>
					</Tabs.TabPane>
				</Tabs>
			</Card>

			<CauLacBoForm
				mo={moFormCauLacBo}
				duLieu={cauLacBoDangSua}
				dangSua={!!cauLacBoDangSua}
				onDong={dongFormCauLacBo}
				onLuu={(duLieu) => {
					if (cauLacBoDangSua) {
						capNhatCauLacBo(cauLacBoDangSua.id, duLieu);
					} else {
						themCauLacBo(duLieu);
					}
					dongFormCauLacBo();
				}}
			/>

			<DonDangKyForm
				mo={moFormDonDangKy}
				duLieu={donDangSua}
				dangSua={!!donDangSua}
				danhSachCauLacBo={danhSachCauLacBo}
				onDong={dongFormDonDangKy}
				onLuu={xuLyLuuDon}
			/>

			<ModalDuyetTuChoi
				mo={moXacNhan}
				cheDo={cheDoXacNhan}
				soLuong={danhSachDonDuocChon.length}
				onDong={() => setMoXacNhan(false)}
				onXacNhan={(lyDo) => {
					if (cheDoXacNhan === 'duyet') {
						duyetDonDangKy(danhSachDonDuocChon as string[]);
					} else {
						tuChoiDonDangKy(danhSachDonDuocChon as string[], lyDo || '');
					}
					setMoXacNhan(false);
					setDanhSachDonDuocChon([]);
				}}
			/>

			<ModalLichSuXuLy mo={!!donXemLichSu} duLieu={donXemLichSu} onDong={() => setDonXemLichSu(undefined)} />

			<ModalChuyenCauLacBo
				mo={moChuyenCauLacBo}
				soLuong={danhSachThanhVienDuocChon.length}
				danhSachCauLacBo={danhSachCauLacBo}
				onDong={() => setMoChuyenCauLacBo(false)}
				onXacNhan={(cauLacBoId) => {
					chuyenThanhVienSangCauLacBo(danhSachThanhVienDuocChon as string[], cauLacBoId);
					setMoChuyenCauLacBo(false);
					setDanhSachThanhVienDuocChon([]);
				}}
			/>

			<ChiTietDonDangKyModal duLieu={donChiTiet} layTenCauLacBo={layTenCauLacBo} onDong={() => setDonChiTiet(undefined)} />
		</>
	);
};

export default QuanLyCauLacBoPage;
