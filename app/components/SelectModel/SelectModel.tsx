import React, { useState, useEffect } from "react";

type SelectModelProps = {
    onModelChange: (model: string) => void;
};

const SelectModel: React.FC<SelectModelProps> = ({onModelChange}) => {
    const [model, setModel] = useState('');
    
    useEffect(() => {
        onModelChange(model);
    }, [onModelChange, model]);

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
          <a onClick={() => setModel("openai")}>OpenAI</a>
        </li>
        <li>
          <a onClick={() => setModel("mistral")}>Mistral</a>
        </li>
      </ul>
    </div>
  );
};

export default SelectModel;
