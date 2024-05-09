import React, { useState, useEffect } from "react";

type SelectModelProps = {
    onModelChange: (model: string) => void;
};

const SelectModel: React.FC<SelectModelProps> = ({onModelChange}) => {
  return (
    <div className="dropdown dropdown-hover ">
      <div tabIndex={0} role="button" className="btn mt-2 bg-cyan-950">
        Model
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a onClick={() => onModelChange("openai")}>OpenAI</a>
        </li>
        <li>
          <a onClick={() => onModelChange("mistral")}>Mistral</a>
        </li>
      </ul>
    </div>
  );
};

export default SelectModel;
