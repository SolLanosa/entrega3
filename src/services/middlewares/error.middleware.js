import EErrors from "../errors/enums.js";

export const errorMiddleware = (error, req, res, next) => {
  req.logger?.error({route: req.path, body: req.body, params: req.params, error: error.stack})
  switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR: 
    case EErrors.DATABASE_ERROR:
     res.status(500).send({ status: "error", error: error.name, cause: error.cause });
     break;
    case EErrors.GENERIC_ERROR:
    case EErrors.RECOVER_TOKEN_EXPIRED:
    case EErrors.ROUTING_ERROR:
      res.status(400).send({ status: "error", error: error.name, cause: error.cause });
      break;
    case EErrors.NOT_FOUND:
       res.status(404).send({ status: "error", error: error.name, cause: error.cause });
       break;
    default:
      res.status(500).send({ status: "error", mensaje: "error no manejado" });
      break;
  }
};