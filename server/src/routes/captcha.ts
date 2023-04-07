import Router from 'express';

import captchaController from '../controllers/captchaController';


const router = Router();

router.post('/', captchaController.check);
router.get('/', captchaController.get);

export default router;