import { Descriptions, Modal, Tag } from 'antd';
import { mauTrangThaiDon, nhanGioiTinh, nhanTrangThaiDon } from '../hangSo';
import type { DonDangKy } from '../typing';

interface ChiTietDonDangKyModalProps {
	duLieu?: DonDangKy;
	layTenCauLacBo: (cauLacBoId: string) => string;
	onDong: () => void;
}

const ChiTietDonDangKyModal = ({ duLieu, layTenCauLacBo, onDong }: ChiTietDonDangKyModalProps) => (
	<Modal
		title='Chi tiết đơn đăng ký'
		visible={!!duLieu}
		onCancel={onDong}
		footer={null}
		width={900}
		destroyOnClose
	>
		{duLieu && (
			<Descriptions bordered column={2}>
				<Descriptions.Item label='Họ tên'>{duLieu.hoTen}</Descriptions.Item>
				<Descriptions.Item label='Email'>{duLieu.email}</Descriptions.Item>
				<Descriptions.Item label='SĐT'>{duLieu.soDienThoai}</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{nhanGioiTinh[duLieu.gioiTinh]}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ'>{duLieu.diaChi}</Descriptions.Item>
				<Descriptions.Item label='Sở trường'>{duLieu.soTruong}</Descriptions.Item>
				<Descriptions.Item label='Câu lạc bộ'>{layTenCauLacBo(duLieu.cauLacBoId)}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>
					<Tag color={mauTrangThaiDon[duLieu.trangThai]}>{nhanTrangThaiDon[duLieu.trangThai]}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Lý do đăng ký' span={2}>
					{duLieu.lyDoDangKy}
				</Descriptions.Item>
				<Descriptions.Item label='Ghi chú' span={2}>
					{duLieu.ghiChu || '-'}
				</Descriptions.Item>
			</Descriptions>
		)}
	</Modal>
);

export default ChiTietDonDangKyModal;
