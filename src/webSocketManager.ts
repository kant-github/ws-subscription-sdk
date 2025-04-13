import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketMessage, WebSocketType } from './WebSocketTypes';



export default class WebSocketServerClass {

    private wss: WebSocketServer;
    private projectSubscribers: Map<String, Set<WebSocket>>;
    private socketToProject: Map<WebSocket, String | null>;

    constructor(Server: Server) {
        this.wss = new WebSocketServer({
            server: Server
        });

        // Track which project each socket is subscribed to
        this.socketToProject = new Map<WebSocket, String | null>();

        // Track which sockets are subscribed to each project
        this.projectSubscribers = new Map<String, Set<WebSocket>>();

        this.init();
    }

    private init() {
        this.wss.on('connection', (socket) => {
            console.log("connection started");
            this.initializeTracking(socket);

            socket.on('message', (data: String) => {
                this.handleIncomingMessage(data, socket);
                console.log("message sent: ", JSON.parse(data as string));
            });

            socket.on('close', () => {
                this.handleSocketClose(socket);
            });
        });
    }

    private initializeTracking(socket: WebSocket) {
        // if (this.socketToProject.has(socket)) return;

        // authorize the socket with its JWT here if needed

        // Initially add socket to null project (dashboard)
        // if(!this.projectSubscribers.has(null)) {
        //     this.projectSubscribers.set(null, new Set<WebSocket>());
        // }
        // this.projectSubscribers.get(null)?.add(socket);
        console.log("setting socket to project with socket");
        this.socketToProject.set(socket, null);
        const projectID = this.socketToProject.get(socket);
        console.log("projectId is: ", projectID);
    }

    private handleIncomingMessage(payload: String, socket: WebSocket) {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(payload as string);

            switch (parsedMessage.type) {
                case WebSocketType.subscribe_channel:
                    return this.handleChannelSubscription(socket, parsedMessage);

                case WebSocketType.unsubscribe_channel:
                    return this.handleChannelUnsubscription(socket, parsedMessage);

                case WebSocketType.chat:
                    return this.handleChannelChats(parsedMessage);

                default:
                // Handle unknown message type if needed
            }
        } catch (error) {
            console.error('Failed to parse incoming message:', error);
        }
    }

    private handleChannelSubscription(socket: WebSocket, subscriptionMessage: WebSocketMessage) {

        const projectID = this.socketToProject.get(socket);


        // If socket is already subscribed to this project, do nothing
        if (projectID === subscriptionMessage.projectId) return;

        if (subscriptionMessage.projectId !== null) {

            if (!this.projectSubscribers.has(subscriptionMessage.projectId)) {
                this.projectSubscribers.set(subscriptionMessage.projectId, new Set<WebSocket>());
            }

            this.projectSubscribers.get(subscriptionMessage.projectId)?.add(socket);
            // project <set websocket>

            console.log("list of all socket to this project is is : ", this.projectSubscribers.get(subscriptionMessage.projectId));

            this.socketToProject.set(socket, subscriptionMessage.projectId)
            console.log("socket to project is : ", this.socketToProject);
        }
    }

    private handleChannelUnsubscription(socket: WebSocket, unsubscriptionMessage: WebSocketMessage) {
        // const currentProjectId = this.socketToProject.get(socket);

        // // If socket is not subscribed to this project, do nothing
        // if (currentProjectId !== unsubscriptionMessage.projectId) return;

        // // Remove socket from the project subscription
        // const projectSockets = this.projectSubscribers.get(unsubscriptionMessage.projectId);
        // if (projectSockets) {
        //     projectSockets.delete(socket);

        //     // Clean up empty sets
        //     if (projectSockets.size === 0) {
        //         this.projectSubscribers.delete(unsubscriptionMessage.projectId);
        //     }
        // }

        // // Add socket back to null project (dashboard)
        // if (!this.projectSubscribers.has(null)) {
        //     this.projectSubscribers.set(null, new Set<WebSocket>());
        // }
        // this.projectSubscribers.get(null)?.add(socket);

        // // Update the mapping
        // this.socketToProject.set(socket, null);
    }

    private handleChannelChats(chatMessage: WebSocketMessage) {
        if (!this.projectSubscribers.has(chatMessage.projectId)) return;
        if (chatMessage.type !== "chat") return;

        const message = JSON.stringify({
            type: "chat",
            payload: {
                message: chatMessage.payload.message,
                timestamp: chatMessage.payload.timestamp || Date.now(), // Fixed the typo in timestamp
                senderId: chatMessage.payload.senderId
            }
        });

        const sockets = this.projectSubscribers.get(chatMessage.projectId);
        if (!sockets) return;

        sockets.forEach((member) => {
            // Only send if socket is still open
            if (member.readyState === WebSocket.OPEN) {
                member.send(message);
            }
        });

        // Add Redis and database code in the future
    }

    private handleSocketClose(socket: WebSocket) {
        // const projectId = this.socketToProject.get(socket);

        // if (projectId !== undefined) {
        //     const projectSockets = this.projectSubscribers.get(projectId);
        //     if (projectSockets) {
        //         projectSockets.delete(socket);

        //         // Clean up empty sets
        //         if (projectSockets.size === 0) {
        //             this.projectSubscribers.delete(projectId);
        //         }
        //     }
        // }

        // // Remove from our tracking map
        // this.socketToProject.delete(socket);
    }
}

/*


/dashboard
socketToProject -> socket1 -> null

/project
check STP.has(socket)
check projectSubscribers.has(project1)
projectSubscribers.set(project1, socket)


*/