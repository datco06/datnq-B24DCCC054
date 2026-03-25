import { compareFullname, removeHtmlTags } from '@/utils/utils';
import { PlusOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Popconfirm, Row, Space, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { locChuoiTrenBang, sapXepChuoi, sapXepNgay } from '../boLocBang';
import type { CauLacBo, ThanhVienCauLacBo } from '../typing';

interface DanhSachCauLacBoTabProps {
	danhSachCauLacBo: CauLacBo[];
	danhSachThanhVien: ThanhVienCauLacBo[];
	onThemMoi: () => void;
	onChinhSua: (cauLacBo: CauLacBo) => void;
	onXoa: (id: string) => void;
	onXemThanhVien: (cauLacBoId: string) => void;
	onKhoiPhucDuLieuMau: () => void;
}

const DanhSachCauLacBoTab = ({
	danhSachCauLacBo,
	danhSachThanhVien,
	onThemMoi,
	onChinhSua,
	onXoa,
	onXemThanhVien,
	onKhoiPhucDuLieuMau,
}: DanhSachCauLacBoTabProps) => {
	const tongThanhVienTheoCauLacBo = (cauLacBoId: string) =>
		danhSachThanhVien.filter((thanhVien) => thanhVien.cauLacBoId === cauLacBoId).length;

	const cotCauLacBo: ColumnsType<CauLacBo> = [
		{
			title: 'Ảnh đại diện',
			dataIndex: 'anhDaiDien',
			width: 110,
			render: (giaTri: string, banGhi) =>
				giaTri ? <Avatar shape='square' size={56} src={giaTri} /> : <Avatar shape='square' size={56}>{banGhi.tenCauLacBo[0]}</Avatar>,
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			width: 240,
			sorter: (a, b) => sapXepChuoi(a.tenCauLacBo, b.tenCauLacBo),
			...locChuoiTrenBang<CauLacBo>('tenCauLacBo', 'Tên câu lạc bộ'),
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 150,
			sorter: (a, b) => sapXepNgay(a.ngayThanhLap, b.ngayThanhLap),
			render: (giaTri: string) => new Date(giaTri).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 280,
			...locChuoiTrenBang<CauLacBo>('moTa', 'Mô tả'),
			render: (giaTri: string) => <div style={{ whiteSpace: 'normal' }}>{removeHtmlTags(giaTri).slice(0, 120) || 'Chưa có mô tả'}</div>,
		},
		{
			title: 'Chủ nhiệm CLB',
			dataIndex: 'chuNhiem',
			width: 180,
			sorter: (a, b) => compareFullname(a.chuNhiem, b.chuNhiem),
			...locChuoiTrenBang<CauLacBo>('chuNhiem', 'Chủ nhiệm CLB'),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'dangHoatDong',
			width: 130,
			filters: [
				{ text: 'Có', value: 'co' },
				{ text: 'Không', value: 'khong' },
			],
			onFilter: (giaTri, banGhi) => (giaTri === 'co' ? banGhi.dangHoatDong : !banGhi.dangHoatDong),
			render: (giaTri: boolean) => <Tag color={giaTri ? 'green' : 'default'}>{giaTri ? 'Có' : 'Không'}</Tag>,
		},
		{
			title: 'Thành viên',
			width: 120,
			render: (_, banGhi) => <Tag color='blue'>{tongThanhVienTheoCauLacBo(banGhi.id)}</Tag>,
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			fixed: 'right',
			width: 240,
			render: (_, banGhi) => (
				<Space wrap>
					<Button size='small' icon={<TeamOutlined />} onClick={() => onXemThanhVien(banGhi.id)}>
						Thành viên
					</Button>
					<Button size='small' onClick={() => onChinhSua(banGhi)}>
						Sửa
					</Button>
					<Popconfirm title='Bạn có chắc muốn xóa câu lạc bộ này?' onConfirm={() => onXoa(banGhi.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8}>
					<Statistic title='Tổng câu lạc bộ' value={danhSachCauLacBo.length} />
				</Col>
				<Col xs={24} md={8}>
					<Statistic title='CLB đang hoạt động' value={danhSachCauLacBo.filter((item) => item.dangHoatDong).length} />
				</Col>
				<Col xs={24} md={8}>
					<Statistic title='Tổng thành viên đã duyệt' value={danhSachThanhVien.length} />
				</Col>
			</Row>
			<Card
				title='Danh sách câu lạc bộ'
				extra={
					<Space wrap>
						<Button icon={<ReloadOutlined />} onClick={onKhoiPhucDuLieuMau}>
							Khôi phục dữ liệu mẫu
						</Button>
						<Button type='primary' icon={<PlusOutlined />} onClick={onThemMoi}>
							Thêm CLB
						</Button>
					</Space>
				}
			>
				<Table<CauLacBo> rowKey='id' dataSource={danhSachCauLacBo} columns={cotCauLacBo} scroll={{ x: 1500 }} pagination={{ pageSize: 5 }} />
			</Card>
		</Space>
	);
};

export default DanhSachCauLacBoTab;
