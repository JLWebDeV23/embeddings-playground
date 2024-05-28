import React from "react";
import { ModelsData } from "@/app/page/ModelCompare/ModelCompare";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

type UserAssistantResultProps = { modelsData: ModelsData };

const UserAssistantResult: React.FC<UserAssistantResultProps> = ({
  modelsData,
}) => {
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
              <div key={index} className="flex justify-between mb-1">
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
                      <ScrollShadow>
                        {message.role}: {message.content}
                      </ScrollShadow>
                    </span>
                    <span
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      <ScrollShadow>
                        {secondModelMessage.role}: {secondModelMessage.content}
                      </ScrollShadow>
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className="mr-1"
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {message.role}: {message.content}
                    </span>
                    <span style={{ flex: "0 0 10%", maxWidth: "10%" }}>
                      Score: {modelsData.score[index]}
                    </span>
                    <span
                      style={{
                        flex: "0 0 45%",
                        maxHeight: "200px",
                        overflow: "auto",
                      }}
                    >
                      {secondModelMessage.role}: {secondModelMessage.content}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </>
      </div>
    </div>
  );
};

export default UserAssistantResult;
