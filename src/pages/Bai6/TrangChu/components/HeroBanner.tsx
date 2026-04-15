import React from 'react';
import { CompassOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import styles from '../index.less';

const { Title, Paragraph } = Typography;

interface HeroBannerProps {
	stats: {
		tongSo: number;
		soBien: number;
		soNui: number;
		soThanhPho: number;
		soLangQue: number;
	};
}

const HeroBanner: React.FC<HeroBannerProps> = ({ stats }) => {
	return (
		<div className={styles.heroBanner}>
			<div className={styles.heroOverlay} />
			<div className={styles.heroContent}>
				<Title level={1}>
					<CompassOutlined style={{ marginRight: 12 }} />
					Khám Phá Điểm Đến
				</Title>
				<Paragraph>
					Khám phá những điểm đến tuyệt vời nhất Việt Nam — từ vịnh biển thơ mộng, đỉnh núi hùng vĩ đến phố phường
					nhộn nhịp. Hành trình của bạn bắt đầu từ đây!
				</Paragraph>
			</div>
			<div className={styles.heroStats}>
				<div className={styles.statItem}>
					<div className={styles.statNumber}>{stats.tongSo}</div>
					<div className={styles.statLabel}>Điểm đến</div>
				</div>
				<div className={styles.statItem}>
					<div className={styles.statNumber}>{stats.soBien}</div>
					<div className={styles.statLabel}>Biển đảo</div>
				</div>
				<div className={styles.statItem}>
					<div className={styles.statNumber}>{stats.soNui}</div>
					<div className={styles.statLabel}>Núi rừng</div>
				</div>
				<div className={styles.statItem}>
					<div className={styles.statNumber}>{stats.soThanhPho}</div>
					<div className={styles.statLabel}>Thành phố</div>
				</div>
				{stats.soLangQue > 0 && (
					<div className={styles.statItem}>
						<div className={styles.statNumber}>{stats.soLangQue}</div>
						<div className={styles.statLabel}>Làng quê</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HeroBanner;
