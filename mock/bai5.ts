import type { Request, Response } from 'express';
import type { DiplomaBook, DiplomaField, GraduationDecision, DiplomaInfo } from '../src/services/Bai5/typing';

type PaginateResult<T> = {
	result: T[];
	total: number;
};

const now = () => new Date().toISOString();

const createId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const toNumber = (value: any, fallback = 0) => {
	const num = Number(value);
	return Number.isNaN(num) ? fallback : num;
};

const paginate = <T>(data: T[], page?: any, limit?: any): PaginateResult<T> => {
	const pageNum = toNumber(page, 1) || 1;
	const limitNum = toNumber(limit, 10) || 10;
	const start = (pageNum - 1) * limitNum;
	return {
		result: data.slice(start, start + limitNum),
		total: data.length,
	};
};

const respond = <T>(res: Response, payload: T) => {
	res.json({
		data: payload,
		success: true,
	});
};

const respondError = (res: Response, message: string, status = 400) => {
	res.status(status).json({
		success: false,
		message,
	});
};

let fieldDefinitions: DiplomaField.IRecord[] = [
	{
		_id: 'field_ethnicity',
		code: 'ETHNICITY',
		label: 'Dân tộc',
		dataType: 'string',
		required: true,
		order: 1,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'field_birthplace',
		code: 'BIRTH_PLACE',
		label: 'Nơi sinh',
		dataType: 'string',
		order: 2,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'field_gpa',
		code: 'GPA',
		label: 'Điểm trung bình',
		dataType: 'number',
		order: 3,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'field_enroll',
		code: 'ENROLL_DATE',
		label: 'Ngày nhập học',
		dataType: 'date',
		order: 4,
		createdAt: now(),
		updatedAt: now(),
	},
];

let books: DiplomaBook.IRecord[] = [
	{
		_id: 'book_2024',
		code: 'SVB-2024',
		name: 'Sổ văn bằng năm 2024',
		year: 2024,
		description: 'Sổ quản lý văn bằng phát hành năm 2024',
		status: 'active',
		createdAt: now(),
		updatedAt: now(),
		totalDiploma: 2,
		lastEntryNumber: 2,
	},
	{
		_id: 'book_2023',
		code: 'SVB-2023',
		name: 'Sổ văn bằng năm 2023',
		year: 2023,
		description: 'Đã kết sổ',
		status: 'archived',
		createdAt: now(),
		updatedAt: now(),
		totalDiploma: 1,
		lastEntryNumber: 1,
	},
];

let decisions: GraduationDecision.IRecord[] = [
	{
		_id: 'decision_1',
		code: '123/QĐ-ĐT-2024',
		issuedAt: '2024-05-20',
		summary: 'Công nhận tốt nghiệp đợt tháng 5/2024',
		bookId: 'book_2024',
		bookName: 'Sổ văn bằng năm 2024',
		bookYear: 2024,
		searchCount: 0,
		diplomaCount: 2,
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'decision_2',
		code: '88/QĐ-ĐT-2023',
		issuedAt: '2023-09-15',
		summary: 'Đợt tốt nghiệp tháng 9/2023',
		bookId: 'book_2023',
		bookName: 'Sổ văn bằng năm 2023',
		bookYear: 2023,
		searchCount: 0,
		diplomaCount: 1,
		createdAt: now(),
		updatedAt: now(),
	},
];

let diplomas: DiplomaInfo.IRecord[] = [
	{
		_id: 'diploma_1',
		bookId: 'book_2024',
		bookName: 'Sổ văn bằng năm 2024',
		decisionId: 'decision_1',
		decisionCode: '123/QĐ-ĐT-2024',
		entryNumber: 1,
		serialNumber: 'GD-2024-0001',
		studentCode: 'B21DCCN001',
		fullName: 'Nguyễn Văn A',
		dob: '2002-07-15',
		extras: {
			ETHNICITY: 'Kinh',
			BIRTH_PLACE: 'Hà Nội',
			GPA: 3.5,
			ENROLL_DATE: '2018-09-01',
		},
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'diploma_2',
		bookId: 'book_2024',
		bookName: 'Sổ văn bằng năm 2024',
		decisionId: 'decision_1',
		decisionCode: '123/QĐ-ĐT-2024',
		entryNumber: 2,
		serialNumber: 'GD-2024-0002',
		studentCode: 'B21DCCN010',
		fullName: 'Trần Thị B',
		dob: '2002-12-02',
		extras: {
			ETHNICITY: 'Tày',
			BIRTH_PLACE: 'Bắc Kạn',
			GPA: 3.2,
			ENROLL_DATE: '2018-09-01',
		},
		createdAt: now(),
		updatedAt: now(),
	},
	{
		_id: 'diploma_3',
		bookId: 'book_2023',
		bookName: 'Sổ văn bằng năm 2023',
		decisionId: 'decision_2',
		decisionCode: '88/QĐ-ĐT-2023',
		entryNumber: 1,
		serialNumber: 'GD-2023-0101',
		studentCode: 'B20DCCN020',
		fullName: 'Lê Văn C',
		dob: '2001-03-18',
		extras: {
			ETHNICITY: 'Kinh',
			BIRTH_PLACE: 'Thanh Hóa',
			GPA: 3.0,
			ENROLL_DATE: '2017-09-01',
		},
		createdAt: now(),
		updatedAt: now(),
	},
];

