import express from 'express';
import * as controler from '../controller/line_user.controller.js'

const router = express.Router();

router.post('/create', controler.create);
router.put('/update/:id', controler.update);

export default router;