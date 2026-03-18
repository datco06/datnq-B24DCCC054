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

	///////////////////////////////////
	// DEFAULT MENU
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
		path: '/tro-choi-doan-so',
		name: 'Bài 1 - Đoán Số',
		component: './TienIch/DoanSo',
	},
	{
		path: '/todo-list',
		name: 'Bài 2 - TodoList',
		component: './TienIch/TodoList',
	},
	{
		path: '/oan-tu-ti',
		name: 'Bài 3 - Oẳn Tù Tì',
		component: './TienIch/OanTuTi',
	},
	{
		path: '/quan-ly-ngan-hang',
		name: 'Bài 4 - Ngân Hàng Câu Hỏi',
		component: './TienIch/QuanLyNganHang',
	},
{
  path: '/quan-ly-nhan-vien',
  name: 'Quản lý nhân viên',
  component: './TienIch/Quanlynhanvien',
},
{
  path: '/quan-ly-lich-hen',
  name: 'Quản lý lịch hẹn',
  component: './TienIch/quanlylichhen',
},
{
  path: '/danh-gia-dich-vu',
  name: 'Đánh giá & Thống kê',
  routes: [
    { path: '/danh-gia-dich-vu/feedback', name: 'Đánh giá', component: './TienIch/danhgiadichvu' },
    { path: '/danh-gia-dich-vu/thong-ke', name: 'Thống kê', component: './TienIch/thongke' },
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
