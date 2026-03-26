const validation = {
  auth: {
    email_invalid: "Invalid email address",
    password_required: "Please enter your password",
    password_min: "Password must be at least 8 characters",
    name_min: "Name must be at least 2 characters",
  },
  project: {
    name_required: "Project name is required",
    key_required: "Project key is required",
  },
  workspace: {
    name_required: "Workspace name is required",
  },
  issue: {
    title_required: "Issue title is required",
  },
} as const;

export default validation;
