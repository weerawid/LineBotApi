import express from 'express';
import * as controler from '../controller/line_message.controller'

const router = express.Router();

router.get('/:id', controler.get);
router.post('/create', controler.create);
router.put('/update/:id', controler.update);


export default router;