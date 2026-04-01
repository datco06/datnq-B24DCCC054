import { Form, Modal, Select } from 'antd';
import { useEffect } from 'react';
import type { CauLacBo } from '../typing';

interface ModalChuyenCauLacBoProps {
	mo: boolean;
	soLuong: number;
	danhSachCauLacBo: CauLacBo[];
	onDong: () => void;
	onXacNhan: (cauLacBoId: string) => void;
}

const ModalChuyenCauLacBo = ({ mo, soLuong, danhSachCauLacBo, onDong, onXacNhan }: ModalChuyenCauLacBoProps) => {
	const [form] = Form.useForm<{ cauLacBoId: string }>();

	useEffect(() => {
		if (!mo) form.resetFields();
	}, [form, mo]);

	const xuLyXacNhan = () => {
		form
			.validateFields()
			.then((giaTri) => onXacNhan(giaTri.cauLacBoId))
			.catch(() => {});
	};

	return (
		<Modal
			title='Chuyển câu lạc bộ cho thành viên'
			visible={mo}
			onCancel={onDong}
			onOk={xuLyXacNhan}
			okText='Chuyển câu lạc bộ'
			destroyOnClose
		>
			<p>Đổi câu lạc bộ cho {soLuong} thành viên đã chọn.</p>
			<Form layout='vertical' form={form}>
				<Form.Item
					label='Câu lạc bộ muốn chuyển đến'
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
			</Form>
		</Modal>
	);
};

export default ModalChuyenCauLacBo;
