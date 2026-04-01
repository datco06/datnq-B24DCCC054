export type DestinationType = 'bien' | 'nui' | 'thanh-pho' | 'lang-que';

export interface Destination {
	id: string;
	name: string;
	location: string;
	type: DestinationType;
	description: string;
	priceCategory: 'tiet-kiem' | 'tieu-chuan' | 'cao-cap';
	rating: number;
	recommendedDuration: number; // giờ
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
