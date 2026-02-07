const auth = {
	login: {
		title: "Welcome back",
		subtitle: "Welcome back! Please sign in to your account.",
		submit: "Sign in",
		email_placeholder: "Enter your email",
		password_placeholder: "Enter your password",
		no_account: "Don't have an account?",
		go_to_register: "Sign up",
		have_account: "Already have an account?",
		go_to_login: "Sign in",
		divider_text: "or continue with"
	},
	register: {
		title: "Create account",
		subtitle: "Create a new account to get started.",
		submit: "Create account",
		name_placeholder: "Enter your full name",
		email_placeholder: "Enter your email",
		password_placeholder: "Enter your password"
	},
	toast: {
		logging_in: "Signing in...",
		registering: "Signing up...",
		register_success: "Sign up successfully! You can sign in now."
	}
} as const;

export default auth;

