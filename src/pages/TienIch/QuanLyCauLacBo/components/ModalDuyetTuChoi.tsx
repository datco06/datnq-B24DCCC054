import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';

interface ModalDuyetTuChoiProps {
	mo: boolean;
	cheDo: 'duyet' | 'tuChoi';
	soLuong: number;
	onDong: () => void;
	onXacNhan: (lyDo?: string) => void;
}

const ModalDuyetTuChoi = ({ mo, cheDo, soLuong, onDong, onXacNhan }: ModalDuyetTuChoiProps) => {
	const [form] = Form.useForm<{ lyDo?: string }>();

	useEffect(() => {
		if (!mo) form.resetFields();
	}, [form, mo]);

	const xuLyXacNhan = () => {
		if (cheDo === 'duyet') {
			onXacNhan();
			return;
		}
		form
			.validateFields()
			.then((giaTri) => onXacNhan(giaTri.lyDo))
			.catch(() => {});
	};

	return (
		<Modal
			title={cheDo === 'duyet' ? 'Xác nhận duyệt đơn' : 'Xác nhận từ chối đơn'}
			visible={mo}
			onCancel={onDong}
			onOk={xuLyXacNhan}
			okText={cheDo === 'duyet' ? 'Duyệt' : 'Từ chối'}
			okButtonProps={{ danger: cheDo === 'tuChoi' }}
			destroyOnClose
		>
			<p>
				{cheDo === 'duyet'
					? `Bạn có chắc muốn duyệt ${soLuong} đơn đã chọn không?`
					: `Bạn có chắc muốn từ chối ${soLuong} đơn đã chọn không?`}
			</p>
			{cheDo === 'tuChoi' && (
				<Form layout='vertical' form={form}>
					<Form.Item
						label='Lý do từ chối'
						name='lyDo'
						rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
					>
						<Input.TextArea rows={4} placeholder='Nhập lý do từ chối' />
					</Form.Item>
				</Form>
			)}
		</Modal>
	);
};

export default ModalDuyetTuChoi;
