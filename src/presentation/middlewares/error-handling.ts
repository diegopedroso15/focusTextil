import { NextFunction, Request, Response } from 'express'

export const errorHandlingMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.code || 500).json({ message: err.message, code: err.code })
}
