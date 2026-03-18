import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Statistic, Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useModel } from 'umi';
import type { DiplomaBook, GraduationDecision } from '@/services/Bai5/typing';
import MyDatePicker from '@/components/MyDatePicker';

const QuyetDinhPage: React.FC = () => {
	const decisionModel = useModel('bai5.decision');
	const bookModel = useModel('bai5.book');
	const [form] = Form.useForm<GraduationDecision.TPayload>();
	const [bookFilter, setBookFilter] = useState<string>();

	const { danhSach: decisions, loading, getModel, postModel, putModel, deleteModel, record, setRecord, setEdit, edit, visibleForm, setVisibleForm, formSubmiting } =
		decisionModel;
	const { danhSach: books = [], getAllModel: fetchBooks } = bookModel;

	useEffect(() => {
		getModel();
		fetchBooks(undefined, undefined, undefined, undefined, 'many');
	}, []);

	const dataSource = useMemo(() => {
		return decisions.filter((item) => {
			if (bookFilter && item.bookId !== bookFilter) return false;
			return true;
		});
	}, [decisions, bookFilter]);

	const summary = useMemo(() => {
		const totalDiplomas = decisions.reduce((sum, item) => sum + (item.diplomaCount ?? 0), 0);
		const totalSearch = decisions.reduce((sum, item) => sum + (item.searchCount ?? 0), 0);
		return {
			total: decisions.length,
			totalDiplomas,
			totalSearch,
		};
	}, [decisions]);

	const openModal = (item?: GraduationDecision.IRecord) => {
		if (item) {
			setEdit(true);
			setRecord(item);
			form.setFieldsValue({
				bookId: item.bookId,
				code: item.code,
				issuedAt: item.issuedAt,
				summary: item.summary,
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
				if (edit && record?._id) {
					return putModel(record._id, values, getModel);
				}
				return postModel(values, getModel);
			})
			.then(closeModal)
			.catch(() => {});
	};

	const columns: ColumnsType<GraduationDecision.IRecord> = [
		{
			title: 'Số quyết định',
			dataIndex: 'code',
			width: 200,
		},
		{
			title: 'Ngày ban hành',
			dataIndex: 'issuedAt',
			width: 150,
			render: (value: string) => dayjs(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Trích yếu',
			dataIndex: 'summary',
			width: 320,
			ellipsis: true,
		},
		{
			title: 'Sổ văn bằng',
			dataIndex: 'bookName',
			width: 220,
		},
		{
			title: 'Số văn bằng',
			dataIndex: 'diplomaCount',
			width: 120,
			render: (value) => value ?? 0,
		},
		{
			title: 'Lượt tra cứu',
			dataIndex: 'searchCount',
			width: 130,
			render: (value) => value ?? 0,
		},
		{
			title: 'Thao tác',
			width: 170,
			fixed: 'right',
			render: (_, recordItem) => (
				<Space>
					<Button type='link' onClick={() => openModal(recordItem)}>
						Sửa
					</Button>
					<Popconfirm title='Xóa quyết định này?' onConfirm={() => deleteModel(recordItem._id, getModel)}>
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
					<Row gutter={24}>
						<Col xs={24} md={8}>
							<Statistic title='Tổng quyết định' value={summary.total} />
						</Col>
						<Col xs={24} md={8}>
							<Statistic title='Văn bằng thuộc quyết định' value={summary.totalDiplomas} />
						</Col>
						<Col xs={24} md={8}>
							<Statistic title='Tổng lượt tra cứu' value={summary.totalSearch} />
						</Col>
					</Row>
				</Card>
			</Col>
			<Col span={24}>
				<Card
					title='Danh sách quyết định tốt nghiệp'
					extra={
						<Space>
							<Select
								allowClear
								placeholder='Lọc theo sổ'
								style={{ width: 220 }}
								value={bookFilter}
								onChange={(value) => setBookFilter(value)}
							>
								{books.map((book: DiplomaBook.IRecord) => (
									<Select.Option key={book._id} value={book._id}>
										{book.name}
									</Select.Option>
								))}
							</Select>
							<Button onClick={() => getModel()}>Làm mới</Button>
							<Button type='primary' onClick={() => openModal()}>
								Thêm quyết định
							</Button>
						</Space>
					}
				>
					<Table<GraduationDecision.IRecord>
						rowKey='_id'
						loading={loading}
						dataSource={dataSource}
						columns={columns}
						scroll={{ x: 1100 }}
						pagination={false}
					/>
				</Card>
			</Col>
			<Modal
				title={edit ? 'Cập nhật quyết định' : 'Thêm quyết định tốt nghiệp'}
				visible={visibleForm}
				onCancel={closeModal}
				onOk={submit}
				confirmLoading={formSubmiting}
				width={650}
			>
				<Form layout='vertical' form={form}>
					<Form.Item
						label='Sổ văn bằng'
						name='bookId'
						rules={[{ required: true, message: 'Vui lòng chọn sổ' }]}
					>
						<Select placeholder='Chọn sổ văn bằng'>
							{books.map((book: DiplomaBook.IRecord) => (
								<Select.Option key={book._id} value={book._id}>
									{book.name} ({book.year})
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label='Số quyết định'
						name='code'
						rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
					>
						<Input placeholder='VD: 123/QĐ-ĐT-2024' />
					</Form.Item>
					<Form.Item
						label='Ngày ban hành'
						name='issuedAt'
						rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
					>
						<MyDatePicker saveFormat='YYYY-MM-DD' />
					</Form.Item>
					<Form.Item label='Trích yếu' name='summary'>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</Row>
	);
};

export default QuyetDinhPage;
