import React from "react";
import InputBox from "@/app/components/InputBox/InputBox";

const Card = () => {
  return (
    <div className="card bg-indigo-600 w-auto glass mt-2 mb-2">
      
      <div className="card-body">
        <InputBox />
        <InputBox />
      </div>
    </div>
  );
};

export default Card;
