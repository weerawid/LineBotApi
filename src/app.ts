import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import lineOrder from './api/routes/line_order.route.js';
import lineMenu from './api/routes/line_menu.route.js';
import lineEvent from './api/routes/line_event.route.js';
import lineUser from './api/routes/line_user.route.js';
import lineMessage from './api/routes/line_message.route.js';
import sysSlip from './api/routes/sys_slip.route.js';
import { contextMiddleWare } from './core/middleware/helper.js';
import { DBClientManager } from './core/dbclient/dbclient.js';

const app = express();

const manager = DBClientManager.getInstance();
manager.connect();

app.use(contextMiddleWare);
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use("/api/line-order", lineOrder);
app.use("/api/line-menu", lineMenu);
app.use("/api/line-event", lineEvent);
app.use("/api/line-user", lineUser);
app.use("/api/line-message", lineMessage);
app.use("/api/system-slip", sysSlip);

app.get('/', (req, res)=>{
  res.json('Line Bot API')
});

process.on('SIGTERM', async () => {
  await manager.disconnect();
  process.exit(0);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

export default app
