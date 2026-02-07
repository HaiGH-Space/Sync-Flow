const validation = {
  auth: {
    email_invalid: "Invalid email address",
    password_required: "Please enter your password",
    password_min: "Password must be at least 8 characters",
    name_min: "Name must be at least 2 characters",
  },
} as const;

export default validation;
