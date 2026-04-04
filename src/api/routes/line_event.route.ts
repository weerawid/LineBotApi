import express from 'express';
import * as controler from '../controller/line_event.controller.js'

const router = express.Router();

router.post('/', controler.inquiry);
router.post('/create', controler.create);

export default router;