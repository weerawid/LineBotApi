import type { Request, Response, NextFunction } from 'express';

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const start = Date.now();
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    let responseBody: any;

    const oldSend = res.send.bind(res);

    res.send = ((body?: any) => {
      responseBody = body;
      return oldSend(body);
    }) as Response['send'];

    res.on('finish', () => {
      const log = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        requestBody: req.body,
        responseBody: tryParseJSON(responseBody),
        responseTime: `${Date.now() - start}ms`,
      };

      console.log(JSON.stringify(log));
    });

    next();
  } catch (err) {
    next(err); // ส่งต่อไป error middleware
  }
};

function tryParseJSON(data: any) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}