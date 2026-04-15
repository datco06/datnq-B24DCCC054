export enum LoaiDiemDen {
	Bien = 'bien',
	Nui = 'nui',
	ThanhPho = 'thanhpho',
	LangQue = 'lang-que',
}

export enum DestinationType {
	Bien = 'bien',
	Nui = 'nui',
	ThanhPho = 'thanhpho',
	LangQue = 'lang-que',
}

export enum SortMode {
	RatingDesc = 'rating-desc',
	RatingAsc = 'rating-asc',
	PriceAsc = 'price-asc',
	PriceDesc = 'price-desc',
	ReviewsDesc = 'reviews-desc',
	NameAsc = 'name-asc',
}

export enum PlanStatus {
	Draft = 'draft',
	Published = 'published',
}

export interface Destination {
	id: string;
	name: string;
	location: string;
	type: DestinationType;
	description: string;
	priceCategory: 'tiet-kiem' | 'tieu-chuan' | 'cao-cap';
	rating: number;
	recommendedDuration: number;
	image?: string;
	costs: {
		food: number;
		transport: number;
		stay: number;
	};
}

export interface DestinationStat {
	month: string;
	trips: number;
	revenue: number;
	popularType: DestinationType;
}

export interface DiemDen {
	id: string;
	ten: string;
	moTa: string;
	hinhAnh: string;
	diaDiem: string;
	loai: LoaiDiemDen;
	danhGia: number;
	soLuotDanhGia: number;
	giaTien: number; // VND / người
	noiDung: string[];
	tags: string[];
}

export interface SelectionControlProps {
	destinations: Destination[];
	startPoint: string | undefined;
	setStartPoint: (val: string | undefined) => void;
	selected: string | undefined;
	setSelected: (val: string | undefined) => void;
	addDay: () => void;
}

export interface ItineraryOverviewProps {
	travelCost: number;
	stayCost: number;
	totalDuration: number;
}

export interface DayPlanProps {
	day: string;
	itinerary: string[];
	destinations: Destination[];
	startPoint: string | undefined;
	addDestination: (day: string) => void;
	removeDestination: (day: string, index: number) => void;
}

export interface StatsCardsProps {
	stats: DestinationStat[];
	destinations: Destination[];
}

export interface DestinationFormProps {
	editing?: Destination | null;
	onSubmit: (payload: Omit<Destination, 'id'>) => void;
	onCancelEdit: () => void;
}

export interface DestinationTableProps {
	data: Destination[];
	onEdit: (record: Destination) => void;
	onDelete: (id: string) => void;
}

export interface BudgetChartsProps {
	categoryTotals: { food: number; transport: number; stay: number };
}

export interface BudgetOverviewProps {
	budgetLimit: number;
	setBudgetLimit: (val: number) => void;
	categoryTotals: { food: number; transport: number; stay: number };
}

export interface ExpensiveDestinationsProps {
	destinations: Destination[];
}

export interface MonthlyStatsProps {
	stats: DestinationStat[];
}

export interface DestinationCardProps {
	diemDen: DiemDen;
	onClick: (item: DiemDen) => void;
}

export interface DetailModalProps {
	diemDen: DiemDen | null;
	onCancel: () => void;
}
