// StringInterpolationList.js
import { StringInterpolations } from "@/app/utils/interfaces";
import React from "react";

type StringInterpolationListProps = {
  list: StringInterpolations[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  btnStyle?: string;
};

const StringInterpolationList: React.FC<StringInterpolationListProps> = ({
  list,
  selectedIndex,
  onSelect,
  btnStyle,
}) => {
  return (
    <div className={`flex `}>
      {list &&
        list.map((item, index) => (
          <div
            className={`flex border border-slate-600 w-auto cursor-pointer ${
              index === selectedIndex ? "bg-green z-50" : ""
            }`}
            key={index}
            onClick={() => onSelect(index)}
          >
            <h3 className="font-bold w-full text-lg">{index + 1}</h3>
          </div>
        ))}
     
    </div>
  );
};

export default StringInterpolationList;
