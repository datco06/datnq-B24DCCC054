import MyDatePicker from '@/components/MyDatePicker';
import type { DiplomaField } from '@/services/Bai5/typing';
import { Col, Descriptions, Form, Input, InputNumber, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

type DynamicFieldsProps = {
	fields: DiplomaField.IRecord[];
	disabled?: boolean;
};

const sortFields = (fields: DiplomaField.IRecord[]) =>
	[...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const renderLabel = (field: DiplomaField.IRecord) => (
	<Tooltip title={field.description || field.label}>
		<span>
			{field.label}
			{field.required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
		</span>
	</Tooltip>
);

const renderFormControl = (field: DiplomaField.IRecord, disabled?: boolean) => {
	switch (field.dataType) {
		case 'number':
			return <InputNumber style={{ width: '100%' }} disabled={disabled} />;
		case 'date':
			return <MyDatePicker saveFormat='YYYY-MM-DD' allowClear disabled={disabled} />;
		default:
			return <Input disabled={disabled} />;
	}
};

export const DynamicFieldInputs: React.FC<DynamicFieldsProps> = ({ fields, disabled }) => {
	const sorted = sortFields(fields);
	if (!sorted.length) return null;
	return (
		<Row gutter={[16, 8]}>
			{sorted.map((field) => (
				<Col xs={24} md={12} key={field._id}>
					<Form.Item
						label={renderLabel(field)}
						name={['extras', field.code]}
						rules={
							field.required
								? [
										{
											required: true,
											message: `Vui lòng nhập ${field.label.toLowerCase()}`,
										},
								  ]
								: undefined
						}
					>
						{renderFormControl(field, disabled)}
					</Form.Item>
				</Col>
			))}
		</Row>
	);
};

const formatValue = (field: DiplomaField.IRecord, value: any) => {
	if (value === undefined || value === null || value === '') return '—';
	switch (field.dataType) {
		case 'date':
			return dayjs(value).isValid() ? dayjs(value).format('DD/MM/YYYY') : value;
		default:
			return value;
	}
};

type DescriptionProps = DynamicFieldsProps & {
	extras?: Record<string, string | number | null>;
};

export const DynamicFieldDescriptions: React.FC<DescriptionProps> = ({ fields, extras }) => {
	if (!fields.length) return null;
	return (
		<Descriptions column={1} size='small' bordered title='Thông tin bổ sung'>
			{sortFields(fields).map((field) => (
				<Descriptions.Item key={field._id} label={renderLabel(field)}>
					{formatValue(field, extras?.[field.code])}
				</Descriptions.Item>
			))}
		</Descriptions>
	);
};
