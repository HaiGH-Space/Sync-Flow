const validation = {
  auth: {
    email_invalid: "Email không hợp lệ",
    password_required: "Vui lòng nhập mật khẩu",
    password_min: "Mật khẩu phải có ít nhất 8 ký tự",
    name_min: "Tên phải có ít nhất 2 ký tự",
  },
  project: {
    name_required: "Tên dự án là bắt buộc",
    key_required: "Mã dự án là bắt buộc",
  },
  workspace: {
    name_required: "Tên workspace là bắt buộc",
  },
  issue: {
    title_required: "Tiêu đề issue là bắt buộc",
  },
} as const;

export default validation;
