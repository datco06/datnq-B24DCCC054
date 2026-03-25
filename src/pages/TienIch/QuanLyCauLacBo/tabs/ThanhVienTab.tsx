import { compareFullname } from '@/utils/utils';
import { HistoryOutlined, RetweetOutlined } from '@ant-design/icons';
import { Button, Card, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { Key } from 'react';
import { locChuoiTrenBang, sapXepNgay } from '../boLocBang';
import type { CauLacBo, DonDangKy, ThanhVienCauLacBo } from '../typing';

interface ThanhVienTabProps {
	danhSachCauLacBo: CauLacBo[];
	danhSachThanhVienHienThi: ThanhVienCauLacBo[];
	cauLacBoDangLoc?: string;
	setCauLacBoDangLoc: (cauLacBoId?: string) => void;
	danhSachThanhVienDuocChon: Key[];
	setDanhSachThanhVienDuocChon: (danhSach: Key[]) => void;
	onXemLichSu: (don: DonDangKy) => void;
	onMoChuyenCauLacBo: () => void;
}

const ThanhVienTab = ({
	danhSachCauLacBo,
	danhSachThanhVienHienThi,
	cauLacBoDangLoc,
	setCauLacBoDangLoc,
	danhSachThanhVienDuocChon,
	setDanhSachThanhVienDuocChon,
	onXemLichSu,
	onMoChuyenCauLacBo,
}: ThanhVienTabProps) => {
	const cotThanhVien: ColumnsType<ThanhVienCauLacBo> = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			sorter: (a, b) => compareFullname(a.hoTen, b.hoTen),
			...locChuoiTrenBang<ThanhVienCauLacBo>('hoTen', 'Họ tên'),
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 220,
			...locChuoiTrenBang<ThanhVienCauLacBo>('email', 'Email'),
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			width: 130,
			...locChuoiTrenBang<ThanhVienCauLacBo>('soDienThoai', 'SĐT'),
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 180,
			...locChuoiTrenBang<ThanhVienCauLacBo>('diaChi', 'Địa chỉ'),
		},
		{
			title: 'Sở trường',
			dataIndex: 'soTruong',
			width: 180,
			...locChuoiTrenBang<ThanhVienCauLacBo>('soTruong', 'Sở trường'),
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'tenCauLacBo',
			width: 220,
			filters: danhSachCauLacBo.map((cauLacBo) => ({ text: cauLacBo.tenCauLacBo, value: cauLacBo.id })),
			onFilter: (giaTri, banGhi) => banGhi.cauLacBoId === giaTri,
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'ngayCapNhat',
			width: 170,
			sorter: (a, b) => sapXepNgay(a.ngayCapNhat, b.ngayCapNhat),
			render: (giaTri: string) => new Date(giaTri).toLocaleString('vi-VN'),
		},
		{
			title: 'Thao tác',
			key: 'thaoTac',
			width: 140,
			render: (_, banGhi) => (
				<Button size='small' icon={<HistoryOutlined />} onClick={() => onXemLichSu(banGhi)}>
					Lịch sử
				</Button>
			),
		},
	];

	const rowSelectionThanhVien = {
		selectedRowKeys: danhSachThanhVienDuocChon,
		onChange: (danhSachKhoa: Key[]) => setDanhSachThanhVienDuocChon(danhSachKhoa),
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Card
				title='Danh sách thành viên đã duyệt'
				extra={
					<Space wrap>
						<Select
							allowClear
							placeholder='Lọc theo câu lạc bộ'
							style={{ width: 260 }}
							value={cauLacBoDangLoc}
							onChange={(giaTri) => setCauLacBoDangLoc(giaTri)}
						>
							{danhSachCauLacBo.map((cauLacBo) => (
								<Select.Option key={cauLacBo.id} value={cauLacBo.id}>
									{cauLacBo.tenCauLacBo}
								</Select.Option>
							))}
						</Select>
						{danhSachThanhVienDuocChon.length > 0 && (
							<Button icon={<RetweetOutlined />} type='primary' onClick={onMoChuyenCauLacBo}>
								Chuyển CLB cho {danhSachThanhVienDuocChon.length} thành viên
							</Button>
						)}
					</Space>
				}
			>
				<Table<ThanhVienCauLacBo>
					rowKey='id'
					rowSelection={rowSelectionThanhVien}
					dataSource={danhSachThanhVienHienThi}
					columns={cotThanhVien}
					scroll={{ x: 1500 }}
					pagination={{ pageSize: 6 }}
				/>
			</Card>
		</Space>
	);
};

export default ThanhVienTab;
