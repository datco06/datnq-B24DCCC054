import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Modal, Tag, Typography } from 'antd';
import type { DetailModalProps } from '@/services/Bai6';
import { mauLoai, tenLoai } from '@/services/Bai6';
import { formatGia } from '@/models/bai6/Common';
import styles from '../index.less';

const { Paragraph } = Typography;

const DetailModal: React.FC<DetailModalProps> = ({ diemDen, onCancel }) => {

	if (!diemDen) return null;

	return (
		<Modal
			visible={!!diemDen}
			onCancel={onCancel}
			footer={null}
			width={640}
			className={styles.detailModal}
			bodyStyle={{ padding: 0 }}
			closable
		>
			<img src={diemDen.hinhAnh} alt={diemDen.ten} className={styles.detailImage} />
			<div className={styles.detailContent}>
				<div className={styles.detailTitle}>{diemDen.ten}</div>
				<div className={styles.detailLocation}>
					<EnvironmentOutlined />
					{diemDen.diaDiem}
					<Tag color={mauLoai[diemDen.loai]} style={{ borderRadius: 12, marginLeft: 8, border: 'none' }}>
						{tenLoai[diemDen.loai]}
					</Tag>
				</div>
				<Paragraph className={styles.detailDescription}>{diemDen.moTa}</Paragraph>
				<div className={styles.detailHighlights}>
					<h4>📍 Điểm nổi bật</h4>
					<div className={styles.highlightList}>
						{(diemDen.noiDung ?? []).map((nd) => (
							<Tag key={nd} color='purple' style={{ borderRadius: 12, fontSize: 13, padding: '4px 12px' }}>
								{nd}
							</Tag>
						))}
					</div>
				</div>
				<div className={styles.detailFooter}>
					<div className={styles.detailPrice}>
						<div className={styles.priceLabel}>Giá từ</div>
						<span className={styles.priceValue}>{formatGia(diemDen.giaTien)}</span>
						<span className={styles.priceUnit}>/ người</span>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DetailModal;
