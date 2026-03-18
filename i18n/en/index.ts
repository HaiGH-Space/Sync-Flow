import auth from "./auth";
import common from "./common";
import dashboard from "./dashboard";
import error from "./error";
import validation from "./validation";

const en = {
  auth,
  common,
  dashboard,
  error,
  validation,
} as const;

export default en;

