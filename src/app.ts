import express from 'express';
import bodyParser from 'body-parser';

import lineEvent from './api/routes/line_event.route.ts';
import { contextMiddleWare } from './core/middleware/middlewareHelper.ts';
import { initializeContext } from './core/context/app_context.ts';


const app = express();

await initializeContext()

app.use(contextMiddleWare);
app.use(bodyParser.json());

app.use("/api/line-event", lineEvent);

app.get('/', (req, res)=>{
  res.json('Line Bot API')
});

export default app
