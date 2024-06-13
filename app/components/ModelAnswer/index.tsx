import { Answer } from "@/app/utils/types";

function ChatBubble({ text, role }: { text: string, role: string }) {
    return (
        <>
            {/* <p className={` text-xs px-2 py-1 ${role === "User" ? "self-end" : ""}`}>{role}</p> */}
            <div className={`flex justify-start p-2 rounded-md ${role === "User" ? "self-end bg-surface/50" : ""}`}>
                <p className="text-sm text-gray-500">{text}</p>
            </div>
        </>
    );
}


function ModelAnswerHeader({ name }: { name: string }) {
    return (
        <div className="flex flex-row justify-between w-full p-2 border-b-2 border-b-surface">
            <h2 className="font-semibold">{name}</h2>
            <div className="flex gap-2">
                <button className="text-sm text-gray-500">Delete</button>
                <button className="text-sm text-gray-500">Lock</button>
            </div>
        </div>
    );
}



export default function ModelAnswer({ answer }: { answer: Answer }) {
    return (
        <div className="flex flex-col bg-card rounded-md min-w-80 w-full ">
            <ModelAnswerHeader name={answer.model} />
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