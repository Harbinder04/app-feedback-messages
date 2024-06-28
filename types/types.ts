

export interface Message{
    content: string;
    createdAt: Date
}

export interface ApiResponse{
    success: boolean;
    message: string;
    isAccesptingMessage?: boolean;
    messages? : Array<Message>
}