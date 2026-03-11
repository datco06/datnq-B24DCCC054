export type Service = {
	id: string;
	name: string;
	description?: string;
	price: number;
	durationMinutes: number;
};

export type StaffScheduleSlot = {
	dayOfWeek: number; // 0-6: Sunday-Saturday
	start: string; // HH:mm
	end: string; // HH:mm
	capacityPerDay: number;
};

export type Staff = {
	id: string;
	name: string;
	phone?: string;
	email?: string;
	services: string[]; // service ids
	schedule: StaffScheduleSlot[];
	ratingAverage?: number;
	reviewCount?: number;
};

export type AppointmentStatus = 'pending' | 'approved' | 'done' | 'cancelled';

export type Appointment = {
	id: string;
	customerName: string;
	customerPhone?: string;
	serviceId: string;
	staffId: string;
	start: string; // ISO string
	end: string;
	status: AppointmentStatus;
	notes?: string;
};

export type Feedback = {
	id: string;
	appointmentId: string;
	staffId: string;
	serviceId: string;
	customerName: string;
	rating: number;
	comment: string;
	reply?: string;
	createdAt: string;
};
