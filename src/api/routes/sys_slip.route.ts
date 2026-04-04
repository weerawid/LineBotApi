import express from 'express';
import * as slip from '../controller/sys_slip.controller.js'

const router = express.Router();

router.get('/', slip.getSlipApi);
router.post('/trick/:api', slip.trick);

export default router;