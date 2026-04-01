import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, DatePicker, Row, Select, Space, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs, { type Dayjs } from 'dayjs';
import ColumnChart from '@/components/Chart/ColumnChart';
import type { Appointment, AppointmentStatus, Feedback, Service, Staff } from '@/pages/TienIch/shared/types';
import { loadAppointments, loadServices, loadStaffs } from '@/pages/TienIch/shared/storage';
import { loadFeedbacks } from '@/pages/TienIch/shared/feedbackStorage';

const revenueStatuses: AppointmentStatus[] = ['approved', 'done'];

type ServiceRevenueRow = {
	key: string;
	serviceName: string;
	bookingCount: number;
	revenue: number;
};

type StaffPerformanceRow = {
	key: string;
	staffName: string;
	bookingCount: number;
	revenue: number;
	averageRating: number;
	reviewCount: number;
};

const ThongKe: React.FC = () => {
	const [appointments, setAppointments] = useState<Appointment[]>(() => loadAppointments());
	const [services, setServices] = useState<Service[]>(() => loadServices());
	const [staffs, setStaffs] = useState<Staff[]>(() => loadStaffs());
	const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => loadFeedbacks());

	const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().startOf('month'), dayjs().endOf('month')]);
	const [selectedStaff, setSelectedStaff] = useState<string | undefined>();
	const [groupBy, setGroupBy] = useState<'day' | 'month'>('day');

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const syncStorage = () => {
			setAppointments(loadAppointments());
			setServices(loadServices());
			setStaffs(loadStaffs());
			setFeedbacks(loadFeedbacks());
		};
		window.addEventListener('storage', syncStorage);
		return () => window.removeEventListener('storage', syncStorage);
	}, []);

	const servicesMap = useMemo(() => {
		const map = new Map<string, Service>();
		services.forEach((service) => map.set(service.id, service));
		return map;
	}, [services]);

	const ratingMap = useMemo(() => {
		const map = new Map<string, { total: number; count: number }>();
		feedbacks.forEach((item) => {
			const existing = map.get(item.staffId) ?? { total: 0, count: 0 };
			existing.total += item.rating;
			existing.count += 1;
			map.set(item.staffId, existing);
		});
		return map;
	}, [feedbacks]);

	const filteredAppointments = useMemo(() => {
		return appointments.filter((appointment) => {
			const date = dayjs(appointment.start);
			if (dateRange && dateRange[0] && dateRange[1]) {
				if (date.isBefore(dateRange[0].startOf('day')) || date.isAfter(dateRange[1].endOf('day'))) return false;
			}
			if (selectedStaff && appointment.staffId !== selectedStaff) return false;
			return true;
		});
	}, [appointments, dateRange, selectedStaff]);

	const totalRevenue = useMemo(() => {
		return filteredAppointments.reduce((sum, appointment) => {
			if (!revenueStatuses.includes(appointment.status)) return sum;
			const servicePrice = servicesMap.get(appointment.serviceId)?.price ?? 0;
			return sum + servicePrice;
		}, 0);
	}, [filteredAppointments, servicesMap]);

	const timelineData = useMemo(() => {
		const format = groupBy === 'day' ? 'DD/MM' : 'MM/YYYY';
		const data = new Map<string, number>();
		filteredAppointments.forEach((item) => {
			const label = dayjs(item.start).format(format);
			data.set(label, (data.get(label) ?? 0) + 1);
		});
		const labels = Array.from(data.keys());
		const values = Array.from(data.values());
		return { labels, values };
	}, [filteredAppointments, groupBy]);

	const serviceRevenueData = useMemo(() => {
		const map = new Map<string, ServiceRevenueRow>();
		filteredAppointments.forEach((item) => {
			if (!revenueStatuses.includes(item.status)) return;
			const service = servicesMap.get(item.serviceId);
			if (!service) return;
			const row = map.get(item.serviceId) ?? {
				key: item.serviceId,
				serviceName: service.name,
				bookingCount: 0,
				revenue: 0,
			};
			row.bookingCount += 1;
			row.revenue += service.price;
			map.set(item.serviceId, row);
		});
		return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
	}, [filteredAppointments, servicesMap]);

	const staffPerformanceData = useMemo(() => {
		const map = new Map<string, StaffPerformanceRow>();
		filteredAppointments.forEach((item) => {
			const staff = staffs.find((s) => s.id === item.staffId);
			if (!staff) return;
			const row = map.get(item.staffId) ?? {
				key: item.staffId,
				staffName: staff.name,
				bookingCount: 0,
				revenue: 0,
				averageRating: 0,
				reviewCount: 0,
			};
			row.bookingCount += 1;
			if (revenueStatuses.includes(item.status)) {
				row.revenue += servicesMap.get(item.serviceId)?.price ?? 0;
			}
			const rating = ratingMap.get(item.staffId);
			if (rating && rating.count > 0) {
				row.averageRating = rating.total / rating.count;
				row.reviewCount = rating.count;
			}
			map.set(item.staffId, row);
		});
		return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
	}, [filteredAppointments, ratingMap, servicesMap, staffs]);

	const serviceColumns: ColumnsType<ServiceRevenueRow> = [
		{ title: 'Dịch vụ', dataIndex: 'serviceName' },
		{ title: 'Số lịch hẹn', dataIndex: 'bookingCount', width: 140 },
		{
			title: 'Doanh thu (VND)',
			dataIndex: 'revenue',
			render: (value: number) => value.toLocaleString('vi-VN'),
		},
	];

	const staffColumns: ColumnsType<StaffPerformanceRow> = [
		{ title: 'Nhân viên', dataIndex: 'staffName' },
		{ title: 'Số lịch hẹn', dataIndex: 'bookingCount', width: 120 },
		{
			title: 'Doanh thu (VND)',
			dataIndex: 'revenue',
			render: (value: number) => value.toLocaleString('vi-VN'),
		},
		{
			title: 'Đánh giá',
			render: (_, record) =>
				record.reviewCount ? (
					<Tag color='gold'>
						{record.averageRating.toFixed(1)} / 5 ({record.reviewCount})
					</Tag>
				) : (
					<Tag>Chưa có</Tag>
				),
		},
	];

	const totalAppointments = filteredAppointments.length;

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Card>
				<Row gutter={[16, 16]}>
					<Col xs={24} md={10}>
						<DatePicker.RangePicker
							value={dateRange}
							onChange={(values) => {
								if (values && values[0] && values[1]) setDateRange(values as [Dayjs, Dayjs]);
								else setDateRange([dayjs().startOf('month'), dayjs().endOf('month')]);
							}}
							allowClear={false}
						/>
					</Col>
					<Col xs={24} md={7}>
						<Select
							allowClear
							placeholder='Lọc theo nhân viên'
							style={{ width: '100%' }}
							value={selectedStaff}
							onChange={(value) => setSelectedStaff(value)}
						>
							{staffs.map((staff) => (
								<Select.Option key={staff.id} value={staff.id}>
									{staff.name}
								</Select.Option>
							))}
						</Select>
					</Col>
					<Col xs={24} md={7}>
						<Select value={groupBy} onChange={(value) => setGroupBy(value)} style={{ width: '100%' }}>
							<Select.Option value='day'>Nhóm theo ngày</Select.Option>
							<Select.Option value='month'>Nhóm theo tháng</Select.Option>
						</Select>
					</Col>
				</Row>
			</Card>

			<Row gutter={[16, 16]}>
				<Col xs={24} md={6}>
					<Card>
						<Statistic title='Tổng lịch hẹn' value={totalAppointments} />
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic
							title='Hoàn thành'
							value={filteredAppointments.filter((item) => item.status === 'done').length}
						/>
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic
							title='Đang chờ duyệt'
							value={filteredAppointments.filter((item) => item.status === 'pending').length}
						/>
					</Card>
				</Col>
				<Col xs={24} md={6}>
					<Card>
						<Statistic
							title='Doanh thu (VND)'
							value={totalRevenue}
							valueStyle={{ fontWeight: 600 }}
							precision={0}
							formatter={(value) => Number(value).toLocaleString('vi-VN')}
						/>
					</Card>
				</Col>
			</Row>

			<Card title='Số lượng lịch hẹn theo thời gian'>
				{timelineData.labels.length ? (
					<ColumnChart xAxis={timelineData.labels} yAxis={[timelineData.values]} yLabel={['Số lịch hẹn']} type='bar' />
				) : (
					<Tag color='default'>Chưa có dữ liệu</Tag>
				)}
			</Card>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={12}>
					<Card title='Doanh thu theo dịch vụ'>
						<Table<ServiceRevenueRow>
							dataSource={serviceRevenueData}
							columns={serviceColumns}
							pagination={false}
							locale={{ emptyText: 'Chưa có dữ liệu doanh thu' }}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={12}>
					<Card title='Hiệu suất nhân viên'>
						<Table<StaffPerformanceRow>
							dataSource={staffPerformanceData}
							columns={staffColumns}
							pagination={false}
							locale={{ emptyText: 'Chưa có dữ liệu' }}
						/>
					</Card>
				</Col>
			</Row>
		</Space>
	);
};

export default ThongKe;
