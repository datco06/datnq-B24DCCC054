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
			path: '/bai-4',
			name: 'Bài 4 - Quản lý văn bằng',
			routes: [
				{
					path: '/bai-4',
					redirect: '/bai-4/so-van-bang',
				},
				{
					path: '/bai-4/so-van-bang',
					name: 'Sổ văn bằng',
					component: './TienIch/Bai4/SoVanBang',
				},
				{
					path: '/bai-4/quyet-dinh',
					name: 'Quyết định tốt nghiệp',
					component: './TienIch/Bai4/QuyetDinh',
				},
				{
					path: '/bai-4/cau-hinh-truong',
					name: 'Cấu hình biểu mẫu',
					component: './TienIch/Bai4/CauHinhTruong',
				},
				{
					path: '/bai-4/thong-tin-van-bang',
					name: 'Thông tin văn bằng',
					component: './TienIch/Bai4/ThongTinVanBang',
				},
				{
					path: '/bai-4/tra-cuu',
					name: 'Tra cứu văn bằng',
					component: './TienIch/Bai4/TraCuu',
				},
			],
		},
	{
		path: '/bai-5/quan-ly-cau-lac-bo',
		name: 'Bài 5 - Quản lý câu lạc bộ',
		component: './TienIch/Bai5/QuanLyCauLacBo',
	},

	{
		path: '/bai-6',
		name: 'Bài 6',
		routes: [
			{
				path: '/bai-6',
				redirect: '/bai-6/trang-chu',
			},
			{
				path: '/bai-6/trang-chu',
				name: 'Trang chủ',
				component: './Bai6/TrangChu',
			},
			{
				path: '/bai-6/quan-ly-ngan-sach',
				name: 'Quản lý ngân sách',
				component: './Bai6/QuanLyNganSach',
			},
			{
				path: '/bai-6/tao-lich-trinh',
				name: 'Tạo lịch trình',
				component: './Bai6/TaoLichTrinh',
			},
			{
				path: '/bai-6/trang-quan-tri',
				name: 'Trang quản trị',
				component: './Bai6/TrangQuanTri',
			},
		],
	},
	{
		path: '/bai-7',
		name: 'Bài 7 - Quản lý công việc nhóm',
		hideChildrenInMenu: true,
		routes: [
			{
				path: '/bai-7',
				redirect: '/bai-7/dang-nhap',
			},
			{
				path: '/bai-7/dang-nhap',
				component: './TienIch/Bai7/DangNhap',
				hideInMenu: true,
			},
			{
				path: '/bai-7/workspace',
				component: './TienIch/Bai7/Workspace',
				hideInMenu: true,
			},
		],
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
