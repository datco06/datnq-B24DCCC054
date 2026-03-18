import useInitModel from '@/hooks/useInitModel';
import { BAI5_API_PREFIX, type DiplomaBook } from '@/services/Bai5/typing';

export default () => {
	const model = useInitModel<DiplomaBook.IRecord>('books', 'condition', undefined, BAI5_API_PREFIX);
	return {
		...model,
	};
};
