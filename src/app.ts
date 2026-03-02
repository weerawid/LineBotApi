import express from 'express';
import bodyParser from 'body-parser';

import lineEvent from './api/routes/line_event.route';
import { contextMiddleWare } from './core/middleware/middlewareHelper';
import { initializeContext } from './core/context/app_context';


const app = express();

app.use(contextMiddleWare);
app.use(bodyParser.json());

app.use("/api/line-event", lineEvent);

app.get('/', (req, res)=>{
  res.json('Line Bot API')
});

export default app
