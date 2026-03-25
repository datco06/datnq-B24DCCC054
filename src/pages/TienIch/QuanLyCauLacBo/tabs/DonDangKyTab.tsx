import { compareFullname } from '@/utils/utils';
import { EyeOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { Key } from 'react';
import { mauTrangThaiDon, nhanGioiTinh, nhanTrangThaiDon } from '../hangSo';
import { locChuoiTrenBang, sapXepChuoi } from '../boLocBang';
import type { CauLacBo, DonDangKy, TrangThaiDon } from '../typing';

interface DonDangKyTabProps {
	danhSachCauLacBo: CauLacBo[];
	danhSachDonDangKy: DonDangKy[];
	danhSachDonDuocChon: Key[];
	setDanhSachDonDuocChon: (danhSach: Key[]) => void;
	layTenCauLacBo: (cauLacBoId: string) => string;
	onThemMoi: () => void;
	onChinhSua: (don: DonDangKy) => void;
	onXoa: (id: string) => void;
	onXemChiTiet: (don: DonDangKy) => void;
	onXemLichSu: (don: DonDangKy) => void;
	onMoDuyetHoacTuChoi: (cheDo: 'duyet' | 'tuChoi', danhSachId: Key[]) => void;
}

const DonDangKyTab = ({
	danhSachCauLacBo,
	danhSachDonDangKy,
	danhSachDonDuocChon,
	setDanhSachDonDuocChon,
	layTenCauLacBo,
	onThemMoi,
	onChinhSua,
	onXoa,
	onXemChiTiet,
	onXemLichSu,
	onMoDuyetHoacTuChoi,
}: DonDangKyTabProps) => {
	const cotDonDangKy: ColumnsType<DonDangKy> = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			sorter: (a, b) => compareFullname(a.hoTen, b.hoTen),
			...locChuoiTrenBang<DonDangKy>('hoTen', 'Họ tên'),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 220,
			sorter: (a, b) => sapXepChuoi(a.email, b.email),
			...locChuoiTrenBang<DonDangKy>('email', 'Email'),
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 130,
			...locChuoiTrenBang<DonDangKy>('soDienThoai', 'SĐT'),
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 120,
			filters: [
				{ text: 'Nam', value: 'nam' },
				{ text: 'Nữ', value: 'nu' },
				{ text: 'Khác', value: 'khac' },
			],
			onFilter: (giaTri, banGhi) => banGhi.gioiTinh === giaTri,
			render: (giaTri: string) => nhanGioiTinh[giaTri] || giaTri,
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 180,
			...locChuoiTrenBang<DonDangKy>('diaChi', 'Địa chỉ'),
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 180,
			...locChuoiTrenBang<DonDangKy>('soTruong', 'Sở trường'),
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 200,
			filters: danhSachCauLacBo.map((cauLacBo) => ({ text: cauLacBo.tenCauLacBo, value: cauLacBo.id })),
			onFilter: (giaTri, banGhi) => banGhi.cauLacBoId === giaTri,
			render: (giaTri: string) => layTenCauLacBo(giaTri),
		},
		{
			title: 'Lý do đăng ký',
			dataIndex: 'lyDoDangKy',
			width: 240,
			...locChuoiTrenBang<DonDangKy>('lyDoDangKy', 'Lý do đăng ký'),
			render: (giaTri: string) => <div style={{ whiteSpace: 'normal' }}>{giaTri.slice(0, 90)}</div>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 130,
			filters: [
				{ text: 'Pending', value: 'pending' },
				{ text: 'Approved', value: 'approved' },
				{ text: 'Rejected', value: 'rejected' },
			],
			onFilter: (giaTri, banGhi) => banGhi.trangThai === giaTri,
			render: (giaTri: TrangThaiDon) => <Tag color={mauTrangThaiDon[giaTri]}>{nhanTrangThaiDon[giaTri]}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 200,
			...locChuoiTrenBang<DonDangKy>('ghiChu', 'Ghi chú'),
			render: (giaTri?: string) => giaTri || '-',
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right',
			width: 320,
			render: (_, banGhi) => (
				<Space wrap>
					<Button size='small' icon={<EyeOutlined />} onClick={() => onXemChiTiet(banGhi)}>
						Chi tiết
					</Button>
					<Button size='small' onClick={() => onChinhSua(banGhi)}>
						Sửa
					</Button>
					<Button size='small' icon={<HistoryOutlined />} onClick={() => onXemLichSu(banGhi)}>
						Lịch sử
					</Button>
					{banGhi.trangThai === 'pending' && (
						<>
							<Button size='small' type='primary' onClick={() => onMoDuyetHoacTuChoi('duyet', [banGhi.id])}>
								Duyệt
							</Button>
							<Button size='small' danger onClick={() => onMoDuyetHoacTuChoi('tuChoi', [banGhi.id])}>
								Từ chối
							</Button>
						</>
					)}
					<Popconfirm title='Bạn có chắc muốn xóa đơn này?' onConfirm={() => onXoa(banGhi.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const rowSelectionDonDangKy = {
		selectedRowKeys: danhSachDonDuocChon,
		onChange: (danhSachKhoa: Key[]) => setDanhSachDonDuocChon(danhSachKhoa),
		getCheckboxProps: (banGhi: DonDangKy) => ({
			disabled: banGhi.trangThai !== 'pending',
		}),
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Card
				title='Đơn đăng ký thành viên'
				extra={
					<Space wrap>
						{danhSachDonDuocChon.length > 0 && (
							<>
								<Button type='primary' onClick={() => onMoDuyetHoacTuChoi('duyet', danhSachDonDuocChon)}>
									Duyệt {danhSachDonDuocChon.length} đơn đã chọn
								</Button>
								<Button danger onClick={() => onMoDuyetHoacTuChoi('tuChoi', danhSachDonDuocChon)}>
									Không duyệt {danhSachDonDuocChon.length} đơn đã chọn
								</Button>
							</>
						)}
						<Button type='primary' icon={<PlusOutlined />} onClick={onThemMoi}>
							Thêm đơn
						</Button>
					</Space>
				}
			>
				<Table<DonDangKy>
					rowKey='id'
					rowSelection={rowSelectionDonDangKy}
					dataSource={danhSachDonDangKy}
					columns={cotDonDangKy}
					scroll={{ x: 2350 }}
					pagination={{ pageSize: 6 }}
				/>
			</Card>
		</Space>
	);
};

export default DonDangKyTab;
