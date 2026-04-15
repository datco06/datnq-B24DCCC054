import { useState, useCallback, useMemo } from 'react';
import type { Destination, DestinationStat } from '@/services/Bai6';
import { DestinationType, LoaiDiemDen, SortMode } from '@/services/Bai6';
import { danhSachDiemDen } from '@/services/Bai6';
import { filterAndSortDestinations, mapDestinations } from './bai6/TrangChu';

// Key for storage (shared with admin)
const DESTINATION_KEY = 'bai6_destinations';

export default () => {
	const [rawDestinations, setRawDestinations] = useState<Destination[]>([]);
	const [stats, setStats] = useState<DestinationStat[]>([]);
	const [tuKhoa, setTuKhoa] = useState('');
	const [loaiLoc, setLoaiLoc] = useState<LoaiDiemDen | 'tat-ca'>('tat-ca');
	const [khoangGia, setKhoangGia] = useState<[number, number]>([0, 5000000]);
	const [danhGiaToiThieu, setDanhGiaToiThieu] = useState<number>(0);
	const [sapXep, setSapXep] = useState<SortMode>(SortMode.RatingDesc);

	// Map and merge data
	const destinations = useMemo<Destination[]>(() => {
		if (rawDestinations.length > 0) return rawDestinations;
		return mapDestinations(danhSachDiemDen);
	}, [rawDestinations]);


	// Filtered list (Destination[]) - dùng cho các tính năng filter/sort
	const filteredDestinations = useMemo(() => {
		return filterAndSortDestinations(
			destinations,
			tuKhoa,
			loaiLoc,
			khoangGia,
			danhGiaToiThieu,
			sapXep
		);
	}, [destinations, tuKhoa, loaiLoc, khoangGia, danhGiaToiThieu, sapXep]);

	// Filtered DiemDen gốc - filter thẳng từ mock data để luôn có đủ hinhAnh/tags/noiDung
	const filteredDiemDen = useMemo(() => {
		let result = danhSachDiemDen.filter((dd) => {
			const matchTuKhoa =
				!tuKhoa ||
				dd.ten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
				dd.diaDiem.toLowerCase().includes(tuKhoa.toLowerCase());
			const matchLoai = loaiLoc === 'tat-ca' || dd.loai === loaiLoc;
			const matchGia = dd.giaTien >= khoangGia[0] && dd.giaTien <= khoangGia[1];
			const matchDanhGia = dd.danhGia >= danhGiaToiThieu;
			return matchTuKhoa && matchLoai && matchGia && matchDanhGia;
		});
		switch (sapXep) {
			case SortMode.RatingDesc: result = result.sort((a, b) => b.danhGia - a.danhGia); break;
			case SortMode.RatingAsc: result = result.sort((a, b) => a.danhGia - b.danhGia); break;
			case SortMode.PriceAsc: result = result.sort((a, b) => a.giaTien - b.giaTien); break;
			case SortMode.PriceDesc: result = result.sort((a, b) => b.giaTien - a.giaTien); break;
			case SortMode.NameAsc: result = result.sort((a, b) => a.ten.localeCompare(b.ten)); break;
			default: break;
		}
		return result;
	}, [tuKhoa, loaiLoc, khoangGia, danhGiaToiThieu, sapXep]);

	const loadData = useCallback(() => {
		if (typeof window === 'undefined') return;
		const raw = localStorage.getItem(DESTINATION_KEY);
		if (raw) {
			try {
				setRawDestinations(JSON.parse(raw));
			} catch (e) {
				setRawDestinations([]);
			}
		}

		const rawStats = localStorage.getItem('bai6_stats');
		if (rawStats) {
			try {
				setStats(JSON.parse(rawStats));
			} catch (e) {
				setStats([]);
			}
		} else {
			// Tự động seed dữ liệu thống kê mẫu nếu chưa có
			const now = new Date();
			const defaultStats: DestinationStat[] = Array.from({ length: 6 }, (_, i) => {
				const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
				const month = `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
				const popularTypes: DestinationType[] = [DestinationType.Bien, DestinationType.Nui, DestinationType.ThanhPho, DestinationType.LangQue];
				return {
					month,
					trips: Math.floor(Math.random() * 80) + 20,
					revenue: (Math.floor(Math.random() * 500) + 100) * 1_000_000,
					popularType: popularTypes[i % popularTypes.length],
				};
			});
			localStorage.setItem('bai6_stats', JSON.stringify(defaultStats));
			setStats(defaultStats);
		}
	}, []);

	const resetFilters = useCallback(() => {
		setTuKhoa('');
		setLoaiLoc('tat-ca');
		setKhoangGia([0, 5000000]);
		setDanhGiaToiThieu(0);
		setSapXep(SortMode.RatingDesc);
	}, []);

	const updateDestinations = useCallback((next: Destination[]) => {
		setRawDestinations(next);
		if (typeof window !== 'undefined') {
			localStorage.setItem(DESTINATION_KEY, JSON.stringify(next));
		}
	}, []);

	return {
		rawDestinations,
		updateDestinations,
		destinations,
		stats,
		filteredDestinations,
		filteredDiemDen,
		tuKhoa,
		setTuKhoa,
		loaiLoc,
		setLoaiLoc,
		khoangGia,
		setKhoangGia,
		danhGiaToiThieu,
		setDanhGiaToiThieu,
		sapXep,
		setSapXep,
		loadData,
		resetFilters,
	};
};

