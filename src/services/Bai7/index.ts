import type { Account, TaskItem } from './typing';
import { TaskStatus, TaskPriority } from './typing';

export * from './typing';

export const mockAccounts: Account[] = [
	{ username: 'nguyenan', password: '123', fullName: 'Nguyễn An' },
	{ username: 'lechi', password: '123', fullName: 'Lê Chi' },
	{ username: 'tranbao', password: '123', fullName: 'Trần Bảo' },
	{ username: 'vugiang', password: '123', fullName: 'Vũ Giang' },
];

export const defaultTasks: TaskItem[] = [
	{
		id: 'T-701',
		title: 'Chuẩn hóa backlog Sprint 12',
		assignee: 'nguyenan',
		priority: TaskPriority.High,
		deadline: '2026-04-11',
		status: TaskStatus.InProgress,
		description: 'Rà soát các hạng mục còn lại và sắp xếp độ ưu tiên.',
	},
	{
		id: 'T-702',
		title: 'Thiết kế giao diện Kanban',
		assignee: 'lechi',
		priority: TaskPriority.Medium,
		deadline: '2026-04-13',
		status: TaskStatus.Todo,
		description: 'Chuẩn bị bản prototype cho phần Kanban board.',
	},
	{
		id: 'T-703',
		title: 'Tích hợp thông báo OneSignal',
		assignee: 'tranbao',
		priority: TaskPriority.High,
		deadline: '2026-04-10',
		status: TaskStatus.Done,
		description: 'Đảm bảo người dùng nhận thông báo khi nhiệm vụ quá hạn.',
	},
	{
		id: 'T-704',
		title: 'Viết test cho module lọc',
		assignee: 'vugiang',
		priority: TaskPriority.Low,
		deadline: '2026-04-16',
		status: TaskStatus.Todo,
		description: 'Thêm test cases cho logic lọc nâng cao.',
	},
];
