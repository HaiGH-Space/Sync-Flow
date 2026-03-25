const dashboard = {
  otherView: 'Other view',
  selectWorkspace: {
    title: 'Select a workspace to start working.'
  },
  selectProject: {
    title: 'Select a project to start working.'
  },
  toast: {
    loadWorkspaceFailed: 'Failed to load workspace list.'
  },
  sidebar: {
    noWorkspaceSelected: 'No Workspace Selected',
    loadingProjects: 'Loading projects...',
    noProjects: 'No projects yet',
    loadingSprints: 'Loading sprints...',
    errorLoadingSprints: 'Error loading sprints',
    noSprints: 'No sprints yet',
    searchPlaceholder: 'Search...'
  },
  navigation: {
    board: 'Board',
    backlog: 'Backlog',
    planning: 'Planning',
    timeline: 'Timeline'
  },
  board: {
    errorLoadingColumns: 'Error loading columns',
    empty: 'No columns or issues found'
  },
  project: {
    create: {
      title: 'Create New Project',
      description: 'Create a new project in {workspaceName}.',
      namePlaceholder: 'Project Name',
      keyPlaceholder: 'Project Key',
      descriptionPlaceholder: 'Project Description (optional)',
      submit: 'Create Project',
      submitting: 'Creating...'
    },
    toast: {
      created: 'Project created successfully',
      createFailed: 'Failed to create project'
    }
  },
  issue: {
    assignee: {
      me: 'Me ({name})',
      unassigned: 'Unassigned'
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    form: {
      titlePlaceholder: 'Issue Title',
      descriptionPlaceholder: 'Issue Description (optional)',
      assigneePlaceholder: 'Assignee',
      assigneeLabel: 'Assignee',
      priorityPlaceholder: 'Issue Priority',
      priorityLabel: 'Priority'
    },
    create: {
      title: 'Create New Issue',
      description: 'Create a new issue.',
      submit: 'Create Issue',
      submitting: 'Creating...'
    },
    update: {
      title: 'Update Issue',
      description: 'Update issue details.',
      submit: 'Update Issue',
      submitting: 'Updating...'
    },
    detail: {
      loadingTitle: 'Loading issue details',
      errorTitle: 'Failed to load issue details',
      errorDescription: 'An error occurred while loading issue details.',
      dialogTitle: 'ISSUE {number} - {title}',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'No description.',
      commentsLabel: 'Comments',
      commentPlaceholder: 'Write a comment...',
      commentSubmit: 'Add comment',
      commentSubmitting: 'Adding...',
      commentUpdate: 'Save changes',
      commentCancel: 'Cancel',
      commentEditing: 'Editing',
      commentDelete: 'Delete comment',
      commentDeleting: 'Deleting...',
      commentUpdating: 'Updating...',
      noComments: 'No comments yet.',
      statusLabel: 'Status',
      saveChanges: 'Save changes',
      reporterLabel: 'Reporter:',
      createdAtLabel: 'Created:',
      updatedAtLabel: 'Updated:'
    },
    toast: {
      created: 'Issue created successfully',
      createFailed: 'Failed to create issue',
      updated: 'Issue updated successfully',
      updateFailed: 'Failed to update issue',
      commentCreated: 'Comment added successfully',
      commentCreateFailed: 'Failed to add comment',
      commentUpdated: 'Comment updated successfully',
      commentUpdateFailed: 'Failed to update comment',
      commentDeleted: 'Comment deleted successfully',
      commentDeleteFailed: 'Failed to delete comment',
      deleted: 'Issue deleted',
      deleteFailed: 'Failed to delete issue'
    },
    delete: {
      title: 'Delete "{title}"?',
      description: 'Are you sure you want to delete this issue?'
    }
  }
} as const;

export default dashboard;
