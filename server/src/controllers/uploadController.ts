import sharp, {OutputInfo} from 'sharp';
import path from 'path';
import * as util from 'util';

class uploadController {
    async upload(req: any, res: any) {
        if (req.files.file) {
            try {
                const file = req.files.file;
                const fileName = file?.name;
                const size = file?.data.length;
                const extension = path.extname(fileName);
                const md5 = file?.md5;
                const URL = '/uploads/' + md5 + extension;
                const allowedExtensionsDocument = /txt/;
                const allowedExtensionsImage = /png|jpeg|jpg|gif/;

                if (!allowedExtensionsDocument.test(extension) && !allowedExtensionsImage.test(extension)) res.status(400).send({error: 'Unsupported extension'});
                if (allowedExtensionsDocument.test(extension)) {
                    if (size > 100000) throw 'File must be less than 100KB';
                    await util.promisify(file.mv)('./public' + URL);
                    res.json(URL)
                }

                if (allowedExtensionsImage.test(extension)) {
                    sharp(file.data)
                        .resize(320, 240)
                        .toFile('public' + URL, (err: Error, info: OutputInfo) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        })
                    res.json(URL)
                }
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    message: error
                })
            }
        } else {
            res.status(200);
        }
    }
};

export default new uploadController();