const getBook = (id: string) => books.find((item) => item._id === id);
const getDecision = (id: string) => decisions.find((item) => item._id === id);

const ensureUniqueBookYear = (year: number, id?: string) => {
	const exist = books.find((book) => book.year === year && book._id !== id);
	if (exist) {
		throw new Error(`Đã tồn tại sổ văn bằng cho năm ${year}`);
	}
};

const syncBookCounters = () => {
	books = books.map((book) => {
		const total = diplomas.filter((d) => d.bookId === book._id).length;
		const last = total > 0 ? Math.max(...diplomas.filter((d) => d.bookId === book._id).map((d) => d.entryNumber)) : 0;
		return {
			...book,
			totalDiploma: total,
			lastEntryNumber: last,
		};
	});
};

const syncDecisionCounters = () => {
	decisions = decisions.map((decision) => {
		const total = diplomas.filter((d) => d.decisionId === decision._id).length;
		return {
			...decision,
			diplomaCount: total,
		};
	});
};

const nextEntryNumber = (bookId: string) => {
	const bookDiplomas = diplomas.filter((diploma) => diploma.bookId === bookId);
	if (bookDiplomas.length === 0) return 1;
	return Math.max(...bookDiplomas.map((d) => d.entryNumber)) + 1;
};

const parseCondition = (query: Request['query']) => {
	const condition = query?.condition;
	if (!condition) return undefined;
	if (typeof condition === 'string') {
		try {
			return JSON.parse(condition);
		} catch {
			return undefined;
		}
	}
	return condition as Record<string, any>;
};

const filterBooks = (condition?: Record<string, any>) => {
	if (!condition) return books;
	return books.filter((book) => {
		if (condition.year && Number(condition.year) !== book.year) return false;
		if (condition.status && condition.status !== book.status) return false;
		if (condition.keyword) {
			const keyword = String(condition.keyword).toLowerCase();
			return [book.code, book.name, book.description].some((val) => val?.toLowerCase().includes(keyword));
		}
		return true;
	});
};

const filterDecisions = (condition?: Record<string, any>) => {
	if (!condition) return decisions;
	return decisions.filter((decision) => {
		if (condition.bookId && decision.bookId !== condition.bookId) return false;
		if (condition.keyword) {
			const keyword = String(condition.keyword).toLowerCase();
			return [decision.code, decision.summary, decision.bookName].some((val) => val?.toLowerCase().includes(keyword));
		}
		return true;
	});
};

const filterFields = (condition?: Record<string, any>) => {
	if (!condition) return fieldDefinitions;
	return fieldDefinitions.filter((field) => {
		if (condition.dataType && field.dataType !== condition.dataType) return false;
		if (condition.keyword) {
			const keyword = String(condition.keyword).toLowerCase();
			return [field.code, field.label, field.description].some((val) => val?.toLowerCase().includes(keyword));
		}
		return true;
	});
};

const filterDiplomas = (condition?: Record<string, any>) => {
	if (!condition) return diplomas;
	return diplomas.filter((diploma) => {
		if (condition.bookId && diploma.bookId !== condition.bookId) return false;
		if (condition.decisionId && diploma.decisionId !== condition.decisionId) return false;
		if (condition.studentCode && !diploma.studentCode.toLowerCase().includes(String(condition.studentCode).toLowerCase())) return false;
		if (condition.fullName && !diploma.fullName.toLowerCase().includes(String(condition.fullName).toLowerCase())) return false;
		return true;
	});
};

