import type { TaskItem } from './types';

export const defaultTasks: TaskItem[] = [
	{
		id: 'T-701',
		title: 'Chuẩn hóa backlog Sprint 12',
		assignee: 'Nguyễn An',
		priority: 'high',
		deadline: '2026-04-11',
		status: 'in-progress',
		description: 'Rà soát các hạng mục còn lại và sắp xếp độ ưu tiên.',
	},
	{
		id: 'T-702',
		title: 'Thiết kế giao diện Kanban',
		assignee: 'Lê Chi',
		priority: 'medium',
		deadline: '2026-04-13',
		status: 'todo',
		description: 'Chuẩn bị bản prototype cho phần Kanban board.',
	},
	{
		id: 'T-703',
		title: 'Tích hợp thông báo OneSignal',
		assignee: 'Trần Bảo',
		priority: 'high',
		deadline: '2026-04-10',
		status: 'done',
		description: 'Đảm bảo người dùng nhận thông báo khi nhiệm vụ quá hạn.',
	},
	{
		id: 'T-704',
		title: 'Viết test cho module lọc',
		assignee: 'Vũ Giang',
		priority: 'low',
		deadline: '2026-04-16',
		status: 'todo',
		description: 'Thêm test cases cho logic lọc nâng cao.',
	},
];
