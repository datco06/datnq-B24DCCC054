import useInitModel from '@/hooks/useInitModel';
import { BAI5_API_PREFIX, type DiplomaInfo } from '@/services/Bai5/typing';

export default () => {
	const model = useInitModel<DiplomaInfo.IRecord>('diplomas', 'condition', undefined, BAI5_API_PREFIX, {
		entryNumber: -1,
	});
	return {
		...model,
	};
};
