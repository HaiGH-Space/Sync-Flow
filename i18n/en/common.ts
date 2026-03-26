const common = {
  actions: {
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    retry: 'Try again'
  },
  search: {
    placeholder: 'Search...',
    submit: 'Submit search'
  },
  status: {
    loading: 'Loading...',
    saving: 'Saving...',
    creating: 'Creating...',
    updating: 'Updating...',
    deleting: 'Deleting...'
  }
} as const;

export default common;
