import React from 'react';
import { Button, Card, Col, Row, Select } from 'antd';
import type { Destination, SelectionControlProps } from '@/services/Bai6';

const { Option } = Select;

const SelectionControl: React.FC<SelectionControlProps> = ({
	destinations,
	startPoint,
	setStartPoint,
	selected,
	setSelected,
	addDay
}) => {

	return (
		<Row gutter={[16, 16]}>
			<Col xs={24} md={12}>
				<Card title='Điểm bắt đầu'>
					<Select
						style={{ width: '100%' }}
						placeholder='Chọn điểm bắt đầu'
						value={startPoint}
						onChange={setStartPoint}
						allowClear
					>
						{destinations.map((dest) => (
							<Option key={dest.id} value={dest.id}>
								{dest.name}
							</Option>
						))}
					</Select>
				</Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title='Điểm đến tiếp theo'>
					<Select
						style={{ width: '100%' }}
						placeholder='Chọn điểm đến'
						value={selected}
						onChange={setSelected}
					>
						{destinations.map((dest) => (
							<Option key={dest.id} value={dest.id}>
								{dest.name}
							</Option>
						))}
					</Select>
					<Button style={{ marginTop: 12 }} onClick={addDay} block>
						+ Thêm ngày
					</Button>
				</Card>
			</Col>
		</Row>
	);
};

export default SelectionControl;
