import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import type { FilterDropdownProps } from 'antd/lib/table/interface';
import type { ReactNode } from 'react';
import { removeVietnameseTones } from '@/utils/utils';

const chuanHoaChuoi = (giaTri: unknown) => removeVietnameseTones(String(giaTri ?? '').toLowerCase());

export const locChuoiTrenBang = <T extends Record<string, any>>(
	truongDuLieu: keyof T | string,
	tenTruong: string,
	render?: (giaTri: any, banGhi: T) => ReactNode,
) => ({
	filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
		<div style={{ padding: 8, width: 260 }}>
			<Input
				placeholder={`Tìm ${tenTruong.toLowerCase()}`}
				value={(selectedKeys[0] as string) || ''}
				onChange={(suKien) => setSelectedKeys(suKien.target.value ? [suKien.target.value] : [])}
				onPressEnter={() => confirm()}
			/>
			<Space style={{ marginTop: 8 }}>
				<Button type='primary' onClick={() => confirm()} size='small'>
					Lọc
				</Button>
				<Button
					size='small'
					onClick={() => {
						clearFilters?.();
						confirm();
					}}
				>
					Xóa
				</Button>
			</Space>
		</div>
	),
	filterIcon: (dangLoc: boolean) => <SearchOutlined style={{ color: dangLoc ? '#1890ff' : undefined }} />,
	onFilter: (giaTri: string | number | boolean, banGhi: T) =>
		chuanHoaChuoi(banGhi[truongDuLieu as keyof T]).includes(chuanHoaChuoi(giaTri)),
	render: render
		? (giaTri: any, banGhi: T) => render(giaTri, banGhi)
		: undefined,
});

export const sapXepChuoi = (a: unknown, b: unknown) => String(a ?? '').localeCompare(String(b ?? ''), 'vi');

export const sapXepNgay = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();
