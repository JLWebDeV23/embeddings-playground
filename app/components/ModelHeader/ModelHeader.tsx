import React, { act, useEffect, useState } from "react";
import ModelData from "../../../public/assets/data/ModelData.json";

type ModelHeaderProps = {
  btnName?: any;
  btnStyle?: string;
  dropdownContentDirection: "left" | "right";
  onSubModelChange: (model: string, subModel: string) => void;
};

const ModelHeader: React.FC<ModelHeaderProps> = ({
  btnName,
  btnStyle,
  dropdownContentDirection,
  onSubModelChange,
}) => {
  const [activeModel, setActiveModel] = useState<null | number>(null);
  const [activeSubModel, setActiveSubModel] = useState<null | string>("");
  const [model, setModel] = useState<string>("");

  useEffect(() => {
    if (activeSubModel) {
      onSubModelChange(model, activeSubModel);
    }
  }, [activeSubModel]);

  return (
    <section className="flex justify-between w-full items-end z-50">
      {/* <h2 className="font-normal text-lg">{activeSubModel}</h2> */}
      <div className="dropdown dropdown-hover drop-shadow-2xl ">
        <div tabIndex={0} className={`btn ${btnStyle}`}>
          {btnName ? btnName : "Models"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-50 shadow menu bg-base-100 rounded-box w-52"
        >
          {ModelData.map((model, index) => {
            // is there a different to map directly rather than returning  here
            return (
              <div
                key={index}
                className={`dropdown menu dropdown-${dropdownContentDirection} hover z-50 drop-shadow-2xl`}
              >
                <div
                  tabIndex={0}
                  className="m-1 cursor-pointer z-50 drop-shadow-2xl"
                  onMouseEnter={() => setActiveModel(index)}
                  onMouseLeave={() => setActiveModel(null)}
                >
                  {model.model}
                </div>
                {activeModel === index && (
                  <ul
                    tabIndex={0}
                    className={`dropdown-content z-50 drop-shadow-2xl menu bg-base-100 rounded-box w-52 ${
                      dropdownContentDirection === "left"
                        ? "translate-x-[13px]"
                        : "translate-x-[-15px]"
                    }`}
                    onMouseEnter={() => setActiveModel(index)}
                    onMouseLeave={() => setActiveModel(null)}
                  >
                    {model.submodel.map((submodel, subIndex) => (
                      // how to console log submodel here and set to submodel
                      <li
                        key={subIndex}
                        onClick={() => {
                          setActiveSubModel(submodel.model);
                          setModel(model.model);
                        }}
                      >
                        <a>{submodel.model}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ModelHeader;
