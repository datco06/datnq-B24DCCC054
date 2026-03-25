import ColumnChart from '@/components/Chart/ColumnChart';
import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Select, Space, Statistic, Table } from 'antd';
import type { CauLacBo, DuLieuBieuDo, ThongKeTongQuan } from '../typing';

interface ThongKeTheoCauLacBo {
	id: string;
	tenCauLacBo: string;
	pending: number;
	approved: number;
	rejected: number;
}

interface BaoCaoTabProps {
	danhSachCauLacBo: CauLacBo[];
	thongKeTongQuan: ThongKeTongQuan;
	duLieuBieuDo: DuLieuBieuDo;
	thongKeTheoCauLacBo: ThongKeTheoCauLacBo[];
	cauLacBoXuatBaoCao?: string;
	setCauLacBoXuatBaoCao: (cauLacBoId?: string) => void;
	onXuatDanhSachThanhVien: (cauLacBoId: string) => void;
}

const BaoCaoTab = ({
	danhSachCauLacBo,
	thongKeTongQuan,
	duLieuBieuDo,
	thongKeTheoCauLacBo,
	cauLacBoXuatBaoCao,
	setCauLacBoXuatBaoCao,
	onXuatDanhSachThanhVien,
}: BaoCaoTabProps) => (
	<Space direction='vertical' size='large' style={{ width: '100%' }}>
		<Row gutter={[16, 16]}>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Số CLB' value={thongKeTongQuan.tongCauLacBo} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Pending' value={thongKeTongQuan.tongDonChoDuyet} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Approved' value={thongKeTongQuan.tongDonDaDuyet} />
				</Card>
			</Col>
			<Col xs={24} md={6}>
				<Card>
					<Statistic title='Rejected' value={thongKeTongQuan.tongDonTuChoi} />
				</Card>
			</Col>
		</Row>
		<Card title='Số đơn đăng ký theo từng câu lạc bộ'>
			<ColumnChart
				xAxis={duLieuBieuDo.trucX}
				yAxis={[duLieuBieuDo.donChoDuyet, duLieuBieuDo.donDaDuyet, duLieuBieuDo.donTuChoi]}
				yLabel={['Pending', 'Approved', 'Rejected']}
				colors={['#F0B429', '#1F845A', '#C9372C']}
				formatY={(giaTri) => `${giaTri}`}
			/>
		</Card>
		<Card
			title='Xuất danh sách thành viên Approved'
			extra={
				<Space wrap>
					<Select
						placeholder='Chọn câu lạc bộ để xuất XLSX'
						style={{ width: 260 }}
						value={cauLacBoXuatBaoCao}
						onChange={(giaTri) => setCauLacBoXuatBaoCao(giaTri)}
					>
						{danhSachCauLacBo.map((cauLacBo) => (
							<Select.Option key={cauLacBo.id} value={cauLacBo.id}>
								{cauLacBo.tenCauLacBo}
							</Select.Option>
						))}
					</Select>
					<Button
						type='primary'
						icon={<FileExcelOutlined />}
						disabled={!cauLacBoXuatBaoCao}
						onClick={() => cauLacBoXuatBaoCao && onXuatDanhSachThanhVien(cauLacBoXuatBaoCao)}
					>
						Xuất XLSX
					</Button>
				</Space>
			}
		>
			<Table<ThongKeTheoCauLacBo>
				rowKey='id'
				dataSource={thongKeTheoCauLacBo}
				pagination={false}
				columns={[
					{ title: 'Câu lạc bộ', dataIndex: 'tenCauLacBo' },
					{ title: 'Pending', dataIndex: 'pending', width: 120 },
					{ title: 'Approved', dataIndex: 'approved', width: 120 },
					{ title: 'Rejected', dataIndex: 'rejected', width: 120 },
					{
						title: 'Thao tác',
						width: 180,
						render: (_, banGhi) => (
							<Button type='link' onClick={() => onXuatDanhSachThanhVien(banGhi.id)}>
								Xuất XLSX CLB này
							</Button>
						),
					},
				]}
			/>
		</Card>
	</Space>
);

export default BaoCaoTab;
