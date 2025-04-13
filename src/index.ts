import express from 'express'
import { createServer } from 'http'
import WebSocketServerClass from './webSocketManager';


const app = express();
app.use(express.json())

const server = createServer(app);
new WebSocketServerClass(server);


server.listen(8080, () => {
    console.log("app is listening at port 8080")
});