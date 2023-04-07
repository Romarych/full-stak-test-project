import svgCaptcha from 'svg-captcha';

class captchaController {
    async check(req: any, res: any) {
        if (req.session.captcha === req.body.captcha) {
            res.status(200).send({message: 'Success!'});
        } else {
            res.status(400).send({error: 'Invalid captcha'});
        }
    }

    async get(req: any, res: any) {
        const captcha = svgCaptcha.create();
        req.session.captcha = captcha.text;
        req.session.save();
        res.type('svg');
        res.status(200).send(captcha.data);
    }
}

export default new captchaController();