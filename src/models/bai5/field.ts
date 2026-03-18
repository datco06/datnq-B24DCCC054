import useInitModel from '@/hooks/useInitModel';
import { BAI5_API_PREFIX, type DiplomaField } from '@/services/Bai5/typing';

export default () => {
	const model = useInitModel<DiplomaField.IRecord>('fields', 'condition', undefined, BAI5_API_PREFIX, { order: 1 });
	return {
		...model,
	};
};
