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
    noSearchResults: 'No matching projects found',
    loadingSprints: 'Loading sprints...',
    errorLoadingSprints: 'Error loading sprints',
    noSprints: 'No sprints yet',
    searchPlaceholder: 'Search...',
    role: {
      owner: 'Workspace owner',
      admin: 'Administrator',
      member: 'Member'
    }
  },
  navigation: {
    board: 'Board',
    backlog: 'Backlog',
    planning: 'Planning',
    timeline: 'Timeline'
  },
  board: {
    errorLoadingColumns: 'Error loading columns',
    errorHint: 'Please check your connection and try again.',
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
      createFailed: 'Failed to create project',
      deleted: 'Project deleted successfully',
      deleteFailed: 'Failed to delete project'
    },
    delete: {
      title: 'Delete project "{name}"?',
      description: 'Are you sure you want to delete this project?',
      action: 'Delete project {name}'
    },
    settings: {
      title: 'Project Settings',
      description: 'View and manage project settings.',
      action: 'Settings for {name}',
      nameLabel: 'Project name',
      keyLabel: 'Project key',
      idLabel: 'Project ID',
      descriptionLabel: 'Description',
      manageHint: 'You can add project management options here later.',
      dangerTitle: 'Danger Zone',
      dangerDescription: 'Actions here are irreversible. Please proceed with caution.',
      deleteWarning: 'This action is permanent and cannot be undone. All data will be lost.',
      tabs: {
        general: 'General',
        generalDescription: 'Basic project info',
        dangerZone: 'Danger Zone',
        dangerZoneDescription: 'Irreversible actions'
      }
    }
  },
  workspace: {
    create: {
      title: 'Create New Workspace',
      description: 'Create a workspace to organize your projects.',
      nameLabel: 'Workspace name',
      namePlaceholder: 'My Workspace',
      submit: 'Create Workspace'
    },
    menu: {
      title: 'Workspace settings',
      openSettings: 'Open settings',
      copyId: 'Copy workspace ID'
    },
    tabs: {
      general: 'General',
      generalDescription: 'Basic workspace info',
      members: {
        title: 'Members',
        description: 'People in this workspace'
      },
      permissions: {
        title: 'Permissions',
        description: 'Roles and access'
      }
    },
    settings: {
      title: 'Workspace settings',
      description: 'This is where workspace settings can be shown and managed.',
      name: 'Workspace name',
      id: 'Workspace ID',
      slug: 'URL slug',
      manageHint: 'You can add workspace management options here later.',
      memberHint: 'You are currently a member. Some settings may be limited.',
      membersDescription: 'A list of members currently in this workspace.',
      noMembers: 'No members yet.',
      permissionsAdminHint: 'You can manage some important workspace settings.',
      permissionsMemberHint: 'Some administrative permissions are not available for your role.',
      permissionAllowed: {
        label: 'Allowed'
      },
      permissionRestricted: {
        label: 'Restricted'
      },
      permissionItem: {
        manageProjects: 'Manage projects',
        manageMembers: 'Manage members'
      },
      copied: 'Workspace ID copied',
      copyFailed: 'Failed to copy workspace ID'
    },
    toast: {
      created: 'Workspace created successfully',
      createFailed: 'Failed to create workspace'
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
