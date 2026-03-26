const dashboard = {
  otherView: 'Chế độ xem khác',
  selectWorkspace: {
    title: 'Hãy chọn workspace để bắt đầu làm việc.'
  },
  selectProject: {
    title: 'Hãy chọn dự án để bắt đầu làm việc.'
  },
  toast: {
    loadWorkspaceFailed: 'Không thể tải danh sách workspace.'
  },
  sidebar: {
    noWorkspaceSelected: 'Chưa chọn workspace',
    loadingProjects: 'Đang tải dự án...',
    noProjects: 'Chưa có dự án',
    noSearchResults: 'Không tìm thấy dự án phù hợp',
    loadingSprints: 'Đang tải sprint...',
    errorLoadingSprints: 'Lỗi tải sprint',
    noSprints: 'Chưa có sprint',
    searchPlaceholder: 'Tìm kiếm...'
  },
  navigation: {
    board: 'Bảng',
    backlog: 'Backlog',
    planning: 'Lập kế hoạch',
    timeline: 'Dòng thời gian'
  },
  board: {
    errorLoadingColumns: 'Lỗi tải cột',
    errorHint: 'Vui lòng kiểm tra kết nối và thử lại.',
    empty: 'Chưa có cột hoặc issue nào'
  },
  project: {
    create: {
      title: 'Tạo dự án mới',
      description: 'Tạo dự án mới trong {workspaceName}.',
      namePlaceholder: 'Tên dự án',
      keyPlaceholder: 'Mã dự án',
      descriptionPlaceholder: 'Mô tả dự án (tùy chọn)',
      submit: 'Tạo dự án',
      submitting: 'Đang tạo...'
    },
    toast: {
      created: 'Tạo dự án thành công',
      createFailed: 'Tạo dự án thất bại'
    }
  },
  issue: {
    assignee: {
      me: 'Tôi ({name})',
      unassigned: 'Chưa gán'
    },
    priority: {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    },
    form: {
      titlePlaceholder: 'Tiêu đề issue',
      descriptionPlaceholder: 'Mô tả issue (tùy chọn)',
      assigneePlaceholder: 'Người phụ trách',
      assigneeLabel: 'Người phụ trách',
      priorityPlaceholder: 'Độ ưu tiên',
      priorityLabel: 'Ưu tiên'
    },
    create: {
      title: 'Tạo issue mới',
      description: 'Tạo issue mới.',
      submit: 'Tạo issue',
      submitting: 'Đang tạo...'
    },
    update: {
      title: 'Cập nhật issue',
      description: 'Cập nhật thông tin issue.',
      submit: 'Cập nhật issue',
      submitting: 'Đang cập nhật...'
    },
    detail: {
      loadingTitle: 'Đang tải chi tiết công việc',
      errorTitle: 'Lỗi tải dữ liệu',
      errorDescription: 'Đã xảy ra lỗi khi tải chi tiết công việc.',
      dialogTitle: 'ISSUE {number} - {title}',
      descriptionLabel: 'Mô tả',
      descriptionPlaceholder: 'Không có mô tả.',
      commentsLabel: 'Bình luận',
      commentPlaceholder: 'Viết bình luận...',
      commentSubmit: 'Thêm bình luận',
      commentSubmitting: 'Đang thêm...',
      commentUpdate: 'Lưu thay đổi',
      commentCancel: 'Hủy',
      commentEditing: 'Đang chỉnh sửa',
      commentDelete: 'Xóa bình luận',
      commentDeleting: 'Đang xóa...',
      commentUpdating: 'Đang cập nhật...',
      noComments: 'Chưa có bình luận nào.',
      statusLabel: 'Trạng thái',
      saveChanges: 'Lưu thay đổi',
      reporterLabel: 'Người tạo:',
      createdAtLabel: 'Ngày tạo:',
      updatedAtLabel: 'Cập nhật:'
    },
    toast: {
      created: 'Tạo issue thành công',
      createFailed: 'Tạo issue thất bại',
      updated: 'Cập nhật issue thành công',
      updateFailed: 'Cập nhật issue thất bại',
      commentCreated: 'Thêm bình luận thành công',
      commentCreateFailed: 'Thêm bình luận thất bại',
      commentUpdated: 'Cập nhật bình luận thành công',
      commentUpdateFailed: 'Cập nhật bình luận thất bại',
      commentDeleted: 'Xóa bình luận thành công',
      commentDeleteFailed: 'Xóa bình luận thất bại',
      deleted: 'Đã xóa issue',
      deleteFailed: 'Xóa issue thất bại'
    },
    delete: {
      title: 'Xóa "{title}"?',
      description: 'Bạn có chắc muốn xóa issue này không?'
    }
  }
} as const;

export default dashboard;
