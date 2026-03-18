import React, { useEffect, useMemo, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	Col,
	Descriptions,
	Drawer,
	Form,
	Input,
	Modal,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tag,
	Typography,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { DiplomaBook, DiplomaField, DiplomaInfo, GraduationDecision } from '@/services/Bai5/typing';
import MyDatePicker from '@/components/MyDatePicker';
import { DynamicFieldDescriptions, DynamicFieldInputs } from '@/pages/TienIch/Bai5/components/DynamicFields';

const ThongTinVanBang: React.FC = () => {
	const diplomaModel = useModel('bai5.diploma');
	const decisionModel = useModel('bai5.decision');
	const bookModel = useModel('bai5.book');
	const fieldModel = useModel('bai5.field');

	const [form] = Form.useForm<DiplomaInfo.TPayload>();
	const selectedBookId = Form.useWatch('bookId', form);
	const [viewRecord, setViewRecord] = useState<DiplomaInfo.IRecord | null>(null);
	const [filters, setFilters] = useState<{ bookId?: string; decisionId?: string; keyword?: string }>({});

	const { danhSach: diplomas, getModel, postModel, putModel, deleteModel, loading, visibleForm, setVisibleForm, edit, setEdit, record, setRecord, formSubmiting } =
		diplomaModel;
	const { danhSach: decisions, getAllModel: fetchDecisions } = decisionModel;
	const { danhSach: books, getAllModel: fetchBooks } = bookModel;
	const { danhSach: fields, getAllModel: fetchFields } = fieldModel;

	useEffect(() => {
		getModel();
		fetchDecisions(undefined, undefined, undefined, undefined, 'many');
		fetchBooks(undefined, undefined, undefined, undefined, 'many');
		fetchFields(undefined, undefined, undefined, undefined, 'many');
	}, []);

	const dataSource = useMemo(() => {
		return diplomas.filter((item) => {
			if (filters.bookId && item.bookId !== filters.bookId) return false;
			if (filters.decisionId && item.decisionId !== filters.decisionId) return false;
			if (
				filters.keyword &&
				!`${item.serialNumber} ${item.studentCode} ${item.fullName}`.toLowerCase().includes(filters.keyword.toLowerCase())
			)
				return false;
			return true;
		});
	}, [diplomas, filters]);

	const decisionOptions = useMemo(() => {
		if (!selectedBookId) return decisions;
		return decisions.filter((item) => item.bookId === selectedBookId);
	}, [selectedBookId, decisions]);

	const openModal = (item?: DiplomaInfo.IRecord) => {
		if (item) {
			setEdit(true);
			setRecord(item);
			form.setFieldsValue({
				bookId: item.bookId,
				decisionId: item.decisionId,
				serialNumber: item.serialNumber,
				studentCode: item.studentCode,
				fullName: item.fullName,
				dob: item.dob,
				extras: item.extras,
			});
		} else {
			setEdit(false);
			setRecord(undefined);
			form.resetFields();
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
				if (edit && record?._id) return putModel(record._id, values, getModel);
				return postModel(values, getModel);
			})
			.then(closeModal)
			.catch(() => {});
	};

	const columns: ColumnsType<DiplomaInfo.IRecord> = [
		{
			title: 'Số vào sổ',
			dataIndex: 'entryNumber',
			width: 110,
		},
		{
			title: 'Số hiệu văn bằng',
			dataIndex: 'serialNumber',
			width: 180,
		},
		{
			title: 'Mã sinh viên',
			dataIndex: 'studentCode',
			width: 150,
		},
		{
			title: 'Họ tên',
			dataIndex: 'fullName',
			width: 220,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'dob',
			width: 140,
			render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Quyết định',
			dataIndex: 'decisionCode',
			width: 200,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'bookName',
			width: 200,
		},
		{
			title: 'Thao tác',
			width: 220,
			fixed: 'right',
			render: (_, recordItem) => (
				<Space>
					<Button type='link' onClick={() => setViewRecord(recordItem)}>
						Xem
					</Button>
					<Button type='link' onClick={() => openModal(recordItem)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa văn bằng này?' onConfirm={() => deleteModel(recordItem._id, getModel)}>
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
					<Row gutter={16}>
						<Col xs={24} md={6}>
							<Select
								allowClear
								placeholder='Lọc theo sổ'
								style={{ width: '100%' }}
								value={filters.bookId}
								onChange={(value) =>
									setFilters((prev) => ({
										...prev,
										bookId: value,
										decisionId: undefined,
									}))
								}
							>
								{books.map((book: DiplomaBook.IRecord) => (
									<Select.Option key={book._id} value={book._id}>
										{book.name}
									</Select.Option>
								))}
							</Select>
						</Col>
						<Col xs={24} md={6}>
							<Select
								allowClear
								placeholder='Quyết định'
								style={{ width: '100%' }}
								value={filters.decisionId}
								onChange={(value) => setFilters((prev) => ({ ...prev, decisionId: value }))}
							>
								{decisions
									.filter((item) => !filters.bookId || item.bookId === filters.bookId)
									.map((decision: GraduationDecision.IRecord) => (
										<Select.Option key={decision._id} value={decision._id}>
											{decision.code}
										</Select.Option>
									))}
							</Select>
						</Col>
						<Col xs={24} md={8}>
							<Input.Search
								placeholder='Tìm theo số hiệu, MSV hoặc họ tên'
								allowClear
								value={filters.keyword}
								onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
							/>
						</Col>
						<Col xs={24} md={4}>
							<Button type='primary' block onClick={() => openModal()}>
								Thêm văn bằng
							</Button>
						</Col>
					</Row>
				</Card>
			</Col>
			<Col span={24}>
				<Card>
					<Table<DiplomaInfo.IRecord>
						rowKey='_id'
						dataSource={dataSource}
						columns={columns}
						loading={loading}
						scroll={{ x: 1200 }}
						pagination={false}
					/>
				</Card>
			</Col>
			<Modal
				title={edit ? 'Cập nhật thông tin văn bằng' : 'Thêm thông tin văn bằng'}
				open={visibleForm}
				onCancel={closeModal}
				onOk={submit}
				confirmLoading={formSubmiting}
				width={900}
			>
				<Form layout='vertical' form={form}>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item
								label='Sổ văn bằng'
								name='bookId'
								rules={[{ required: true, message: 'Chọn sổ văn bằng' }]}
							>
								<Select placeholder='Chọn sổ'>
									{books.map((book: DiplomaBook.IRecord) => (
										<Select.Option key={book._id} value={book._id}>
											{book.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Quyết định tốt nghiệp'
								name='decisionId'
								rules={[{ required: true, message: 'Chọn quyết định' }]}
							>
								<Select placeholder='Quyết định'>
									{decisionOptions.map((decision: GraduationDecision.IRecord) => (
										<Select.Option key={decision._id} value={decision._id}>
											{decision.code} ({decision.bookName})
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item
								label='Số hiệu văn bằng'
								name='serialNumber'
								rules={[{ required: true, message: 'Nhập số hiệu văn bằng' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Mã sinh viên'
								name='studentCode'
								rules={[{ required: true, message: 'Nhập mã sinh viên' }]}
							>
								<Input />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col xs={24} md={12}>
							<Form.Item
								label='Họ và tên'
								name='fullName'
								rules={[{ required: true, message: 'Nhập họ tên' }]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label='Ngày sinh'
								name='dob'
								rules={[{ required: true, message: 'Chọn ngày sinh' }]}
							>
								<MyDatePicker saveFormat='YYYY-MM-DD' />
							</Form.Item>
						</Col>
					</Row>
					<Alert
						type='info'
						showIcon
						message={edit ? `Số vào sổ: ${record?.entryNumber}` : 'Số vào sổ sẽ được cấp tự động khi lưu'}
						style={{ marginBottom: 16 }}
					/>
					<Typography.Title level={5}>Thông tin bổ sung</Typography.Title>
					{fields.length ? (
						<DynamicFieldInputs fields={fields as DiplomaField.IRecord[]} />
					) : (
						<Tag color='default'>Chưa cấu hình trường bổ sung</Tag>
					)}
				</Form>
			</Modal>
			<Drawer
				title='Chi tiết văn bằng'
				open={Boolean(viewRecord)}
				onClose={() => setViewRecord(null)}
				width={520}
			>
				{viewRecord && (
					<Space direction='vertical' style={{ width: '100%' }} size='middle'>
						<Descriptions column={1} bordered size='small'>
							<Descriptions.Item label='Số vào sổ'>{viewRecord.entryNumber}</Descriptions.Item>
							<Descriptions.Item label='Số hiệu văn bằng'>{viewRecord.serialNumber}</Descriptions.Item>
							<Descriptions.Item label='Mã sinh viên'>{viewRecord.studentCode}</Descriptions.Item>
							<Descriptions.Item label='Họ tên'>{viewRecord.fullName}</Descriptions.Item>
							<Descriptions.Item label='Ngày sinh'>
								{dayjs(viewRecord.dob).format('DD/MM/YYYY')}
							</Descriptions.Item>
							<Descriptions.Item label='Quyết định'>{viewRecord.decisionCode}</Descriptions.Item>
							<Descriptions.Item label='Sổ văn bằng'>{viewRecord.bookName}</Descriptions.Item>
						</Descriptions>
						<DynamicFieldDescriptions fields={fields} extras={viewRecord.extras} />
					</Space>
				)}
			</Drawer>
		</Row>
	);
};

export default ThongTinVanBang;
