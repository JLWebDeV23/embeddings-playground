import React from "react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { ModelData } from "../../utils/interfaces";
import ModelHeader from "../ModelHeader/ModelHeader";

type ResponseProps = {
  data: ModelData;
  handleOnAddModel: (model: string, subModel: string) => void;
  isLastElement: boolean;
  handleLockBtn: () => void;
  // handleAddResponseClick: (value:string) => void;
};

const Response: React.FC<ResponseProps> = ({
  data,
  handleOnAddModel,
  isLastElement,
  handleLockBtn,
}) => {
  return (
    <div className="flex flex-col h-full w-full transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between p-4 border-b-2 border-black">
        <h2 className="text-xl font-segoe">
          {data.model}: {data.subModel}
        </h2>
        <div className="flex items-center justify-end">
          <div className="p-4 pt-6 cursor-pointer">
            <ion-icon
              style={{ color: data.locked ? "#f46c89" : "" }}
              size="small"
              name={data.locked ? "lock-closed-outline" : "lock-open-outline"}
              onClick={handleLockBtn}
            ></ion-icon>
          </div>
          {isLastElement && (
            <div className="p-4">
              <ModelHeader
                btnName={<ion-icon name="add-outline"></ion-icon>}
                btnStyle="dropdown dropdown-left pt-4 bg-transparent border-none z-0 hover:bg-transparent hover:border-none "
                dropdownContentDirection="left"
                onSubModelChange={handleOnAddModel}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-8 overflow-auto">
        {data.messages?.map((message, index) =>
          message.role === "user" ? (
            <div
              key={index}
              className="bg-lightGray font-sans text-right w-min max-w-2/3 p-2 rounded-lg ml-auto overflow-wrap-break my-2"
            >
              {message.content}
            </div>
          ) : message.role === "assistant" ? (
            <>
              <div className="flex flex-col">
                <div key={index} className="w-full bg-green-200 rounded my-2">
                  <ion-icon name="rocket-outline" size="large"></ion-icon> :{" "}
                  {message.content}
                </div>
                <div className="ml-auto p">{message.score}</div>
              </div>
            </>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Response;
