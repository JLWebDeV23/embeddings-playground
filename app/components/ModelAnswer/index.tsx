import { ModelData } from "@/app/utils/interfaces";
import IonIcon from '@reacticons/ionicons';
import { useState } from "react";


function ChatBubble({ text, role }: { text: string, role: string }) {
    return (
        <>
            {/* <p className={` text-xs px-2 py-1 ${role === "user" ? "self-end" : ""}`}>{role}</p> */}
            <div className={`flex justify-start p-2 rounded-md ${role === "user" ? "self-end bg-surface/50" : ""}`}>
                <p className="text-sm text-gray-500">{text}</p>
            </div>
        </>
    );
}


function ModelAnswerHeader({ name, isLocked, setIsLocked }: { name: string, isLocked: boolean, setIsLocked: (isLocked: boolean) => void }) {
    return (
        <div className="flex flex-row justify-between w-full p-2 border-b-2 border-b-surface">
            <h2 className="font-semibold">{name}</h2>
            <div className="flex gap-2 h-full justify-center">
                <button className="text-sm text-gray-500 p-1 rounded-md aspect-square"><IonIcon name="trash-outline" /></button>
                <button className={`text-sm text-gray-500 p-1 rounded-md aspect-square ${isLocked ? "bg-red-900" : ""}`} onClick={() => setIsLocked(!isLocked)}>{
                    isLocked ? <IonIcon name="lock-closed-outline" /> : <IonIcon name="lock-open-outline" />
                }</button>
            </div>
        </div>
    );
}



export default function ModelAnswer({ answer, isLoading }: { answer: ModelData, isLoading: boolean }) {
    const [isLocked, setIsLocked] = useState<boolean>(false);
    return (
        <div className={`flex flex-col rounded-md min-w-80 w-full ${isLoading ? 'skeleton' : 'bg-card'}`}>
            <ModelAnswerHeader name={answer.model} isLocked={isLocked} setIsLocked={setIsLocked} />
            <div className="flex flex-col p-2">
                {
                    answer.messages.map((message, index) => (
                        <ChatBubble key={index} role={message.role} text={message.content} />
                    ))
                }
            </div>
        </div>
    );
}