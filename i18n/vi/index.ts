import auth from "./auth";
import error from "./error";
import validation from "./validation";

const vi = {
  auth,
  error,
  validation,
} as const;

export default vi;

