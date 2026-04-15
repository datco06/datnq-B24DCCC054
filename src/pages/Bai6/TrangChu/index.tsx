import { Button, Col, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import type { DiemDen } from '@/services/Bai6/typing';
import { danhSachDiemDen } from '@/services/Bai6';
import HeroBanner from './components/HeroBanner';
import FilterSection from './components/FilterSection';
import DestinationCard from './components/DestinationCard';
import DetailModal from './components/DetailModal';
import styles from './index.less';

const Bai6TrangChu: React.FC = () => {
	const {
		filteredDiemDen,
		loadData,
		resetFilters
	} = useModel('bai6Model');

	const [diemDenChiTiet, setDiemDenChiTiet] = useState<DiemDen | null>(null);

	useEffect(() => {
		loadData();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', loadData);
			return () => window.removeEventListener('storage', loadData);
		}
		return () => undefined;
	}, [loadData]);

	// Thống kê nhanh
	const thongKe = useMemo(() => {
		const source = danhSachDiemDen;
		const soBien = source.filter((dd) => dd.loai === 'bien').length;
		const soNui = source.filter((dd) => dd.loai === 'nui').length;
		const soThanhPho = source.filter((dd) => dd.loai === 'thanhpho').length;
		const soLangQue = source.filter((dd) => dd.loai === 'lang-que').length;
		return { soBien, soNui, soThanhPho, soLangQue, tongSo: source.length };
	}, []);

	return (
		<div>
			<HeroBanner stats={thongKe} />
			<FilterSection />

			{/* ===== Destination Cards ===== */}
			{filteredDiemDen.length > 0 ? (
				<Row gutter={[24, 24]}>
					{filteredDiemDen.map((diemDen) => (
						<Col key={diemDen.id} xs={24} sm={12} lg={8}>
							<DestinationCard
								diemDen={diemDen}
								onClick={() => setDiemDenChiTiet(diemDen)}
							/>
						</Col>
					))}
				</Row>
			) : (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>🔍</div>
					<h3>Không tìm thấy điểm đến</h3>
					<p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm điểm đến mới!</p>
					<Button type='primary' onClick={resetFilters} style={{ borderRadius: 8 }}>
						Xóa bộ lọc
					</Button>
				</div>
			)
			}


			<DetailModal
				diemDen={diemDenChiTiet}
				onCancel={() => setDiemDenChiTiet(null)}
			/>
		</div>
	);
};

export default Bai6TrangChu;
