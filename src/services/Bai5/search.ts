import axios from '@/utils/axios';
import { BAI5_API_PREFIX, type DiplomaSearch } from './typing';

export const searchDiploma = async (payload: DiplomaSearch.IRequest) => {
	const response = await axios.post(`${BAI5_API_PREFIX}/diplomas/search`, payload);
	return response?.data?.data as DiplomaSearch.IResponse;
};
