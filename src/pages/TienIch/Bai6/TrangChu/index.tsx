import {
	ClearOutlined,
	CompassOutlined,
	EnvironmentOutlined,
	FilterOutlined,
	SearchOutlined,
	SortAscendingOutlined,
	StarFilled,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Modal, Rate, Row, Select, Slider, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import type { DiemDen, LoaiDiemDen } from './data';
import { danhSachDiemDen, mauLoai, tenLoai } from './data';
import styles from './index.less';
import { loadDestinations } from '../TrangQuanTri/admin/storage';
import type { Destination } from '../TrangQuanTri/admin/typing';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// Format giá tiền VND
const formatGia = (gia: number) => {
	return new Intl.NumberFormat('vi-VN').format(gia) + 'đ';
};

// Giá tối đa trong data
const GIA_TOI_DA = 5000000;

type SortMode = 'rating-desc' | 'rating-asc' | 'price-asc' | 'price-desc' | 'reviews-desc' | 'name-asc';

const PLACEHOLDER_IMAGE =
	'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=60';

const mapDestinations = (items: Destination[]): DiemDen[] => {
	return items.map((item) => {
		const loai: LoaiDiemDen = item.type === 'thanh-pho' ? 'thanhpho' : (item.type as LoaiDiemDen);
		return {
			id: item.id,
			ten: item.name,
			moTa: item.description,
			hinhAnh: item.image ?? PLACEHOLDER_IMAGE,
			diaDiem: item.location,
			loai,
			danhGia: item.rating,
			soLuotDanhGia: Math.max(100, Math.round(item.rating * 1800)),
			giaTien: item.costs.food + item.costs.transport + item.costs.stay,
			noiDung: ['Ẩm thực', 'Lưu trú', 'Trải nghiệm'],
			tags: [item.priceCategory],
		};
	});
};

const Bai6TrangChu: React.FC = () => {
	const [duLieuAdmin, setDuLieuAdmin] = useState<DiemDen[]>(() => mapDestinations(loadDestinations()));

	useEffect(() => {
		const syncData = () => {
			const data = mapDestinations(loadDestinations());
			setDuLieuAdmin(data);
		};
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', syncData);
			return () => window.removeEventListener('storage', syncData);
		}
		return () => undefined;
	}, []);

	const danhSachNguon = duLieuAdmin.length > 0 ? duLieuAdmin : danhSachDiemDen;

	// States
	const [tuKhoa, setTuKhoa] = useState('');
	const [loaiLoc, setLoaiLoc] = useState<LoaiDiemDen | 'tat-ca'>('tat-ca');
	const [khoangGia, setKhoangGia] = useState<[number, number]>([0, GIA_TOI_DA]);
	const [danhGiaToiThieu, setDanhGiaToiThieu] = useState<number>(0);
	const [sapXep, setSapXep] = useState<SortMode>('rating-desc');
	const [diemDenChiTiet, setDiemDenChiTiet] = useState<DiemDen | null>(null);

	// Filter + Sort Logic
	const danhSachDaLoc = useMemo(() => {
		let ketQua = [...danhSachNguon];

		// Lọc theo từ khóa
		if (tuKhoa.trim()) {
			const keyword = tuKhoa.toLowerCase().trim();
			ketQua = ketQua.filter(
				(dd) =>
					dd.ten.toLowerCase().includes(keyword) ||
					dd.diaDiem.toLowerCase().includes(keyword) ||
					dd.moTa.toLowerCase().includes(keyword) ||
					dd.tags.some((tag) => tag.toLowerCase().includes(keyword)),
			);
		}

		// Lọc theo loại
		if (loaiLoc !== 'tat-ca') {
			ketQua = ketQua.filter((dd) => dd.loai === loaiLoc);
		}

		// Lọc theo khoảng giá
		ketQua = ketQua.filter((dd) => dd.giaTien >= khoangGia[0] && dd.giaTien <= khoangGia[1]);

		// Lọc theo đánh giá tối thiểu
		if (danhGiaToiThieu > 0) {
			ketQua = ketQua.filter((dd) => dd.danhGia >= danhGiaToiThieu);
		}

		// Sắp xếp
		switch (sapXep) {
			case 'rating-desc':
				ketQua.sort((a, b) => b.danhGia - a.danhGia);
				break;
			case 'rating-asc':
				ketQua.sort((a, b) => a.danhGia - b.danhGia);
				break;
			case 'price-asc':
				ketQua.sort((a, b) => a.giaTien - b.giaTien);
				break;
			case 'price-desc':
				ketQua.sort((a, b) => b.giaTien - a.giaTien);
				break;
			case 'reviews-desc':
				ketQua.sort((a, b) => b.soLuotDanhGia - a.soLuotDanhGia);
				break;
			case 'name-asc':
				ketQua.sort((a, b) => a.ten.localeCompare(b.ten, 'vi'));
				break;
			default:
				break;
		}

		return ketQua;
	}, [tuKhoa, loaiLoc, khoangGia, danhGiaToiThieu, sapXep]);

	// Xóa bộ lọc
	const xoaBoLoc = () => {
		setTuKhoa('');
		setLoaiLoc('tat-ca');
		setKhoangGia([0, GIA_TOI_DA]);
		setDanhGiaToiThieu(0);
		setSapXep('rating-desc');
	};

	// Thống kê nhanh
	const thongKe = useMemo(() => {
		const soBien = danhSachNguon.filter((dd) => dd.loai === 'bien').length;
		const soNui = danhSachNguon.filter((dd) => dd.loai === 'nui').length;
		const soThanhPho = danhSachNguon.filter((dd) => dd.loai === 'thanhpho').length;
		const soLangQue = danhSachNguon.filter((dd) => dd.loai === 'lang-que').length;
		return { soBien, soNui, soThanhPho, soLangQue, tongSo: danhSachNguon.length };
	}, [danhSachNguon]);

	return (
		<div>
			{/* ===== Hero Banner ===== */}
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
						<div className={styles.statNumber}>{thongKe.tongSo}</div>
						<div className={styles.statLabel}>Điểm đến</div>
					</div>
					<div className={styles.statItem}>
						<div className={styles.statNumber}>{thongKe.soBien}</div>
						<div className={styles.statLabel}>Biển đảo</div>
					</div>
					<div className={styles.statItem}>
						<div className={styles.statNumber}>{thongKe.soNui}</div>
						<div className={styles.statLabel}>Núi rừng</div>
					</div>
					<div className={styles.statItem}>
						<div className={styles.statNumber}>{thongKe.soThanhPho}</div>
						<div className={styles.statLabel}>Thành phố</div>
					</div>
					{thongKe.soLangQue > 0 && (
						<div className={styles.statItem}>
							<div className={styles.statNumber}>{thongKe.soLangQue}</div>
							<div className={styles.statLabel}>Làng quê</div>
						</div>
					)}
				</div>
			</div>

			{/* ===== Filter Section ===== */}
			<div className={styles.filterSection}>
				<div className={styles.filterHeader}>
					<div className={styles.filterTitle}>
						<FilterOutlined />
						Bộ lọc & Tìm kiếm
					</div>
					<div className={styles.resultCount}>
						Tìm thấy <span>{danhSachDaLoc.length}</span> điểm đến
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
							max={GIA_TOI_DA}
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
							<Button icon={<ClearOutlined />} onClick={xoaBoLoc}>
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

			{/* ===== Destination Cards ===== */}
			{danhSachDaLoc.length > 0 ? (
				<Row gutter={[24, 24]}>
					{danhSachDaLoc.map((diemDen) => (
						<Col key={diemDen.id} xs={24} sm={12} lg={8}>
							<Card className={styles.destinationCard} hoverable onClick={() => setDiemDenChiTiet(diemDen)}>
								<div className={styles.cardImageWrapper}>
									<img src={diemDen.hinhAnh} alt={diemDen.ten} className={styles.cardImage} />
									<div className={styles.cardOverlay} />
									<div className={styles.cardBadge}>
										<Tag color={mauLoai[diemDen.loai]} style={{ borderRadius: 12, border: 'none', fontWeight: 600 }}>
											{tenLoai[diemDen.loai]}
										</Tag>
										{diemDen.tags.includes('Hot') && (
											<Tag color='#ff4d4f' style={{ borderRadius: 12, border: 'none', fontWeight: 600 }}>
												🔥 Hot
											</Tag>
										)}
										{diemDen.tags.includes('Di sản UNESCO') && (
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
										<div className={styles.cardRating}>
											<span className={styles.ratingScore}>{diemDen.danhGia}</span>
											<StarFilled style={{ color: '#fadb14', fontSize: 14 }} />
											<span className={styles.ratingCount}>
												({new Intl.NumberFormat('vi-VN').format(diemDen.soLuotDanhGia)})
											</span>
										</div>
										<div className={styles.cardTags}>
											{diemDen.tags
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
										{diemDen.noiDung.slice(0, 4).map((nd) => (
											<span key={nd} className={styles.highlightItem}>
												{nd}
											</span>
										))}
									</div>
								</div>
							</Card>
						</Col>
					))}
				</Row>
			) : (
				<div className={styles.emptyState}>
					<div className={styles.emptyIcon}>🔍</div>
					<h3>Không tìm thấy điểm đến</h3>
					<p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm điểm đến mới!</p>
					<Button type='primary' onClick={xoaBoLoc} style={{ borderRadius: 8 }}>
						Xóa bộ lọc
					</Button>
				</div>
			)}

			{/* ===== Footer Stats ===== */}
			<div className={styles.footerStats}>
				<div className={styles.footerTitle}>🌟 Thống kê điểm đến</div>
				<div className={styles.footerSubtitle}>Những con số ấn tượng từ cộng đồng du lịch</div>
				<div className={styles.statsRow}>
					<div className={styles.statCard}>
						<div className={styles.statValue}>
							{new Intl.NumberFormat('vi-VN').format(danhSachDiemDen.reduce((sum, dd) => sum + dd.soLuotDanhGia, 0))}
						</div>
						<div className={styles.statDesc}>Lượt đánh giá</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statValue}>
							{(danhSachDiemDen.reduce((sum, dd) => sum + dd.danhGia, 0) / danhSachDiemDen.length).toFixed(1)}⭐
						</div>
						<div className={styles.statDesc}>Đánh giá trung bình</div>
					</div>
					<div className={styles.statCard}>
						<div className={styles.statValue}>{danhSachDiemDen.length}+</div>
						<div className={styles.statDesc}>Điểm đến hấp dẫn</div>
					</div>
				</div>
			</div>

			{/* ===== Detail Modal ===== */}
			<Modal
				visible={!!diemDenChiTiet}
				onCancel={() => setDiemDenChiTiet(null)}
				footer={null}
				width={640}
				className={styles.detailModal}
				bodyStyle={{ padding: 0 }}
				closable
			>
				{diemDenChiTiet && (
					<>
						<img src={diemDenChiTiet.hinhAnh} alt={diemDenChiTiet.ten} className={styles.detailImage} />
						<div className={styles.detailContent}>
							<div className={styles.detailTitle}>{diemDenChiTiet.ten}</div>
							<div className={styles.detailLocation}>
								<EnvironmentOutlined />
								{diemDenChiTiet.diaDiem}
								<Tag color={mauLoai[diemDenChiTiet.loai]} style={{ borderRadius: 12, marginLeft: 8, border: 'none' }}>
									{tenLoai[diemDenChiTiet.loai]}
								</Tag>
							</div>
							<div className={styles.detailRating}>
								<span className={styles.ratingBadge}>{diemDenChiTiet.danhGia}</span>
								<Rate disabled allowHalf defaultValue={diemDenChiTiet.danhGia} />
								<span style={{ color: '#8c8c8c', fontSize: 14 }}>
									({new Intl.NumberFormat('vi-VN').format(diemDenChiTiet.soLuotDanhGia)} đánh giá)
								</span>
							</div>
							<Paragraph className={styles.detailDescription}>{diemDenChiTiet.moTa}</Paragraph>
							<div className={styles.detailHighlights}>
								<h4>📍 Điểm nổi bật</h4>
								<div className={styles.highlightList}>
									{diemDenChiTiet.noiDung.map((nd) => (
										<Tag key={nd} color='purple' style={{ borderRadius: 12, fontSize: 13, padding: '4px 12px' }}>
											{nd}
										</Tag>
									))}
								</div>
							</div>
							<div className={styles.detailFooter}>
								<div className={styles.detailPrice}>
									<div className={styles.priceLabel}>Giá từ</div>
									<span className={styles.priceValue}>{formatGia(diemDenChiTiet.giaTien)}</span>
									<span className={styles.priceUnit}>/ người</span>
								</div>
								<Button
									type='primary'
									size='large'
									style={{
										borderRadius: 12,
										height: 48,
										paddingInline: 32,
										background: 'linear-gradient(135deg, #667eea, #764ba2)',
										border: 'none',
										fontWeight: 600,
										fontSize: 15,
									}}
								>
									🗺️ Đặt tour ngay
								</Button>
							</div>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default Bai6TrangChu;
