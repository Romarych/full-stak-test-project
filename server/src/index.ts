import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {createHandler} from 'graphql-http/lib/use/express';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import expressWs from 'express-ws';

import {schema} from './schema';
import {db} from './db';
import resolvers from './resolvers';
import {router} from './routes';
import {PostType} from './types';

dotenv.config();
const port = process.env.PORT || 5000;

export default class Server {
    app: express.Application;

    constructor() {
        this.app = express();
        this.configuration();
    }

    public configuration() {
        this.app.set('port', port);
        this.app.use(cors({
            origin: process.env.ORIGIN_URL,
            credentials: true,
        }));
        this.app.use(express.json());
        this.app.use(fileUpload());
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(express.static('./public'));
        this.app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'secret',
        }));
        this.app.use('/graphql', createHandler({
            schema: schema,
            rootValue: resolvers,
        }));
        this.app.use('/', router);

        // WebSocket
        const WSServer = expressWs(this.app);
        const {app, getWss} = WSServer
        const aWss = getWss();
        app.ws('/', (ws) => {
            console.log('Success');

            ws.send('Ты успешно подключен!');
            ws.on('message', (msg) => {
                console.log(msg)
                aWss.clients.forEach((client) => {
                    client.send(msg)
                })
            })
        });

    }

    public async start() {
        try {
            await db.authenticate();
            await db.sync();
            this.app.listen(port, () => {
                console.log(`Start on port ${port}`);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

const server = new Server();
server.start();
// const app = express()
//
// const WSServer = require('express-ws')(app);
//
// app.use('/', (ws: any, req: any) => {
//     console.log('Success');
//
//     ws.send('Ты успешно подключен!');
//     ws.on('message', (msg: any) => {
//         console.log(msg)
//     })
// });
//
// app.listen(7000, () => console.log(1111111111111))