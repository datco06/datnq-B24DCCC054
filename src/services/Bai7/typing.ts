export enum TaskStatus {
	Todo = 'todo',
	InProgress = 'in-progress',
	Done = 'done',
}

export enum TaskPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}

export interface TaskItem {
	id: string;
	title: string;
	assignee: string;
	priority: TaskPriority;
	deadline: string; // ISO string
	status: TaskStatus;
	description?: string;
}

export interface Account {
	username: string;
	password?: string;
	fullName?: string;
}