const handleGetBooks = (req: Request, res: Response) => {
	const data = filterBooks(parseCondition(req.query));
	const { result, total } = paginate(data, req.query.page, req.query.limit);
	respond(res, { result, total });
};

const handleGetBookMany = (req: Request, res: Response) => {
	const data = filterBooks(parseCondition(req.query));
	respond(res, data);
};

const handlePostBook = (req: Request, res: Response) => {
	try {
		const payload = req.body as Partial<DiplomaBook.TPayload>;
		if (!payload?.year || !payload.name || !payload.code) {
			return respondError(res, 'Thiếu thông tin bắt buộc');
		}
		ensureUniqueBookYear(payload.year);
		const record: DiplomaBook.IRecord = {
			_id: createId('book'),
			code: payload.code,
			name: payload.name,
			description: payload.description,
			year: payload.year,
			status: payload.status ?? 'active',
			createdAt: now(),
			updatedAt: now(),
			totalDiploma: 0,
			lastEntryNumber: 0,
		};
		books.unshift(record);
		respond(res, record);
	} catch (error: any) {
		respondError(res, error?.message ?? 'Không thể tạo sổ văn bằng');
	}
};

const handlePutBook = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = books.findIndex((book) => book._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy sổ văn bằng', 404);
	try {
		const payload = req.body as Partial<DiplomaBook.TPayload>;
		if (payload.year) ensureUniqueBookYear(payload.year, id);
		const updated = {
			...books[idx],
			...payload,
			updatedAt: now(),
		};
		books[idx] = updated;
		decisions = decisions.map((decision) =>
			decision.bookId === id
				? { ...decision, bookName: updated.name, bookYear: updated.year }
				: decision,
		);
		diplomas = diplomas.map((diploma) =>
			diploma.bookId === id ? { ...diploma, bookName: updated.name } : diploma,
		);
		respond(res, updated);
	} catch (error: any) {
		respondError(res, error?.message ?? 'Không thể cập nhật sổ');
	}
};

