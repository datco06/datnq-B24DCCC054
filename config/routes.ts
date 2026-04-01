export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},


	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/bai-1',
		name: 'Bài 1',
		routes: [
			{
				path: '/bai-1',
				redirect: '/bai-1/doan-so',
			},
			{
				path: '/bai-1/doan-so',
				name: 'Đoán số',
				component: './TienIch/Bai1/DoanSo',
			},
			{
				path: '/bai-1/todo-list',
				name: 'TodoList',
				component: './TienIch/Bai1/TodoList',
			},
		],
	},
	{
		path: '/bai-2',
		name: 'Bài 2',
		routes: [
			{
				path: '/bai-2',
				redirect: '/bai-2/oan-tu-ti',
			},
			{
				path: '/bai-2/oan-tu-ti',
				name: 'Oẳn Tù Tì',
				component: './TienIch/Bai2/OanTuTi',
			},
			{
				path: '/bai-2/ngan-hang-cau-hoi',
				name: 'Ngân hàng câu hỏi',
				component: './TienIch/Bai2/QuanLyNganHang',
			},
		],
	},
	{
		path: '/bai-3',
		name: 'Bài 3',
		routes: [
			{
				path: '/bai-3',
				redirect: '/bai-3/quan-ly-nhan-vien',
			},
			{
				path: '/bai-3/quan-ly-nhan-vien',
				name: 'Quản lý nhân viên',
				component: './TienIch/Bai3/QuanLyNhanVien',
			},
			{
				path: '/bai-3/quan-ly-lich-hen',
				name: 'Quản lý lịch hẹn',
				component: './TienIch/Bai3/QuanLyLichHen',
			},
			{
				path: '/bai-3/danh-gia-dich-vu',
				name: 'Đánh giá & Thống kê',
				routes: [
					{
						path: '/bai-3/danh-gia-dich-vu',
						redirect: '/bai-3/danh-gia-dich-vu/feedback',
					},
					{
						path: '/bai-3/danh-gia-dich-vu/feedback',
						name: 'Đánh giá',
						component: './TienIch/Bai3/DanhGiaDichVu',
					},
					{
						path: '/bai-3/danh-gia-dich-vu/thong-ke',
						name: 'Thống kê',
						component: './TienIch/Bai3/ThongKe',
					},
				],
			},
		],
	},
	{
		path: '/quan-ly-van-bang',
		name: 'Bài 5 - Quản lý văn bằng',
		routes: [
			{
				path: '/quan-ly-van-bang',
				redirect: '/quan-ly-van-bang/so-van-bang',
			},
			{
				path: '/quan-ly-van-bang/so-van-bang',
				name: 'Sổ văn bằng',
				component: './TienIch/Bai5/SoVanBang',
			},
			{
				path: '/quan-ly-van-bang/quyet-dinh',
				name: 'Quyết định tốt nghiệp',
				component: './TienIch/Bai5/QuyetDinh',
			},
			{
				path: '/quan-ly-van-bang/cau-hinh-truong',
				name: 'Cấu hình biểu mẫu',
				component: './TienIch/Bai5/CauHinhTruong',
			},
			{
				path: '/quan-ly-van-bang/thong-tin-van-bang',
				name: 'Thông tin văn bằng',
				component: './TienIch/Bai5/ThongTinVanBang',
			},
			{
				path: '/quan-ly-van-bang/tra-cuu',
				name: 'Tra cứu văn bằng',
				component: './TienIch/Bai5/TraCuu',
			},
		],
	},
	{
		path: '/quan-ly-cau-lac-bo',
		name: 'QuanLyCauLacBo',
		component: './TienIch/QuanLyCauLacBo',
		icon: 'TeamOutlined',
	},

	

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
