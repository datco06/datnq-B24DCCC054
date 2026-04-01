import React, { useMemo, useState } from 'react';
import { Col, message, Row, Space, Typography } from 'antd';
import DestinationForm from './admin/components/DestinationForm';
import DestinationTable from './admin/components/DestinationTable';
import StatsCards from './admin/components/StatsCards';
import { loadDestinations, loadStats, saveDestinations } from './admin/storage';
import type { Destination, DestinationStat } from './admin/typing';

const { Title, Text } = Typography;

const Bai6TrangQuanTri: React.FC = () => {
	const [destinations, setDestinations] = useState<Destination[]>(() => loadDestinations());
	const [stats] = useState<DestinationStat[]>(() => loadStats());
	const [editing, setEditing] = useState<Destination | null>(null);

	const totalBudget = useMemo(() => {
		return destinations.reduce((sum, item) => sum + item.costs.food + item.costs.transport + item.costs.stay, 0);
	}, [destinations]);

	const handleSubmit = (payload: Omit<Destination, 'id'>) => {
		setDestinations((prev) => {
			let next: Destination[];
			if (editing) {
				next = prev.map((item) => (item.id === editing.id ? { ...editing, ...payload } : item));
				message.success('Đã cập nhật điểm đến');
			} else {
				const newItem: Destination = { ...payload, id: `dest-${Date.now()}` };
				next = [newItem, ...prev];
				message.success('Đã thêm điểm đến');
			}
			saveDestinations(next);
			return next;
		});
		setEditing(null);
	};

	const handleEdit = (record: Destination) => {
		setEditing(record);
	};

	const handleDelete = (id: string) => {
		setDestinations((prev) => {
			const next = prev.filter((item) => item.id !== id);
			saveDestinations(next);
			return next;
		});
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
					<DestinationTable data={destinations} onEdit={handleEdit} onDelete={handleDelete} />
				</Col>
			</Row>
			<StatsCards stats={stats} destinations={destinations} />
			<Text type='secondary'>Tổng ngân sách mẫu: {totalBudget.toLocaleString('vi-VN')} đ</Text>
		</Space>
	);
};

export default Bai6TrangQuanTri;
