export type Service = {
	id: string;
	name: string;
	description?: string;
	price: number;
	durationMinutes: number;
};

export type StaffScheduleSlot = {
	dayOfWeek: number; 
	start: string; 
	end: string; 
	capacityPerDay: number;
};

export type Staff = {
	id: string;
	name: string;
	phone?: string;
	email?: string;
	services: string[]; 
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
	start: string; 
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
