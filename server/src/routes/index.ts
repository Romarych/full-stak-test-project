import Router from 'express';

import upload from './upload';
import captcha from './captcha';

export const router = Router();

router.use('/captcha', captcha);
router.use('/upload', upload);
