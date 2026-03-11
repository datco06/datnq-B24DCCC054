import type { Feedback } from './types';
import { feedbackMock } from './mockData';

const STORAGE_KEY = 'tienich_feedbacks';

const safeParse = (value: string | null): Feedback[] | null => {
	if (!value) return null;
	try {
		const parsed = JSON.parse(value) as Feedback[];
		if (Array.isArray(parsed)) return parsed;
		return null;
	} catch {
		return null;
	}
};

const hasStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const loadFeedbacks = (): Feedback[] => {
	if (hasStorage) {
		const value = window.localStorage.getItem(STORAGE_KEY);
		const parsed = safeParse(value);
		if (parsed) return parsed;
	}
	return feedbackMock;
};

export const saveFeedbacks = (data: Feedback[]) => {
	if (hasStorage) {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}
};
