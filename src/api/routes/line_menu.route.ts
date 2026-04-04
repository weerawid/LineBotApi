import express from 'express';
import * as controler from '../controller/line_menu.controller.js'

const router = express.Router();

router.post('/create', controler.create);

export default router;