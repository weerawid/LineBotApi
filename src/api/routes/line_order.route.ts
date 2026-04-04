import express from 'express';
import * as controler from '../controller/line_order.controller.js'

const router = express.Router();

router.post('/create', controler.create);
router.post('/inquiry', controler.inquiry);

export default router;