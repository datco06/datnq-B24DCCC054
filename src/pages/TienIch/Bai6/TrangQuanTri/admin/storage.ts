import { destinationMocks, destinationStatsMock } from './mockData';
import type { Destination, DestinationStat } from './typing';

const DESTINATION_KEY = 'bai6_destinations';
const STATS_KEY = 'bai6_stats';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const read = <T>(key: string, fallback: T): T => {
	if (!isBrowser) return deepClone(fallback);
	const raw = window.localStorage.getItem(key);
	if (!raw) return deepClone(fallback);
	try {
		return JSON.parse(raw) as T;
	} catch {
		return deepClone(fallback);
	}
};

const write = <T>(key: string, data: T) => {
	if (!isBrowser) return;
	window.localStorage.setItem(key, JSON.stringify(data));
};

export const loadDestinations = (): Destination[] => read(DESTINATION_KEY, destinationMocks);
export const saveDestinations = (data: Destination[]) => write(DESTINATION_KEY, data);

export const loadStats = (): DestinationStat[] => read(STATS_KEY, destinationStatsMock);
export const saveStats = (data: DestinationStat[]) => write(STATS_KEY, data);
