export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskItem {
	id: string;
	title: string;
	assignee: string;
	priority: TaskPriority;
	deadline: string; // ISO string
	status: TaskStatus;
	description?: string;
}
