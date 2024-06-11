import CustomAPIError from "./custom-api";
import UnauthenticatedError from "./unauthenticated";
import NotFoundError from "./not-found";
import BadRequestError from "./bad-request";
import UnauthorizedError from "./unauthorized";

const errors = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};

export default errors;