const handleDeleteBook = (req: Request, res: Response) => {
	const id = req.params.id;
	const hasDecision = decisions.some((decision) => decision.bookId === id);
	if (hasDecision) return respondError(res, 'Không thể xóa: đã có quyết định gắn với sổ này');
	const idx = books.findIndex((book) => book._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy sổ', 404);
	const removed = books.splice(idx, 1)[0];
	respond(res, removed);
};

const handleGetFields = (req: Request, res: Response) => {
	const data = filterFields(parseCondition(req.query));
	const { result, total } = paginate(data, req.query.page, req.query.limit);
	respond(res, { result, total });
};

const handleGetFieldMany = (req: Request, res: Response) => {
	const data = filterFields(parseCondition(req.query));
	respond(res, data);
};

const handlePostField = (req: Request, res: Response) => {
	const payload = req.body as Partial<DiplomaField.TPayload>;
	if (!payload?.code || !payload.label || !payload.dataType) {
		return respondError(res, 'Thiếu thông tin trường');
	}
	const exist = fieldDefinitions.some(
		(field) => field.code.toLowerCase() === payload.code?.toLowerCase(),
	);
	if (exist) return respondError(res, 'Mã trường đã tồn tại');
	const record: DiplomaField.IRecord = {
		_id: createId('field'),
		code: payload.code.toUpperCase(),
		label: payload.label,
		dataType: payload.dataType,
		required: payload.required ?? false,
		description: payload.description,
		order: payload.order ?? fieldDefinitions.length + 1,
		createdAt: now(),
		updatedAt: now(),
	};
	fieldDefinitions.push(record);
	respond(res, record);
};

const handlePutField = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = fieldDefinitions.findIndex((field) => field._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy trường', 404);
	const payload = req.body as Partial<DiplomaField.TPayload>;
	const prevCode = fieldDefinitions[idx].code;
	const nextCode = payload.code ? payload.code.toUpperCase() : prevCode;
	fieldDefinitions[idx] = {
		...fieldDefinitions[idx],
		...payload,
		updatedAt: now(),
		code: nextCode,
	};
	diplomas = diplomas.map((diploma) => {
		const newExtras = { ...diploma.extras };
		if (payload.code && nextCode !== prevCode) {
			newExtras[nextCode] = newExtras[prevCode];
			delete newExtras[prevCode];
		}
		return { ...diploma, extras: newExtras };
	});
	respond(res, fieldDefinitions[idx]);
};

const handleDeleteField = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = fieldDefinitions.findIndex((field) => field._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy trường', 404);
	const removed = fieldDefinitions.splice(idx, 1)[0];
	diplomas = diplomas.map((diploma) => {
		const newExtras = { ...diploma.extras };
		delete newExtras[removed.code];
		return { ...diploma, extras: newExtras };
	});
	respond(res, removed);
};

const handleGetDecisions = (req: Request, res: Response) => {
	const data = filterDecisions(parseCondition(req.query));
	const { result, total } = paginate(data, req.query.page, req.query.limit);
	respond(res, { result, total });
};

const handleGetDecisionMany = (req: Request, res: Response) => {
	const data = filterDecisions(parseCondition(req.query));
	respond(res, data);
};

const handlePostDecision = (req: Request, res: Response) => {
	const payload = req.body as Partial<GraduationDecision.TPayload>;
	if (!payload?.bookId || !payload.code || !payload.issuedAt) {
		return respondError(res, 'Thiếu thông tin quyết định');
	}
	const book = getBook(payload.bookId);
	if (!book) return respondError(res, 'Sổ văn bằng không tồn tại');
	const record: GraduationDecision.IRecord = {
		_id: createId('decision'),
		code: payload.code,
		issuedAt: payload.issuedAt,
		summary: payload.summary ?? '',
		bookId: payload.bookId,
		bookName: book.name,
		bookYear: book.year,
		searchCount: 0,
		diplomaCount: 0,
		createdAt: now(),
		updatedAt: now(),
	};
	decisions.unshift(record);
	respond(res, record);
};

const handlePutDecision = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = decisions.findIndex((decision) => decision._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy quyết định', 404);
	const payload = req.body as Partial<GraduationDecision.TPayload>;
	let updatedBookProps = {};
	if (payload.bookId && payload.bookId !== decisions[idx].bookId) {
		const book = getBook(payload.bookId);
		if (!book) return respondError(res, 'Sổ văn bằng không tồn tại');
		updatedBookProps = { bookName: book.name, bookYear: book.year };
	}
	const updated = {
		...decisions[idx],
		...payload,
		...updatedBookProps,
		updatedAt: now(),
	};
	decisions[idx] = updated;
	const updatedBook = getBook(updated.bookId);
	diplomas = diplomas.map((diploma) =>
		diploma.decisionId === id
			? { ...diploma, decisionCode: updated.code, bookId: updated.bookId, bookName: updatedBook?.name ?? diploma.bookName }
			: diploma,
	);
	syncBookCounters();
	respond(res, updated);
};

const handleDeleteDecision = (req: Request, res: Response) => {
	const id = req.params.id;
	const hasDiploma = diplomas.some((diploma) => diploma.decisionId === id);
	if (hasDiploma) return respondError(res, 'Không thể xóa: đã có văn bằng thuộc quyết định này');
	const idx = decisions.findIndex((decision) => decision._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy quyết định', 404);
	const removed = decisions.splice(idx, 1)[0];
	respond(res, removed);
};

const handleGetDiplomas = (req: Request, res: Response) => {
	const data = filterDiplomas(parseCondition(req.query));
	const { result, total } = paginate(data, req.query.page, req.query.limit);
	respond(res, { result, total });
};

const handleGetDiplomaMany = (req: Request, res: Response) => {
	const data = filterDiplomas(parseCondition(req.query));
	respond(res, data);
};

const handlePostDiploma = (req: Request, res: Response) => {
	const payload = req.body as Partial<DiplomaInfo.TPayload>;
	if (!payload?.bookId || !payload.decisionId || !payload.serialNumber || !payload.studentCode || !payload.fullName || !payload.dob) {
		return respondError(res, 'Thiếu dữ liệu văn bằng');
	}
	const book = getBook(payload.bookId);
	const decision = getDecision(payload.decisionId);
	if (!book) return respondError(res, 'Sổ văn bằng không tồn tại');
	if (!decision) return respondError(res, 'Quyết định không tồn tại');
	const entryNumber = nextEntryNumber(payload.bookId);
	const record: DiplomaInfo.IRecord = {
		_id: createId('diploma'),
		bookId: payload.bookId,
		bookName: book.name,
		decisionId: payload.decisionId,
		decisionCode: decision.code,
		entryNumber,
		serialNumber: payload.serialNumber,
		studentCode: payload.studentCode,
		fullName: payload.fullName,
		dob: payload.dob,
		extras: payload.extras ?? {},
		createdAt: now(),
		updatedAt: now(),
	};
	diplomas.unshift(record);
	syncBookCounters();
	syncDecisionCounters();
	respond(res, record);
};

const handlePutDiploma = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = diplomas.findIndex((diploma) => diploma._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy văn bằng', 404);
	const payload = req.body as Partial<DiplomaInfo.TPayload>;
	let updatedBook = diplomas[idx].bookId;
	if (payload.bookId && payload.bookId !== diplomas[idx].bookId) {
		const book = getBook(payload.bookId);
		if (!book) return respondError(res, 'Sổ văn bằng không tồn tại');
		updatedBook = payload.bookId;
	}
	let updatedDecision = diplomas[idx].decisionId;
	if (payload.decisionId && payload.decisionId !== diplomas[idx].decisionId) {
		const decision = getDecision(payload.decisionId);
		if (!decision) return respondError(res, 'Quyết định không tồn tại');
		updatedDecision = payload.decisionId;
	}
	const bookRef = getBook(updatedBook);
	const decisionRef = getDecision(updatedDecision);
	const updated = {
		...diplomas[idx],
		...payload,
		bookId: updatedBook,
		bookName: bookRef?.name ?? diplomas[idx].bookName,
		decisionId: updatedDecision,
		decisionCode: decisionRef?.code ?? diplomas[idx].decisionCode,
		updatedAt: now(),
		entryNumber: diplomas[idx].entryNumber,
	};
	diplomas[idx] = updated;
	syncBookCounters();
	syncDecisionCounters();
	respond(res, updated);
};

const handleDeleteDiploma = (req: Request, res: Response) => {
	const id = req.params.id;
	const idx = diplomas.findIndex((diploma) => diploma._id === id);
	if (idx === -1) return respondError(res, 'Không tìm thấy văn bằng', 404);
	const removed = diplomas.splice(idx, 1)[0];
	syncBookCounters();
	syncDecisionCounters();
	respond(res, removed);
};

const handleSearchDiploma = (req: Request, res: Response) => {
	const payload = req.body as {
		serialNumber?: string;
		entryNumber?: number;
		studentCode?: string;
		fullName?: string;
		dob?: string;
	};
	const filled = Object.values(payload).filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
	if (filled.length < 2) return respondError(res, 'Vui lòng nhập ít nhất 2 tiêu chí tìm kiếm');
	const match = diplomas.find((diploma) => {
		if (payload.serialNumber && diploma.serialNumber !== payload.serialNumber) return false;
		if (payload.entryNumber && diploma.entryNumber !== Number(payload.entryNumber)) return false;
		if (payload.studentCode && diploma.studentCode !== payload.studentCode) return false;
		if (payload.fullName && diploma.fullName.toLowerCase() !== payload.fullName.toLowerCase()) return false;
		if (payload.dob && diploma.dob !== payload.dob) return false;
		return true;
	});
	if (!match) return respond(res, { diploma: null, decision: null, fieldDefinitions });
	const decision = getDecision(match.decisionId) ?? null;
	if (decision) {
		decision.searchCount += 1;
	}
	respond(res, { diploma: match, decision, fieldDefinitions });
};

const routes = {
	'GET /api/bai5/books/page': handleGetBooks,
	'GET /api/bai5/books/many': handleGetBookMany,
	'POST /api/bai5/books': handlePostBook,
	'PUT /api/bai5/books/:id': handlePutBook,
	'DELETE /api/bai5/books/:id': handleDeleteBook,

	'GET /api/bai5/fields/page': handleGetFields,
	'GET /api/bai5/fields/many': handleGetFieldMany,
	'POST /api/bai5/fields': handlePostField,
	'PUT /api/bai5/fields/:id': handlePutField,
	'DELETE /api/bai5/fields/:id': handleDeleteField,

	'GET /api/bai5/decisions/page': handleGetDecisions,
	'GET /api/bai5/decisions/many': handleGetDecisionMany,
	'POST /api/bai5/decisions': handlePostDecision,
	'PUT /api/bai5/decisions/:id': handlePutDecision,
	'DELETE /api/bai5/decisions/:id': handleDeleteDecision,

	'GET /api/bai5/diplomas/page': handleGetDiplomas,
	'GET /api/bai5/diplomas/many': handleGetDiplomaMany,
	'POST /api/bai5/diplomas': handlePostDiploma,
	'PUT /api/bai5/diplomas/:id': handlePutDiploma,
	'DELETE /api/bai5/diplomas/:id': handleDeleteDiploma,

	'POST /api/bai5/diplomas/search': handleSearchDiploma,
};

export default routes;
