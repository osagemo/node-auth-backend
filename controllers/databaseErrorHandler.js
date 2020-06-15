const {
  ValidationError,
  NotFoundError,
  DBError,
  ConstraintViolationError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} = require("objection");

const AppError = require("../utils/appError");

module.exports = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    if (
      error.type === "RelationExpression" ||
      error.type === "UnallowedRelation"
    ) {
      next(new AppError("Requested relation is invalid"));
    }
    next(new AppError(error.message, 400));
  } else if (error instanceof NotFoundError) {
    next(new AppError("Requested resource not found", 404));
  } else if (error instanceof UniqueViolationError) {
    // This parses the entered value that failed the unique constraint
    // Used because all other references in the error reveals database structure
    const value = error.nativeError.detail.match(/=\((\w+)/)[1];

    next(new AppError(`${value} is already in use`, 422));
  } else if (error instanceof ForeignKeyViolationError) {
    next(new AppError("Invalid location for input data", 400));
  } else if (error instanceof DataError) {
    next(new AppError("Invalid data in request", 400));
  } else {
    next(error);
  }
};
