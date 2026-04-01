import React, { useEffect, useMemo } from 'react';
import { Button, Card, Col, Form, Input, InputNumber, Modal, Popconfirm, Row, Select, Space, Statistic, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { DiplomaBook } from '@/services/Bai5/typing';

const statusOptions: { label: string; value: DiplomaBook.TStatus; color: string }[] = [
	{ label: 'Đang mở', value: 'active', color: 'green' },
	{ label: 'Đã kết sổ', value: 'archived', color: 'orange' },
];

const SoVanBang: React.FC = () => {
	const {
		danhSach,
		getModel,
		loading,
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
	} = useModel('bai5.book');
	const [form] = Form.useForm<DiplomaBook.TPayload>();

	useEffect(() => {
		getModel();
	}, []);

	const totals = useMemo(() => {
		const active = danhSach.filter((item) => item.status === 'active').length;
		const archived = danhSach.length - active;
		const diplomas = danhSach.reduce((sum, item) => sum + (item.totalDiploma ?? 0), 0);
		return { active, archived, diplomas };
	}, [danhSach]);

	const openModal = (item?: DiplomaBook.IRecord) => {
		if (item) {
			setEdit(true);
			setRecord(item);
			form.setFieldsValue({
				code: item.code,
				name: item.name,
				description: item.description,
				status: item.status,
				year: item.year,
			});
		} else {
			setEdit(false);
			setRecord(undefined);
			form.resetFields();
			form.setFieldsValue({
				status: 'active',
				year: dayjs().year(),
			});
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
				if (edit && record?._id) {
					return putModel(record._id, values, getModel);
				}
				return postModel(values, getModel);
			})
			.then(closeModal)
			.catch(() => {});
	};

	const columns: ColumnsType<DiplomaBook.IRecord> = [
		{
			title: 'Mã sổ',
			dataIndex: 'code',
			width: 160,
		},
		{
			title: 'Tên sổ',
			dataIndex: 'name',
			width: 260,
		},
		{
			title: 'Năm',
			dataIndex: 'year',
			width: 100,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 140,
			render: (value: DiplomaBook.TStatus) => {
				const option = statusOptions.find((item) => item.value === value);
				return <Tag color={option?.color}>{option?.label ?? value}</Tag>;
			},
		},
		{
			title: 'Số văn bằng',
			dataIndex: 'totalDiploma',
			width: 140,
			render: (value) => value ?? 0,
		},
		{
			title: 'Số vào sổ hiện tại',
			dataIndex: 'lastEntryNumber',
			width: 160,
			render: (value) => value ?? 0,
		},
		{
			title: 'Cập nhật',
			dataIndex: 'updatedAt',
			width: 170,
			render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
		},
		{
			title: 'Thao tác',
			fixed: 'right',
			width: 160,
			render: (_, recordItem) => (
				<Space split={<span>|</span>}>
					<Button type='link' onClick={() => openModal(recordItem)}>
						Chỉnh sửa
					</Button>
					<Tooltip title='Chỉ có thể xóa khi chưa phát hành quyết định'>
						<Popconfirm
							title='Bạn có chắc muốn xóa sổ này?'
							onConfirm={() => deleteModel(recordItem._id, getModel)}
							okText='Xóa'
							cancelText='Hủy'
						>
							<Button type='link' danger>
								Xóa
							</Button>
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<Card>
					<Row gutter={24}>
						<Col xs={24} md={8}>
							<Statistic title='Sổ đang mở' value={totals.active} />
						</Col>
						<Col xs={24} md={8}>
							<Statistic title='Sổ đã kết' value={totals.archived} />
						</Col>
						<Col xs={24} md={8}>
							<Statistic title='Tổng văn bằng đã cấp' value={totals.diplomas} />
						</Col>
					</Row>
				</Card>
			</Col>
			<Col span={24}>
				<Card
					title='Sổ văn bằng'
					extra={
						<Button type='primary' onClick={() => openModal()}>
							Thêm sổ mới
						</Button>
					}
				>
					<Table<DiplomaBook.IRecord>
						rowKey='_id'
						loading={loading}
						dataSource={danhSach}
						columns={columns}
						scroll={{ x: 900 }}
						pagination={false}
					/>
				</Card>
			</Col>
			<Modal
				title={edit ? 'Cập nhật sổ văn bằng' : 'Thêm sổ văn bằng'}
				visible={visibleForm}
				onCancel={closeModal}
				onOk={submit}
				confirmLoading={formSubmiting}
				width={600}
			>
				<Form layout='vertical' form={form}>
					<Form.Item
						label='Mã sổ'
						name='code'
						rules={[{ required: true, message: 'Vui lòng nhập mã sổ' }]}
					>
						<Input placeholder='VD: SVB-2024' />
					</Form.Item>
					<Form.Item
						label='Tên sổ'
						name='name'
						rules={[{ required: true, message: 'Vui lòng nhập tên sổ' }]}
					>
						<Input placeholder='Sổ văn bằng năm 2024' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label='Năm'
								name='year'
								rules={[{ required: true, message: 'Vui lòng nhập năm' }]}
							>
								<InputNumber style={{ width: '100%' }} min={2000} max={2100} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label='Trạng thái'
								name='status'
								initialValue='active'
								rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
							>
								<Select>
									{statusOptions.map((item) => (
										<Select.Option value={item.value} key={item.value}>
											{item.label}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label='Mô tả' name='description'>
						<Input.TextArea rows={3} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default SoVanBang;
