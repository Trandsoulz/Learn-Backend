import createError from "http-errors";

function sendDevError(err, res) {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
  });
}

function sendProdError(res) {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
  });
}

function jsonWebTokenInvalidError() {
  return createError(401, "Invalid token. Please log in again");
}

function jsonWebTokenExpiredError() {
  return createError(401, "Expired token. Please log in again");
}

export default function globalErrorHandler(err, req, res, next) {
  let error = { ...err };

  err.statusCode = err.statusCode ?? 500;
  err.status = `${err.status}`.startsWith(4) ? "fail" : "error";
  err.message = err.message;

  console.log("Unknown error : 🥵🥵", error);

  // JsonWebTokenError
  if (error.name === "JsonWebTokenError") err = jsonWebTokenInvalidError();

  if (error.name === "TokenExpiredError") err = jsonWebTokenExpiredError();

  if (process.env.NODE_ENV === "development") {
    // console.log(err.stack);

    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }

  next();
}
