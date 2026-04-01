import React from 'react';
import { Button, Card, Popconfirm, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import type { Destination } from '../typing';

export interface DestinationTableProps {
	data: Destination[];
	onEdit: (record: Destination) => void;
	onDelete: (id: string) => void;
}

const typeColors: Record<Destination['type'], string> = {
	bien: 'blue',
	nui: 'green',
	'thanh-pho': 'volcano',
	'lang-que': 'gold',
};

const DestinationTable: React.FC<DestinationTableProps> = ({ data, onEdit, onDelete }) => {
	const columns: ColumnsType<Destination> = [
		{
			title: 'Tên',
			dataIndex: 'name',
			width: 180,
		},
		{
			title: 'Địa điểm',
			dataIndex: 'location',
			width: 140,
		},
		{
			title: 'Loại',
			dataIndex: 'type',
			render: (value: Destination['type']) => <Tag color={typeColors[value]}>{value}</Tag>,
			width: 110,
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			width: 90,
		},
		{
			title: 'Chi phí/ngày',
			render: (_, record) => {
				const total = record.costs.food + record.costs.transport + record.costs.stay;
				return `${(total / record.recommendedDuration).toFixed(0)}đ`;
			},
			width: 140,
		},
		{
			title: 'Hành động',
			render: (_, record) => (
				<Space>
					<Button size='small' onClick={() => onEdit(record)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa điểm đến này?' onConfirm={() => onDelete(record.id)}>
						<Button size='small' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card title='Danh sách điểm đến'>
			<Table rowKey='id' dataSource={data} columns={columns} pagination={{ pageSize: 5 }} size='small' />
		</Card>
	);
};

export default DestinationTable;
