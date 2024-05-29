import React from "react";
import { ModelsData } from "@/app/page/ModelCompare/ModelCompare";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

type UserAssistantResultProps = { modelsData: ModelsData };

const UserAssistantResult: React.FC<UserAssistantResultProps> = ({
  modelsData,
}) => {
  let scoreIndex: number = 0;
  return (
    <div className="m-1 flex bg-transparent flex-col">
      <div className="flex w-full mb-1">
        <button className="btn flex-grow text-white bg-indigo-500 shadow-lg rounded-none rounded-tl-lg hover:bg-indigo-300">
          Lock
        </button>
        <div className="w-20 bg-transparent bg-slate-100"></div>
        <button className="btn flex-grow rounded-tr-lg rounded-none text-white bg-indigo-500 hover:bg-indigo-300 ">
          Lock
        </button>
      </div>
      <div style={{ maxHeight: "500px", overflow: "auto" }}>
        <>
          {modelsData?.firstModel?.messages?.map((message, index) => {
            const secondModelMessage =
              modelsData?.secondModel?.messages?.[index];

            return (
              <div key={index} className="flex justify-between mb-4">
                {message.role === "user" ? (
                  <>
                    <span
                      className="mr-1"
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <div className="font-bold">
                        {message.role.toUpperCase()}:
                      </div>
                      {message.content}
                    </span>
                    <span
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <div className="font-bold">
                        {secondModelMessage.role.toUpperCase()}:
                      </div>
                      {secondModelMessage.content}
                    </span>
                  </>
                ) : message.role === 'assistant' ? (
                  <>
                    <span
                      className="mr-1"
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <div className="font-bold">
                        {message.role.toUpperCase()}:
                      </div>
                      {message.content}
                    </span>
                    <div className="relative group overflow-hidden hover:overflow-visible overflow-ellipsis w-1/12 max-w-1/12 cursor-pointer">
                      <div className="flex-none overflow-hidden overflow-ellipsis">
                        <div className="font-bold">Score:</div>
                        {modelsData.score[scoreIndex]}
                      </div>
                      <div className="absolute group-hover:overflow-visible left-0 text-sm bg-indigo-500 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-100 ease-in-out">
                        {modelsData.score[scoreIndex++]}
                      </div>
                    </div>

                    <span
                      className=""
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <div className="font-bold">
                        {secondModelMessage.role.toUpperCase()}:
                      </div>
                      {secondModelMessage.content}
                    </span>
                  </>
                ) : null}
              </div>
            );
          })}
        </>
      </div>
    </div>
  );
};

export default UserAssistantResult;
