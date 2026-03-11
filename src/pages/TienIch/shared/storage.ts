import type { Appointment, Service, Staff } from './types';
import { appointmentsMock, servicesMock, staffMock } from './mockData';

const STAFF_KEY = 'tienich_staffs';
const SERVICE_KEY = 'tienich_services';
const APPOINTMENT_KEY = 'tienich_appointments';

const isBrowser = typeof window !== 'undefined';

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const read = <T>(key: string, fallback: T): T => {
	if (!isBrowser) return clone(fallback);
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return clone(fallback);
		return JSON.parse(raw) as T;
	} catch {
		return clone(fallback);
	}
};

const write = <T>(key: string, data: T) => {
	if (!isBrowser) return;
	window.localStorage.setItem(key, JSON.stringify(data));
};

export const loadStaffs = (): Staff[] => read(STAFF_KEY, staffMock);
export const saveStaffs = (data: Staff[]) => write(STAFF_KEY, data);

export const loadServices = (): Service[] => read(SERVICE_KEY, servicesMock);
export const saveServices = (data: Service[]) => write(SERVICE_KEY, data);

export const loadAppointments = (): Appointment[] => read(APPOINTMENT_KEY, appointmentsMock);
export const saveAppointments = (data: Appointment[]) => write(APPOINTMENT_KEY, data);
