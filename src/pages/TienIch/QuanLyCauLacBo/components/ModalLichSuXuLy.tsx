import { Modal, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import type { DonDangKy, LichSuXuLy } from '../typing';

interface ModalLichSuXuLyProps {
	mo: boolean;
	duLieu?: DonDangKy;
	onDong: () => void;
}

const ModalLichSuXuLy = ({ mo, duLieu, onDong }: ModalLichSuXuLyProps) => {
	const cot: ColumnsType<LichSuXuLy> = [
		{
			title: 'Thời gian',
			dataIndex: 'thoiGian',
			width: 180,
			render: (giaTri: string) => moment(giaTri).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Người xử lý',
			dataIndex: 'nguoiXuLy',
			width: 140,
		},
		{
			title: 'Hành động',
			dataIndex: 'hanhDong',
			width: 220,
			render: (giaTri: string) => <Tag color='blue'>{giaTri}</Tag>,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			render: (giaTri?: string) => giaTri || '-',
		},
	];

	return (
		<Modal
			title={`Lịch sử xử lý${duLieu ? ` - ${duLieu.hoTen}` : ''}`}
			visible={mo}
			onCancel={onDong}
			footer={null}
			width={900}
			destroyOnClose
		>
			<Space direction='vertical' style={{ width: '100%' }} size='middle'>
				<Table<LichSuXuLy>
					rowKey='id'
					dataSource={duLieu?.lichSuXuLy || []}
					columns={cot}
					pagination={false}
					locale={{ emptyText: 'Chưa có lịch sử xử lý' }}
				/>
			</Space>
		</Modal>
	);
};

export default ModalLichSuXuLy;
