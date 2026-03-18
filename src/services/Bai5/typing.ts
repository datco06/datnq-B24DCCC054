export namespace DiplomaBook {
	export type TStatus = 'active' | 'archived';

	export interface IRecord {
		_id: string;
		code: string;
		year: number;
		name: string;
		description?: string;
		status: TStatus;
		createdAt: string;
		updatedAt: string;
		totalDiploma?: number;
		lastEntryNumber: number;
	}

	export type TPayload = Omit<IRecord, '_id' | 'createdAt' | 'updatedAt' | 'totalDiploma' | 'lastEntryNumber'>;
}

export namespace DiplomaField {
	export type TDataType = 'string' | 'number' | 'date';

	export interface IRecord {
		_id: string;
		code: string;
		label: string;
		dataType: TDataType;
		required?: boolean;
		description?: string;
		order?: number;
		createdAt: string;
		updatedAt: string;
	}

	export type TPayload = Omit<IRecord, '_id' | 'createdAt' | 'updatedAt'>;
}

export namespace GraduationDecision {
	export interface IRecord {
		_id: string;
		code: string;
		issuedAt: string;
		summary: string;
		bookId: string;
		bookName: string;
		bookYear: number;
		searchCount: number;
		diplomaCount: number;
		createdAt: string;
		updatedAt: string;
	}

	export type TPayload = Omit<
		IRecord,
		'_id' | 'createdAt' | 'updatedAt' | 'searchCount' | 'diplomaCount' | 'bookName' | 'bookYear'
	>;
}

export namespace DiplomaInfo {
	export interface IRecord {
		_id: string;
		bookId: string;
		bookName: string;
		decisionId: string;
		decisionCode: string;
		entryNumber: number;
		serialNumber: string;
		studentCode: string;
		fullName: string;
		dob: string;
		extras: Record<string, string | number | null>;
		createdAt: string;
		updatedAt: string;
	}

	export type TPayload = Omit<
		IRecord,
		| '_id'
		| 'createdAt'
		| 'updatedAt'
		| 'bookName'
		| 'decisionCode'
		| 'entryNumber'
	>;
}

export namespace DiplomaSearch {
	export interface IRequest {
		serialNumber?: string;
		entryNumber?: number;
		studentCode?: string;
		fullName?: string;
		dob?: string;
	}

	export interface IResponse {
		diploma?: DiplomaInfo.IRecord;
		decision?: GraduationDecision.IRecord;
		fieldDefinitions: DiplomaField.IRecord[];
	}
}

export const BAI5_API_PREFIX = '/api/bai5';
