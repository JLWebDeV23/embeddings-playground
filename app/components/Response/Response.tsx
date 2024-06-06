import React from "react";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { ModelData } from "../../utils/interfaces";
import ModelHeader from "../ModelHeader/ModelHeader";

type ResponseProps = {
  modelData: ModelData;
  handleOnAddModel: (model: string, subModel: string) => void;
  // handleAddResponseClick: (value:string) => void;
};

const Response: React.FC<ResponseProps> = ({ modelData, handleOnAddModel }) => {
  
  return (
    // if item index isn't 0 then border-l-2 border-black
    <div className="flex flex-col h-full w-full ">
      <div className="flex h-20 items-stretch">
        <h2 className="flex-grow h-full pt-6 pl-2 font-segoe text-xl border-r-2 border-black ">
          {modelData.model}: {modelData.subModel}
        </h2>
        <div className="ml-auto">
          <div className="flex-grow h-full p-4 font-sans text-2xl border-r-2 border-black inline-block">
            Lock
          </div>
          {/* if item is not last in the list, remove the + btn */}
          <div className="flex-grow h-full p-4 font-sans text-2xl inline-block">
            <ModelHeader
              btnName="+"
              btnStyle="dropdown dropdown-left bg-transparent border-none z-0 hover:bg-transparent hover:border-none"
              dropdownContentDirection="left"
              onSubModelChange={handleOnAddModel}
            />
          </div>
        </div>
      </div>
      <div className="border-t-2 border-black" style={{ height: "100%" }}>
        <ScrollShadow>
          <div className="flex flex-col gap-4 h-full p-4">
            {modelData.messages?.map((message, index) =>
              message.role === "user" ? (
                <div
                  key={index}
                  className=" bg-lightGray font-sans text-right w-min max-w-2/3 p-2 rounded-lg ml-auto overflow-wrap-break"
                >
                  {message.content}
                </div>
              ) : message.role === "assistant" ? (
                <div key={index} className="w-full bg-green-200 rounded">
                  {message.content}
                </div>
              ) : null
            )}
          </div>
        </ScrollShadow>
        {/* make this a scroll box allow for x and y, loop through the object if  */}
      </div>
    </div>
  );
};

export default Response;
