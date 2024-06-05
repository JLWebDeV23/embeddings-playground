// import React, { useState } from "react";

// const ModelHeader = () => {
//   const [isHover1, setIsHover1] = useState(false);
//   const [isHover2, setIsHover2] = useState(false);

//   return (
//     <section className="flex justify-between w-full items-end">
//       <h2 className="font-normal text-lg">ModelName</h2>
//       <div className="dropdown dropdown-hover z-[1112]">
//         <div tabIndex={0} className="btn m-1">
//           Hover 1
//         </div>
//         <ul
//           tabIndex={0}
//           className="dropdown-content z-[1113] shadow menu bg-base-100 rounded-box w-52"
//         >
//           <li
//             onMouseEnter={() => {
//               setIsHover1(true);
//               setIsHover2(false);
//             }}
//           >
//             <div className="dropdown dropdown-right">
//               <div tabIndex={0} className="z-[1113] shadow">
//                 Hover 1
//               </div>
//               {isHover1 && (
//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu shadow bg-base-100 rounded-box w-52 translate-x-[-10px]"
//                 >
//                   <li>
//                     <a>Item 1.1</a>
//                   </li>
//                   <li>
//                     <a>Item 1.2</a>
//                   </li>
//                 </ul>
//               )}
//             </div>
//           </li>
//           <li
//             onMouseEnter={() => {
//               setIsHover2(true);
//               setIsHover1(false);
//             }}
//           >
//             <div className="dropdown dropdown-right">
//               <div tabIndex={0} className="z-[1113] shadow">
//                 Hover 2
//               </div>
//               {isHover2 && (
//                 <ul
//                   tabIndex={0}
//                   className="dropdown-content menu shadow bg-base-100 rounded-box w-52 translate-x-[-10px]"
//                 >
//                   <li>
//                     <a>Item 2.1</a>
//                   </li>
//                   <li>
//                     <a>Item 2.2</a>
//                   </li>
//                 </ul>
//               )}
//             </div>
//           </li>
//         </ul>
//       </div>
//     </section>
//   );
// };

// export default ModelHeader;

import React, { act, useEffect, useState } from "react";
import ModelData from "../../../public/assets/data/ModelData.json";

type ModelHeaderProps = {
  dropdownContentDirection: "left" | "right";
  onSubModelChange: (model: string, subModel: string) => void;
};

const ModelHeader: React.FC<ModelHeaderProps> = ({
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
    <section className="flex justify-between w-full items-end">
      <h2 className="font-normal text-lg">{activeSubModel}</h2>
      <div className="dropdown dropdown-hover drop-shadow-2xl z-30">
        <div tabIndex={0} className="btn m-1">
          Models
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-10 shadow menu bg-base-100 rounded-box w-52"
        >
          {ModelData.map((model, index) => {
            // is there a different to map directly rather than returning  here
            return (
              <div
                key={index}
                className={`dropdown menu dropdown-${dropdownContentDirection} hover z-10 drop-shadow-2xl`}
              >
                <div
                  tabIndex={0}
                  className="m-1 cursor-pointer z-10 drop-shadow-2xl"
                  onMouseEnter={() => setActiveModel(index)}
                  onMouseLeave={() => setActiveModel(null)}
                >
                  {model.model}
                </div>
                {activeModel === index && (
                  <ul
                    tabIndex={0}
                    className={`dropdown-content z-10 drop-shadow-2xl menu bg-base-100 rounded-box w-52 ${
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
