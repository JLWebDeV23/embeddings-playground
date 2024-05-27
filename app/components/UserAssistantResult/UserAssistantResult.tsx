import React from "react";

const UserAssistantResult = () => {
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

    </div>
  );
};

export default UserAssistantResult;
