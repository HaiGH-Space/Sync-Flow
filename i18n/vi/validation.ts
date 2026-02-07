const validation = {
  auth: {
    email_invalid: "Email không hợp lệ",
    password_required: "Vui lòng nhập mật khẩu",
    password_min: "Mật khẩu phải có ít nhất 8 ký tự",
    name_min: "Tên phải có ít nhất 2 ký tự",
  },
} as const;

export default validation;
