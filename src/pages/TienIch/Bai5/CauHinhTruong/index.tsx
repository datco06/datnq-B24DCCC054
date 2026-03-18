import React, { useEffect } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { useModel } from 'umi';
import type { DiplomaField } from '@/services/Bai5/typing';

const dataTypeLabels: Record<DiplomaField.TDataType, string> = {
	string: 'Văn bản',
	number: 'Số',
	date: 'Ngày',
};

const CauHinhTruong: React.FC = () => {
	const {
		danhSach,
		getModel,
		postModel,
		putModel,
		deleteModel,
		visibleForm,
		setVisibleForm,
		edit,
		setEdit,
		record,
		setRecord,
		formSubmiting,
		loading,
	} = useModel('bai5.field');
	const [form] = Form.useForm<DiplomaField.TPayload>();

	useEffect(() => {
		getModel();
	}, []);

	const openModal = (item?: DiplomaField.IRecord) => {
		if (item) {
			setEdit(true);
			setRecord(item);
			form.setFieldsValue({
				code: item.code,
				label: item.label,
				dataType: item.dataType,
				required: item.required,
				description: item.description,
				order: item.order,
			});
		} else {
			setEdit(false);
			setRecord(undefined);
			form.resetFields();
			form.setFieldsValue({ required: true, dataType: 'string' });
		}
		setVisibleForm(true);
	};

	const closeModal = () => {
		setVisibleForm(false);
		setEdit(false);
		setRecord(undefined);
		form.resetFields();
	};

	const submit = () => {
		form
			.validateFields()
			.then((values) => {
				const payload = { ...values, code: values.code.toUpperCase().replace(/\s+/g, '_') };
				if (edit && record?._id) return putModel(record._id, payload, getModel);
				return postModel(payload, getModel);
			})
			.then(closeModal)
			.catch(() => {});
	};

	const columns: ColumnsType<DiplomaField.IRecord> = [
		{
			title: 'Mã trường',
			dataIndex: 'code',
			width: 160,
		},
		{
			title: 'Tên hiển thị',
			dataIndex: 'label',
			width: 200,
		},
		{
			title: 'Kiểu dữ liệu',
			dataIndex: 'dataType',
			width: 120,
			render: (value: DiplomaField.TDataType) => <Tag color='blue'>{dataTypeLabels[value]}</Tag>,
		},
		{
			title: 'Bắt buộc',
			dataIndex: 'required',
			width: 120,
			render: (value: boolean) => (value ? <Tag color='red'>Có</Tag> : <Tag>Không</Tag>),
		},
		{
			title: 'Thứ tự',
			dataIndex: 'order',
			width: 100,
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			ellipsis: true,
		},
		{
			title: 'Thao tác',
			width: 160,
			render: (_, recordItem) => (
				<Space>
					<Button type='link' onClick={() => openModal(recordItem)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa trường này?' onConfirm={() => deleteModel(recordItem._id, getModel)}>
						<Button type='link' danger>
							Xóa
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<Card>
					<Typography.Paragraph>
						Các trường thông tin phụ lục sẽ được dùng khi nhập văn bằng. Bảng dưới cho phép thêm bớt linh hoạt và hệ thống
						tự động ràng buộc kiểu dữ liệu với control nhập liệu.
					</Typography.Paragraph>
					<Button type='primary' onClick={() => openModal()}>
						Thêm trường thông tin
					</Button>
				</Card>
			</Col>
			<Col span={24}>
				<Card>
					<Table<DiplomaField.IRecord>
						rowKey='_id'
						dataSource={danhSach}
						columns={columns}
						loading={loading}
						pagination={false}
					/>
				</Card>
			</Col>
			<Modal
				title={edit ? 'Chỉnh sửa trường' : 'Thêm trường thông tin'}
				open={visibleForm}
				onCancel={closeModal}
				onOk={submit}
				confirmLoading={formSubmiting}
				width={600}
			>
				<Form layout='vertical' form={form}>
					<Form.Item
						label='Mã trường'
						name='code'
						extra='Viết hoa, không dấu, hệ thống sẽ tự chuyển thành UPPER_CASE'
						rules={[{ required: true, message: 'Vui lòng nhập mã trường' }]}
					>
						<Input placeholder='VD: GPA' />
					</Form.Item>
					<Form.Item
						label='Tên hiển thị'
						name='label'
						rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị' }]}
					>
						<Input placeholder='VD: Điểm trung bình' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label='Kiểu dữ liệu'
								name='dataType'
								rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
							>
								<Select>
									{Object.entries(dataTypeLabels).map(([value, label]) => (
										<Select.Option key={value} value={value}>
											{label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Thứ tự hiển thị' name='order'>
								<InputNumber min={1} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label='Bắt buộc' name='required' valuePropName='checked'>
						<Switch />
					</Form.Item>
					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default CauHinhTruong;
