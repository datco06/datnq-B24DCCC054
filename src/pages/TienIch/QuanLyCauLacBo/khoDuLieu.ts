import { duLieuQuanLyCauLacBoMau } from './duLieuMau';
import type { DuLieuQuanLyCauLacBo } from './typing';

const khoaKho = 'tienich_quan_ly_cau_lac_bo';

const laTrinhDuyet = typeof window !== 'undefined';

const saoChep = <T,>(duLieu: T): T => JSON.parse(JSON.stringify(duLieu));

export const taiDuLieuQuanLyCauLacBo = (): DuLieuQuanLyCauLacBo => {
	if (!laTrinhDuyet) return saoChep(duLieuQuanLyCauLacBoMau);
	try {
		const duLieuTho = window.localStorage.getItem(khoaKho);
		if (!duLieuTho) return saoChep(duLieuQuanLyCauLacBoMau);
		return JSON.parse(duLieuTho) as DuLieuQuanLyCauLacBo;
	} catch {
		return saoChep(duLieuQuanLyCauLacBoMau);
	}
};

export const luuDuLieuQuanLyCauLacBo = (duLieu: DuLieuQuanLyCauLacBo) => {
	if (!laTrinhDuyet) return;
	window.localStorage.setItem(khoaKho, JSON.stringify(duLieu));
};
