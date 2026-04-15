import React from 'react';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Card, Tag } from 'antd';
import type { DestinationCardProps } from '@/services/Bai6';
import { mauLoai, tenLoai } from '@/services/Bai6';
import { formatGia } from '@/models/bai6/Common';
import styles from '../index.less';

const DestinationCard: React.FC<DestinationCardProps> = ({ diemDen, onClick }) => {
	return (
		<Card className={styles.destinationCard} hoverable onClick={() => onClick(diemDen)}>

			<div className={styles.cardImageWrapper}>
				<img src={diemDen.hinhAnh} alt={diemDen.ten} className={styles.cardImage} />
				<div className={styles.cardOverlay} />
				<div className={styles.cardBadge}>
					<Tag color={mauLoai[diemDen.loai]} style={{ borderRadius: 12, border: 'none', fontWeight: 600 }}>
						{tenLoai[diemDen.loai]}
					</Tag>
					{diemDen.tags?.includes('Hot') && (
						<Tag color='#ff4d4f' style={{ borderRadius: 12, border: 'none', fontWeight: 600 }}>
							🔥 Hot
						</Tag>
					)}
					{diemDen.tags?.includes('Di sản UNESCO') && (
						<Tag color='#722ed1' style={{ borderRadius: 12, border: 'none', fontWeight: 600 }}>
							🏛️ UNESCO
						</Tag>
					)}
				</div>
				<div className={styles.cardPrice}>{formatGia(diemDen.giaTien)}</div>
				<div className={styles.cardLocation}>
					<EnvironmentOutlined />
					{diemDen.diaDiem}
				</div>
			</div>
			<div className={styles.cardContent}>
				<div className={styles.cardTitle}>{diemDen.ten}</div>
				<div className={styles.cardDescription}>{diemDen.moTa}</div>
				<div className={styles.cardMeta}>
					<div className={styles.cardTags}>
						{(diemDen.tags ?? [])
							.filter((t) => !['Hot', 'Di sản UNESCO'].includes(t))
							.slice(0, 2)
							.map((tag) => (
								<Tag
									key={tag}
									style={{
										borderRadius: 10,
										fontSize: 11,
										border: '1px solid #e6e6ff',
										background: '#f5f5ff',
										color: '#667eea',
									}}
								>
									{tag}
								</Tag>
							))}
					</div>
				</div>
				<div className={styles.cardHighlights}>
					{(diemDen.noiDung ?? []).slice(0, 4).map((nd) => (
						<span key={nd} className={styles.highlightItem}>
							{nd}
						</span>
					))}
				</div>
			</div>
		</Card>
	);
};

export default DestinationCard;
