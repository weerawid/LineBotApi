import express from 'express';
import bodyParser from 'body-parser';

import lineEvent from './api/routes/line_event.route';
import { contextMiddleWare } from './core/middleware/middlewareHelper';
import { DBClientManager } from './core/dbclient/dbclient';

const app = express();

const manager = DBClientManager.getInstance();

app.use(contextMiddleWare);
app.use(bodyParser.json());

app.use("/api/line-event", lineEvent);
app.use("/api/line-user", lineEvent);

app.get('/', (req, res)=>{
  res.json('Line Bot API')
});

process.on('SIGTERM', async () => {
  await manager.disconnect();
  process.exit(0);
});

export default app
