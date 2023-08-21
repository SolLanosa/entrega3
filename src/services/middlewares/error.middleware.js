import EErrors from "../errors/enums.js";

export const errorMiddleware = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR: 
    case EErrors.DATABASE_ERROR:
    case EErrors.ROUTING_ERROR:
      res.send({ status: "error", error: error.name, cause: error.cause });
    case EErrors.NOT_FOUND:
       res.status(404).send({ status: "error", error: error.name, cause: error.cause });
    default:
      res.send({ status: "error", mensaje: "error no manejado" });
  }
};