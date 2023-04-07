"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("graphql-http/lib/use/express");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_session_1 = __importDefault(require("express-session"));
const express_ws_1 = __importDefault(require("express-ws"));
const schema_1 = require("./schema");
const db_1 = require("./db");
const resolvers_1 = __importDefault(require("./resolvers"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const port = process.env.PORT || 5000;
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.configuration();
    }
    configuration() {
        this.app.set('port', port);
        this.app.use((0, cors_1.default)({
            origin: process.env.ORIGIN_URL,
            credentials: true,
        }));
        this.app.use(express_1.default.json());
        this.app.use((0, express_fileupload_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static('./public'));
        this.app.use((0, express_session_1.default)({
            resave: false,
            saveUninitialized: false,
            secret: 'secret',
        }));
        this.app.use('/graphql', (0, express_2.createHandler)({
            schema: schema_1.schema,
            rootValue: resolvers_1.default,
        }));
        this.app.use('/', routes_1.router);
        // WebSocket
        const WSServer = (0, express_ws_1.default)(this.app);
        const { app, getWss } = WSServer;
        const aWss = getWss();
        app.ws('/', (ws) => {
            ws.on('message', (msg) => {
                aWss.clients.forEach((client) => {
                    client.send(msg);
                });
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.authenticate();
                yield db_1.db.sync();
                this.app.listen(port, () => {
                    console.log(`Start on port ${port}`);
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = Server;
const server = new Server();
server.start();
