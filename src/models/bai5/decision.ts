import useInitModel from '@/hooks/useInitModel';
import { BAI5_API_PREFIX, type GraduationDecision } from '@/services/Bai5/typing';

export default () => {
	const model = useInitModel<GraduationDecision.IRecord>('decisions', 'condition', undefined, BAI5_API_PREFIX, {
		issuedAt: -1,
	});
	return {
		...model,
	};
};
