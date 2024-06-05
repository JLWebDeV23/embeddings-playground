import React from "react";
import {ScrollShadow} from "@nextui-org/scroll-shadow";;

type ResponseProps = {
    key: number;
    handleAddResponseClick: () => void;
}

const Response: React.FC<ResponseProps> = ({ key, handleAddResponseClick}) => {
  return (
    // if item index isn't 0 then border-l-2 border-black
    <div className="flex flex-col h-full w-full ">
      <div className="flex h-20 items-stretch">
        <h2 className="flex-grow h-full pt-6 pl-2 font-sans text-2xl border-r-2 border-black ">
          Model name
        </h2>
        <div className="ml-auto ">
          <button className="flex-grow h-full p-4 font-sans text-2xl border-r-2 border-black">
            Lock
          </button>
          {/* if item is not last in the list, remove the + btn */}
          <button className="flex-grow h-full p-4 font-sans text-2xl" onClick={handleAddResponseClick}>+</button>
        </div>
      </div>
      <div className="border-t-2 border-black" style={{ height: "100%" }}>
        <ScrollShadow>
            
        </ScrollShadow>
        {/* make this a scroll box allow for x and y, loop through the object if  */}
      </div>
    </div>
  );
};

export default Response;
