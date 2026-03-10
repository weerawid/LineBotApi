import express from 'express';
import * as controler from '../controller/line_message.controller'

const router = express.Router();

router.post('/create', controler.create);
router.put('/:id', controler.update);

export default router;