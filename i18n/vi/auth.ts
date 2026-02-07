const auth = {
	login: {
		title: "Chào mừng quay lại",
		subtitle: "Chào mừng quay lại! Vui lòng đăng nhập vào tài khoản của bạn.",
		submit: "Đăng nhập",
		email_placeholder: "Nhập email của bạn",
		password_placeholder: "Nhập mật khẩu của bạn",
		no_account: "Chưa có tài khoản?",
		go_to_register: "Đăng ký",
		have_account: "Đã có tài khoản?",
		go_to_login: "Đăng nhập",
		divider_text: "hoặc tiếp tục với"
	},
	register: {
		title: "Tạo tài khoản",
		subtitle: "Tạo tài khoản mới để bắt đầu.",
		submit: "Tạo tài khoản",
		name_placeholder: "Nhập họ tên của bạn",
		email_placeholder: "Nhập email của bạn",
		password_placeholder: "Nhập mật khẩu của bạn"
	},
	toast: {
		logging_in: "Đang đăng nhập...",
		registering: "Đang đăng ký...",
		register_success: "Đăng ký thành công! Bây giờ bạn có thể đăng nhập."
	}
} as const;

export default auth;

