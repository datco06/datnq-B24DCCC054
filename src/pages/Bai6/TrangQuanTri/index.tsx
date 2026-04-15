import React, { useEffect, useMemo, useState } from 'react';
import { Col, message, Row, Space, Typography } from 'antd';
import { useModel } from 'umi';
import DestinationForm from './admin/components/DestinationForm';
import DestinationTable from './admin/components/DestinationTable';
import StatsCards from './admin/components/StatsCards';
import type { Destination } from '@/services/Bai6/typing';

const { Title, Text } = Typography;

const Bai6TrangQuanTri: React.FC = () => {
	const { rawDestinations, stats, loadData, updateDestinations } = useModel('bai6Model');
	const [editing, setEditing] = useState<Destination | null>(null);

	useEffect(() => {
		loadData();
		if (typeof window !== 'undefined') {
			window.addEventListener('storage', loadData);
			return () => window.removeEventListener('storage', loadData);
		}
		return () => undefined;
	}, [loadData]);

	const totalBudget = useMemo(() => {
		return rawDestinations.reduce((sum, item) => sum + item.costs.food + item.costs.transport + item.costs.stay, 0);
	}, [rawDestinations]);

	const handleSubmit = (payload: Omit<Destination, 'id'>) => {
		let next: Destination[];
		if (editing) {
			next = rawDestinations.map((item) => (item.id === editing.id ? { ...editing, ...payload } : item));
			message.success('Đã cập nhật điểm đến');
		} else {
			const newItem: Destination = { ...payload, id: `dest-${Date.now()}` };
			next = [newItem, ...rawDestinations];
			message.success('Đã thêm điểm đến');
		}
		updateDestinations(next);
		setEditing(null);
	};

	const handleEdit = (record: Destination) => {
		setEditing(record);
	};

	const handleDelete = (id: string) => {
		const next = rawDestinations.filter((item) => item.id !== id);
		updateDestinations(next);
		if (editing?.id === id) {
			setEditing(null);
		}
		message.success('Đã xóa điểm đến');
	};

	return (
		<Space direction='vertical' size='large' style={{ width: '100%' }}>
			<Title level={3}>Bài 6: Trang quản trị</Title>
			<Row gutter={[24, 24]}>
				<Col xs={24} md={10}>
					<DestinationForm editing={editing ?? undefined} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />
				</Col>
				<Col xs={24} md={14}>
					<DestinationTable data={rawDestinations} onEdit={handleEdit} onDelete={handleDelete} />
				</Col>
			</Row>
			<StatsCards stats={stats} destinations={rawDestinations} />
			<Text type='secondary'>Tổng ngân sách mẫu: {totalBudget.toLocaleString('vi-VN')} đ</Text>
		</Space>
	);
};

export default Bai6TrangQuanTri;
