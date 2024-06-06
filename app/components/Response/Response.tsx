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
    // if item index isn't 0 then border-l-2 border-black
    // <div className="flex flex-col h-full w-full ">
    //   <div className="flex h-20 items-stretch">
    //     <h2 className="flex-grow h-full pt-6 pl-2 font-segoe text-xl border-r-2 border-black ">
    //       {data.model}: {data.subModel}
    //     </h2>
    //     <div className="ml-auto">
    //       <div className="flex-grow h-full p-4 font-sans text-2xl border-r-2 border-black inline-block cursor-pointer">
    //         <ion-icon
    //           name={data.locked ? "lock-closed-outline" : "lock-open-outline"}
    //           onClick={handleLockBtn}
    //         ></ion-icon>
    //       </div>
    //       {/* if item is not last in the list, remove the + btn */}
    //       {isLastElement && (
    //         <div className="flex-grow h-full p-4 font-sans text-2xl inline-block flex-shrink-0">
    //           <ModelHeader
    //             btnName="+"
    //             btnStyle="dropdown dropdown-left bg-transparent border-none z-0 hover:bg-transparent hover:border-none"
    //             dropdownContentDirection="left"
    //             onSubModelChange={handleOnAddModel}
    //           />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    //   <div
    //     className="border-t-2 border-black bg-dark"
    //     style={{ height: "100%" }}
    //   >
    //     <ScrollShadow>
    //       <div className="flex flex-col gap-4 h-full p-4">
    //         {data.messages?.map((message, index) =>
    //           message.role === "user" ? (
    //             <div
    //               key={index}
    //               className="bg-lightGray font-sans text-right w-min max-w-2/3 p-2 rounded-lg ml-auto overflow-wrap-break my-2"
    //             >
    //               {message.content}
    //             </div>
    //           ) : message.role === "assistant" ? (
    //             <div key={index} className="w-full bg-green-200 rounded my-2">
    //               {message.content}
    //             </div>
    //           ) : null
    //         )}
    //       </div>
    //     </ScrollShadow>
    //   </div>
    // </div>
    <div className="flex flex-col h-full w-full ">
      <div className="flex items-center justify-between p-4 border-b-2 border-black">
        <h2 className="text-xl font-segoe">
          {data.model}: {data.subModel}
        </h2>
        <div className="flex items-center">
          <div className="p-4 cursor-pointer">
            <ion-icon
              name={data.locked ? "lock-closed-outline" : "lock-open-outline"}
              onClick={handleLockBtn}
            ></ion-icon>
          </div>
          {isLastElement && (
            <div className="p-4">
              <ModelHeader
                btnName="+"
                btnStyle="dropdown dropdown-left bg-transparent border-none z-0 hover:bg-transparent hover:border-none"
                dropdownContentDirection="left"
                onSubModelChange={handleOnAddModel}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 overflow-auto">
        {data.messages?.map((message, index) =>
          message.role === "user" ? (
            <div
              key={index}
              className="bg-lightGray text-right w-full max-w-2/3 p-2 rounded-lg ml-auto my-2"
            >
              {message.content}
            </div>
          ) : message.role === "assistant" ? (
            <div key={index} className="w-full bg-green-200 rounded my-2">
              {message.content}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default Response;
