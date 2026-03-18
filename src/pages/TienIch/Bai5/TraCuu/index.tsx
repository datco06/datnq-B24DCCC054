import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Descriptions, Empty, Form, Input, InputNumber, message, Row, Space, Statistic, Typography } from 'antd';
import { useModel } from 'umi';
import type { DiplomaField, DiplomaSearch } from '@/services/Bai5/typing';
import { searchDiploma } from '@/services/Bai5/search';
import MyDatePicker from '@/components/MyDatePicker';
import { DynamicFieldDescriptions } from '@/pages/TienIch/Bai5/components/DynamicFields';
import ColumnChart from '@/components/Chart/ColumnChart';
import dayjs from 'dayjs';

const TraCuuVanBang: React.FC = () => {
	const [form] = Form.useForm<DiplomaSearch.IRequest>();
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<DiplomaSearch.IResponse | null>(null);
	const decisionModel = useModel('bai5.decision');

	const { danhSach: decisions, getModel: fetchDecisions } = decisionModel;

	useEffect(() => {
		fetchDecisions();
	}, []);

	const performSearch = async () => {
		const values = await form.validateFields();
		const filled = Object.values(values).filter((value) => value !== undefined && value !== null && String(value).trim() !== '');
		if (filled.length < 2) {
			message.warning('Vui lòng nhập ít nhất 2 tiêu chí tìm kiếm');
			return;
		}
		try {
			setLoading(true);
			const data = await searchDiploma(values);
			setResult(data);
			message.success(data?.diploma ? 'Đã tìm thấy văn bằng' : 'Không có kết quả phù hợp');
			fetchDecisions();
		} catch (err: any) {
			message.error(err?.response?.data?.message ?? 'Không thể tra cứu');
		} finally {
			setLoading(false);
		}
	};

	const chartData = useMemo(() => {
		if (!decisions.length) return null;
		return {
			title: 'Lượt tra cứu theo quyết định',
			xAxis: decisions.map((item) => item.code),
			yAxis: [decisions.map((item) => item.searchCount ?? 0)],
			yLabel: ['Số lượt tra cứu'],
			formatY: (val: number) => `${val} lượt`,
		};
	}, [decisions]);

	const totals = useMemo(() => {
		const totalSearch = decisions.reduce((sum, item) => sum + (item.searchCount ?? 0), 0);
		const topDecision = [...decisions]
			.sort((a, b) => (b.searchCount ?? 0) - (a.searchCount ?? 0))
			.slice(0, 1)[0];
		return { totalSearch, topDecision };
	}, [decisions]);

	const fieldDefinitions = (result?.fieldDefinitions ?? []) as DiplomaField.IRecord[];

	return (
		<Row gutter={[24, 24]}>
			<Col xs={24} lg={10}>
				<Card title='Tra cứu văn bằng'>
					<Form layout='vertical' form={form}>
						<Form.Item label='Số hiệu văn bằng' name='serialNumber'>
							<Input placeholder='VD: GD-2024-0001' />
						</Form.Item>
						<Form.Item label='Số vào sổ' name='entryNumber'>
							<InputNumber min={1} style={{ width: '100%' }} />
						</Form.Item>
						<Form.Item label='Mã sinh viên' name='studentCode'>
							<Input placeholder='VD: B21DCCN001' />
						</Form.Item>
						<Form.Item label='Họ và tên' name='fullName'>
							<Input />
						</Form.Item>
						<Form.Item label='Ngày sinh' name='dob'>
							<MyDatePicker saveFormat='YYYY-MM-DD' />
						</Form.Item>
						<Button type='primary' block size='large' loading={loading} onClick={performSearch}>
							Tra cứu
						</Button>
					</Form>
				</Card>
				<Card style={{ marginTop: 24 }}>
					<Space direction='vertical' style={{ width: '100%' }}>
						<Statistic title='Tổng lượt tra cứu ghi nhận' value={totals.totalSearch} />
						{totals.topDecision && (
							<div>
								<Typography.Text type='secondary'>Quyết định được tra nhiều nhất</Typography.Text>
								<Typography.Title level={4} style={{ marginTop: 4 }}>
									{totals.topDecision.code}
								</Typography.Title>
								<Typography.Text>
									{totals.topDecision.searchCount ?? 0} lượt từ đầu năm
								</Typography.Text>
							</div>
						)}
					</Space>
				</Card>
			</Col>
			<Col xs={24} lg={14}>
				<Card title='Kết quả tra cứu'>
					{result?.diploma ? (
						<Space direction='vertical' style={{ width: '100%' }} size='large'>
							<Descriptions column={2} bordered>
								<Descriptions.Item label='Số vào sổ'>{result.diploma.entryNumber}</Descriptions.Item>
								<Descriptions.Item label='Số hiệu'>{result.diploma.serialNumber}</Descriptions.Item>
								<Descriptions.Item label='Mã sinh viên'>{result.diploma.studentCode}</Descriptions.Item>
								<Descriptions.Item label='Họ tên'>{result.diploma.fullName}</Descriptions.Item>
								<Descriptions.Item label='Ngày sinh'>
									{dayjs(result.diploma.dob).format('DD/MM/YYYY')}
								</Descriptions.Item>
								<Descriptions.Item label='Quyết định'>{result.diploma.decisionCode}</Descriptions.Item>
								<Descriptions.Item label='Thuộc sổ'>{result.diploma.bookName}</Descriptions.Item>
							</Descriptions>
							<DynamicFieldDescriptions fields={fieldDefinitions} extras={result.diploma.extras} />
							{result.decision && (
								<Card type='inner' title='Quyết định tốt nghiệp'>
									<Space direction='vertical'>
										<div>
											<strong>Số quyết định:</strong> {result.decision.code}
										</div>
										<div>
											<strong>Ngày ban hành:</strong> {dayjs(result.decision.issuedAt).format('DD/MM/YYYY')}
										</div>
										<div>
											<strong>Trích yếu:</strong> {result.decision.summary || '—'}
										</div>
									</Space>
								</Card>
							)}
						</Space>
					) : (
						<Empty description='Chưa có dữ liệu hoặc thông tin không khớp' />
					)}
				</Card>
				{chartData && (
					<Card style={{ marginTop: 24 }}>
						<ColumnChart {...chartData} />
					</Card>
				)}
			</Col>
		</Row>
	);
};

export default TraCuuVanBang;
