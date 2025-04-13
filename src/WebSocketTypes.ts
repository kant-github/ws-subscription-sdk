export type WebSocketMessage = 
    | {
        type: WebSocketType.subscribe_channel | WebSocketType.unsubscribe_channel,
        projectId: String
    }
    | {
        type: WebSocketType.chat,
        projectId: String,
        payload: {
            message: String,
            timestamp: Date,
            senderId: String
        }
    }
    | {
        type: WebSocketType.sketch,
        projectId: String,
        payload: {
            shape: Shapes
        }
    }


export enum WebSocketType {
    subscribe_channel = "subscribe_channel",
    unsubscribe_channel = "unsubscribe_channel",
    chat = "chat",
    sketch = "sketch",
    event = "event"
}

export enum Shapes {
    rect = "rect",
    circle = "circle",
    line = "line",
    pencil = "pencil"
}