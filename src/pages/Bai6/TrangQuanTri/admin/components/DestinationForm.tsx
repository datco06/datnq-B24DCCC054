import React, { useEffect } from 'react';
import { Button, Card, Form, Input, InputNumber, Select } from 'antd';
import type { Destination, DestinationFormProps } from '@/services/Bai6';
import { DestinationType } from '@/services/Bai6';

const destinationTypes: { label: string; value: DestinationType }[] = [
	{ label: 'Biển', value: DestinationType.Bien },
	{ label: 'Núi', value: DestinationType.Nui },
	{ label: 'Thành phố', value: DestinationType.ThanhPho },

	{ label: 'Làng quê', value: DestinationType.LangQue },
];

const priceCategories = [
	{ label: 'Tiết kiệm', value: 'tiet-kiem' },
	{ label: 'Tiêu chuẩn', value: 'tieu-chuan' },
	{ label: 'Cao cấp', value: 'cao-cap' },
];

const DestinationForm: React.FC<DestinationFormProps> = ({ editing, onSubmit, onCancelEdit }) => {
	const [form] = Form.useForm<Omit<Destination, 'id'>>();

	useEffect(() => {
		if (editing) {
			form.setFieldsValue(editing);
		} else {
			form.resetFields();
		}
	}, [editing, form]);

	const handleFinish = (values: Omit<Destination, 'id'>) => {
		onSubmit(values);
	};

	return (
		<Card
			title={editing ? 'Cập nhật điểm đến' : 'Thêm điểm đến'}
			extra={
				editing && (
					<Button type='link' onClick={onCancelEdit}>
						Hủy chỉnh sửa
					</Button>
				)
			}
		>
			<Form layout='vertical' form={form} onFinish={handleFinish}>
				<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
					<Input placeholder='Ví dụ: Bãi biển Mỹ Khê' />
				</Form.Item>
				<Form.Item name='location' label='Địa điểm' rules={[{ required: true, message: 'Nhập địa điểm' }]}>
					<Input placeholder='Tỉnh/Quốc gia' />
				</Form.Item>
				<Form.Item name='type' label='Loại hình' rules={[{ required: true }]}> 
					<Select options={destinationTypes} placeholder='Chọn loại hình' />
				</Form.Item>
				<Form.Item name='priceCategory' label='Hạng chi phí' rules={[{ required: true }]}>
					<Select options={priceCategories} />
				</Form.Item>
				<Form.Item name='rating' label='Điểm rating' rules={[{ required: true }]}>
					<InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='recommendedDuration' label='Thời gian gợi ý (giờ)' rules={[{ required: true }]}>
					<InputNumber min={6} max={240} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name={['costs', 'food']} label='Chi phí ăn uống' rules={[{ required: true }]}>
					<InputNumber min={0} step={50000} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name={['costs', 'transport']} label='Chi phí di chuyển' rules={[{ required: true }]}>
					<InputNumber min={0} step={50000} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name={['costs', 'stay']} label='Chi phí lưu trú' rules={[{ required: true }]}>
					<InputNumber min={0} step={50000} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item name='description' label='Mô tả'>
					<Input.TextArea rows={3} placeholder='Mô tả ngắn gọn về trải nghiệm' />
				</Form.Item>
				<Form.Item name='image' label='URL hình ảnh'>
					<Input placeholder='https://...' />
				</Form.Item>
				<Form.Item>
					<Button type='primary' htmlType='submit' block>
						{editing ? 'Lưu thay đổi' : 'Thêm điểm đến'}
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default DestinationForm;
