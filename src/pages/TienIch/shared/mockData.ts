import type { Appointment, Feedback, Service, Staff } from './types';

export const servicesMock: Service[] = [
	{
		id: 'svc-1',
		name: 'Cắt tóc nam',
		description: 'Gói cắt gội tạo kiểu cơ bản',
		price: 200_000,
		durationMinutes: 45,
	},
	{
		id: 'svc-2',
		name: 'Massage thư giãn',
		description: 'Liệu trình 60 phút',
		price: 600_000,
		durationMinutes: 60,
	},
	{
		id: 'svc-3',
		name: 'Chăm sóc da mặt',
		description: 'Làm sạch sâu + dưỡng chất',
		price: 450_000,
		durationMinutes: 50,
	},
];

export const staffMock: Staff[] = [
	{
		id: 'staff-1',
		name: 'Nguyễn An',
		phone: '0901 111 222',
		email: 'an.nguyen@example.com',
		services: ['svc-1', 'svc-3'],
		schedule: [
			{ dayOfWeek: 1, start: '09:00', end: '17:00', capacityPerDay: 8 },
			{ dayOfWeek: 3, start: '10:00', end: '19:00', capacityPerDay: 10 },
			{ dayOfWeek: 5, start: '09:00', end: '17:00', capacityPerDay: 8 },
		],
		ratingAverage: 4.6,
		reviewCount: 32,
	},
	{
		id: 'staff-2',
		name: 'Trần Bình',
		phone: '0902 333 444',
		email: 'binh.tran@example.com',
		services: ['svc-2'],
		schedule: [
			{ dayOfWeek: 2, start: '08:00', end: '16:00', capacityPerDay: 6 },
			{ dayOfWeek: 4, start: '12:00', end: '20:00', capacityPerDay: 6 },
			{ dayOfWeek: 6, start: '09:00', end: '15:00', capacityPerDay: 5 },
		],
		ratingAverage: 4.8,
		reviewCount: 18,
	},
	{
		id: 'staff-3',
		name: 'Lê Chi',
		phone: '0903 555 777',
		email: 'chi.le@example.com',
		services: ['svc-1', 'svc-2', 'svc-3'],
		schedule: [
			{ dayOfWeek: 1, start: '10:00', end: '18:00', capacityPerDay: 7 },
			{ dayOfWeek: 3, start: '10:00', end: '18:00', capacityPerDay: 7 },
			{ dayOfWeek: 5, start: '10:00', end: '18:00', capacityPerDay: 7 },
		],
		ratingAverage: 4.3,
		reviewCount: 12,
	},
];

export const appointmentsMock: Appointment[] = [
	{
		id: 'apt-1',
		customerName: 'Phạm Dũng',
		customerPhone: '0988 111 000',
		serviceId: 'svc-1',
		staffId: 'staff-1',
		start: '2026-03-10T09:30:00+07:00',
		end: '2026-03-10T10:15:00+07:00',
		status: 'approved',
	},
	{
		id: 'apt-2',
		customerName: 'Lưu Em',
		customerPhone: '0987 333 222',
		serviceId: 'svc-2',
		staffId: 'staff-2',
		start: '2026-03-11T14:00:00+07:00',
		end: '2026-03-11T15:00:00+07:00',
		status: 'pending',
		notes: 'Khách muốn dùng tinh dầu oải hương',
	},
	{
		id: 'apt-3',
		customerName: 'Đỗ Gia',
		customerPhone: '0977 222 333',
		serviceId: 'svc-3',
		staffId: 'staff-1',
		start: '2026-03-12T16:00:00+07:00',
		end: '2026-03-12T16:50:00+07:00',
		status: 'done',
	},
	{
		id: 'apt-4',
		customerName: 'Bùi Hạ',
		customerPhone: '0904 444 666',
		serviceId: 'svc-1',
		staffId: 'staff-3',
		start: '2026-03-13T11:00:00+07:00',
		end: '2026-03-13T11:45:00+07:00',
		status: 'cancelled',
	},
];

export const feedbackMock: Feedback[] = [
	{
		id: 'fb-1',
		appointmentId: 'apt-1',
		staffId: 'staff-1',
		serviceId: 'svc-1',
		customerName: 'Phạm Dũng',
		rating: 5,
		comment: 'Thoải mái, cắt đúng ý, sẽ quay lại.',
		createdAt: '2026-03-10T11:00:00+07:00',
	},
	{
		id: 'fb-2',
		appointmentId: 'apt-3',
		staffId: 'staff-1',
		serviceId: 'svc-3',
		customerName: 'Đỗ Gia',
		rating: 4,
		comment: 'Chăm sóc tốt, còn thiếu phần massage cổ.',
		reply: 'Cảm ơn bạn, lần sau chúng tôi sẽ chú ý hơn.',
		createdAt: '2026-03-12T18:30:00+07:00',
	},
	{
		id: 'fb-3',
		appointmentId: 'apt-4',
		staffId: 'staff-3',
		serviceId: 'svc-1',
		customerName: 'Bùi Hạ',
		rating: 3,
		comment: 'Đã hủy lịch vì bận, mong được hoàn sớm.',
		createdAt: '2026-03-13T12:00:00+07:00',
	},
];
