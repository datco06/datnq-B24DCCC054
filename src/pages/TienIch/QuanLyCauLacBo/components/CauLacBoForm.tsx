import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import { blobToBase64, renderFileListUrl } from '@/utils/utils';
import { Col, DatePicker, Form, Input, Modal, Row, Switch } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import type { CauLacBo, DuLieuCauLacBoForm } from '../typing';

interface CauLacBoFormProps {
	mo: boolean;
	duLieu?: CauLacBo;
	dangSua?: boolean;
	onDong: () => void;
	onLuu: (duLieu: Omit<CauLacBo, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
}

const CauLacBoForm = ({ mo, duLieu, dangSua, onDong, onLuu }: CauLacBoFormProps) => {
	const [form] = Form.useForm<DuLieuCauLacBoForm>();

	useEffect(() => {
		if (mo && duLieu) {
			form.setFieldsValue({
				anhDaiDienTaiLen: renderFileListUrl(duLieu.anhDaiDien || ''),
				tenCauLacBo: duLieu.tenCauLacBo,
				ngayThanhLap: moment(duLieu.ngayThanhLap),
				moTa: duLieu.moTa,
				chuNhiem: duLieu.chuNhiem,
				dangHoatDong: duLieu.dangHoatDong,
			});
			return;
		}
		form.resetFields();
		form.setFieldsValue({
			dangHoatDong: true,
			ngayThanhLap: moment(),
			moTa: '<p></p>',
		});
	}, [duLieu, form, mo]);

	const layAnhDaiDien = async (duLieuAnh: any) => {
		const tep = duLieuAnh?.fileList?.[0];
		if (!tep) return duLieu?.anhDaiDien ?? '';
		if (tep.url) return tep.url;
		if (tep.thumbUrl) return tep.thumbUrl;
		if (tep.originFileObj) return blobToBase64(tep.originFileObj);
		return duLieu?.anhDaiDien ?? '';
	};

	const xuLyLuu = () => {
		form
			.validateFields()
			.then(async (giaTri) => {
				const anhDaiDien = await layAnhDaiDien(giaTri.anhDaiDienTaiLen);
				onLuu({
					anhDaiDien,
					tenCauLacBo: giaTri.tenCauLacBo,
					ngayThanhLap: giaTri.ngayThanhLap.format('YYYY-MM-DD'),
					moTa: giaTri.moTa,
					chuNhiem: giaTri.chuNhiem,
					dangHoatDong: giaTri.dangHoatDong,
				});
			})
			.catch(() => {});
	};

	return (
		<Modal
			title={dangSua ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ'}
			visible={mo}
			onCancel={onDong}
			onOk={xuLyLuu}
			width={900}
			destroyOnClose
		>
			<Form layout='vertical' form={form}>
				<Row gutter={16}>
					<Col xs={24} md={8}>
						<Form.Item label='Ảnh đại diện' name='anhDaiDienTaiLen'>
							<UploadFile isAvatar maxCount={1} />
						</Form.Item>
					</Col>
					<Col xs={24} md={16}>
						<Form.Item
							label='Tên câu lạc bộ'
							name='tenCauLacBo'
							rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
						>
							<Input placeholder='Nhập tên câu lạc bộ' />
						</Form.Item>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Ngày thành lập'
									name='ngayThanhLap'
									rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
								>
									<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Chủ nhiệm CLB'
									name='chuNhiem'
									rules={[{ required: true, message: 'Vui lòng nhập chủ nhiệm CLB' }]}
								>
									<Input placeholder='Nhập tên chủ nhiệm' />
								</Form.Item>
							</Col>
						</Row>
						<Form.Item label='Hoạt động' name='dangHoatDong' valuePropName='checked'>
							<Switch checkedChildren='Có' unCheckedChildren='Không' />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label='Mô tả'
					name='moTa'
					rules={[{ required: true, message: 'Vui lòng nhập mô tả câu lạc bộ' }]}
				>
					<TinyEditor height={320} minHeight={200} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CauLacBoForm;
