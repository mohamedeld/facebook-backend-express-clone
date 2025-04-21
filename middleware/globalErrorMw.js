const statusCodes = require("../config/statusCodeCustom");


const sendErrorForDev = (err, res) => {
  return res.status(err?.statusCode || statusCodes.INTERNAL_SERVER_ERROR.code).json({
    status: err?.status,
    error: err,
    message: err?.message,
    stack: err?.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err?.statusCode || statusCodes.INTERNAL_SERVER_ERROR.code).json({
    status: err?.status,
    message: err?.message,
  });
};

const globalError = (
  err,
  req,
  res,
  next
) => {
  err.statusCode = err?.statusCode || statusCodes.INTERNAL_SERVER_ERROR.code;
  err.status = err?.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  }else{
    sendErrorForProd(err, res);
  }
};



module.exports = globalError;