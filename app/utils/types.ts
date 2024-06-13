export interface Answer {
    model: string;
    subModel: string;
    messages: Message[];
    locked: boolean;
}

export interface Message {
    role: string;
    content: string;
}
