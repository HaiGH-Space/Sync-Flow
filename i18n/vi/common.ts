const common = {
  actions: {
    edit: 'Sửa',
    delete: 'Xóa',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    retry: 'Thử lại'
  },
  search: {
    placeholder: 'Tìm kiếm...',
    submit: 'Tìm kiếm'
  },
  status: {
    loading: 'Đang tải...',
    saving: 'Đang lưu...',
    creating: 'Đang tạo...',
    updating: 'Đang cập nhật...',
    deleting: 'Đang xóa...'
  }
} as const;

export default common;
