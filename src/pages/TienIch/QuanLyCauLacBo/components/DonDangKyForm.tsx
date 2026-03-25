import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect } from 'react';
import type { CauLacBo, DonDangKy, DuLieuDonDangKyForm } from '../typing';

interface DonDangKyFormProps {
	mo: boolean;
	duLieu?: DonDangKy;
	dangSua?: boolean;
	danhSachCauLacBo: CauLacBo[];
	onDong: () => void;
	onLuu: (duLieu: DuLieuDonDangKyForm) => void;
}

const DonDangKyForm = ({ mo, duLieu, dangSua, danhSachCauLacBo, onDong, onLuu }: DonDangKyFormProps) => {
	const [form] = Form.useForm<DuLieuDonDangKyForm>();

	useEffect(() => {
		if (mo && duLieu) {
			form.setFieldsValue({
				hoTen: duLieu.hoTen,
				email: duLieu.email,
				soDienThoai: duLieu.soDienThoai,
				gioiTinh: duLieu.gioiTinh,
				diaChi: duLieu.diaChi,
				soTruong: duLieu.soTruong,
				cauLacBoId: duLieu.cauLacBoId,
				lyDoDangKy: duLieu.lyDoDangKy,
				trangThai: duLieu.trangThai,
				ghiChu: duLieu.ghiChu,
			});
			return;
		}
		form.resetFields();
		form.setFieldsValue({
			gioiTinh: 'nam',
			trangThai: 'pending',
		});
	}, [duLieu, form, mo]);

	const xuLyLuu = () => {
		form
			.validateFields()
			.then((giaTri) => {
				onLuu(giaTri);
			})
			.catch(() => {});
	};

	return (
		<Modal
			title={dangSua ? 'Chỉnh sửa đơn đăng ký' : 'Thêm đơn đăng ký'}
			visible={mo}
			onCancel={onDong}
			onOk={xuLyLuu}
			width={860}
			destroyOnClose
		>
			<Form layout='vertical' form={form}>
				<Row gutter={16}>
					<Col xs={24} md={12}>
						<Form.Item label='Họ tên' name='hoTen' rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							label='Email'
							name='email'
							rules={[
								{ required: true, message: 'Vui lòng nhập email' },
								{ type: 'email', message: 'Email không hợp lệ' },
							]}
						>
							<Input placeholder='Nhập email' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col xs={24} md={8}>
						<Form.Item
							label='SĐT'
							name='soDienThoai'
							rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
						>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item label='Giới tính' name='gioiTinh' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
							<Select>
								<Select.Option value='nam'>Nam</Select.Option>
								<Select.Option value='nu'>Nữ</Select.Option>
								<Select.Option value='khac'>Khác</Select.Option>
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item label='Trạng thái' name='trangThai' rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
							<Select>
								<Select.Option value='pending'>Pending</Select.Option>
								<Select.Option value='approved'>Approved</Select.Option>
								<Select.Option value='rejected'>Rejected</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col xs={24} md={12}>
						<Form.Item label='Địa chỉ' name='diaChi' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
							<Input placeholder='Nhập địa chỉ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item label='Sở trường' name='soTruong' rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}>
							<Input placeholder='Nhập sở trường' />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label='Câu lạc bộ'
					name='cauLacBoId'
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
				>
					<Select placeholder='Chọn câu lạc bộ'>
						{danhSachCauLacBo.map((cauLacBo) => (
							<Select.Option key={cauLacBo.id} value={cauLacBo.id}>
								{cauLacBo.tenCauLacBo}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					label='Lý do đăng ký'
					name='lyDoDangKy'
					rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
				>
					<Input.TextArea rows={4} placeholder='Nhập lý do đăng ký' />
				</Form.Item>
				<Form.Item
					label='Ghi chú'
					name='ghiChu'
					dependencies={['trangThai']}
					rules={[
						({ getFieldValue }) => ({
							validator: (_, giaTri) => {
								if (getFieldValue('trangThai') !== 'rejected' || giaTri) return Promise.resolve();
								return Promise.reject(new Error('Vui lòng nhập lý do từ chối'));
							},
						}),
					]}
				>
					<Input.TextArea rows={3} placeholder='Nhập ghi chú hoặc lý do từ chối' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DonDangKyForm;
