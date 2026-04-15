import React from 'react';
import { ClearOutlined, FilterOutlined, SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Button, Input, Select, Slider, Tooltip } from 'antd';
import { useModel } from 'umi';
import { tenLoai } from '@/services/Bai6';
import { formatGia } from '@/models/bai6/Common';
import styles from '../index.less';

const { Option } = Select;

const FilterSection: React.FC = () => {
	const {
		tuKhoa, setTuKhoa,
		loaiLoc, setLoaiLoc,
		khoangGia, setKhoangGia,
		danhGiaToiThieu, setDanhGiaToiThieu,
		sapXep, setSapXep,
		resetFilters,
		filteredDestinations
	} = useModel('bai6.bai6Model');

	return (
		<>
			{/* ===== Filter Section ===== */}
			<div className={styles.filterSection}>
				<div className={styles.filterHeader}>
					<div className={styles.filterTitle}>
						<FilterOutlined />
						Bộ lọc & Tìm kiếm
					</div>
					<div className={styles.resultCount}>
						Tìm thấy <span>{filteredDestinations.length}</span> điểm đến
					</div>
				</div>
				<div className={styles.filterRow}>
					<div className={styles.filterItem}>
						<div className={styles.filterLabel}>Tìm kiếm</div>
						<Input
							placeholder='Tìm theo tên, địa điểm, tag...'
							prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
							value={tuKhoa}
							onChange={(e) => setTuKhoa(e.target.value)}
							allowClear
							style={{ borderRadius: 8 }}
						/>
					</div>
					<div className={styles.filterItem}>
						<div className={styles.filterLabel}>Loại hình</div>
						<Select value={loaiLoc} onChange={setLoaiLoc} style={{ width: '100%', borderRadius: 8 }}>
							<Option value='tat-ca'>🌍 Tất cả</Option>
							{Object.entries(tenLoai).map(([key, label]) => (
								<Option key={key} value={key}>
									{label}
								</Option>
							))}
						</Select>
					</div>
					<div className={styles.filterItem}>
						<div className={styles.filterLabel}>
							Khoảng giá: {formatGia(khoangGia[0])} - {formatGia(khoangGia[1])}
						</div>
						<Slider
							range
							min={0}
							max={5000000}
							step={100000}
							value={khoangGia}
							onChange={(val) => setKhoangGia(val as [number, number])}
							tipFormatter={(val) => formatGia(val || 0)}
						/>
					</div>
					<div className={styles.filterItem}>
						<div className={styles.filterLabel}>Đánh giá tối thiểu</div>
						<Select value={danhGiaToiThieu} onChange={setDanhGiaToiThieu} style={{ width: '100%' }}>
							<Option value={0}>Tất cả</Option>
							<Option value={4}>⭐ 4.0 trở lên</Option>
							<Option value={4.5}>⭐ 4.5 trở lên</Option>
							<Option value={4.7}>⭐ 4.7 trở lên</Option>
						</Select>
					</div>
					<div className={styles.filterActions}>
						<Tooltip title='Xóa bộ lọc'>
							<Button icon={<ClearOutlined />} onClick={resetFilters}>
								Xóa lọc
							</Button>
						</Tooltip>
					</div>
				</div>
			</div>

			{/* ===== Sort Bar ===== */}
			<div className={styles.sortBar}>
				<div className={styles.sortLeft}>
					<SortAscendingOutlined style={{ fontSize: 16, color: '#667eea' }} />
					<span className={styles.sortLabel}>Sắp xếp theo:</span>
					<Select value={sapXep} onChange={setSapXep} style={{ width: 200 }}>
						<Option value='rating-desc'>⭐ Đánh giá cao nhất</Option>
						<Option value='rating-asc'>Đánh giá thấp nhất</Option>
						<Option value='price-asc'>💰 Giá thấp → cao</Option>
						<Option value='price-desc'>💰 Giá cao → thấp</Option>
						<Option value='reviews-desc'>🔥 Phổ biến nhất</Option>
						<Option value='name-asc'>🔤 Tên A → Z</Option>
					</Select>
				</div>
			</div>
		</>
	);
};

export default FilterSection;
