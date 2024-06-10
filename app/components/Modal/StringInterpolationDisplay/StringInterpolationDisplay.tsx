
import { StringInterpolation } from "@/app/utils/interfaces";
import React from "react";

interface StringInterpolationDisplayProps {
  interpolation: StringInterpolation[];
}

const StringInterpolationDisplay: React.FC<StringInterpolationDisplayProps> = ({
  interpolation,
}) => {
  return (
    <div className="flex flex-col p-2">
      {interpolation.map((item, index) => (
        <div key={index} className="flex gap-8 w-full p-2">
          <span className="w-full">{item.field}</span>
          <span className="w-full">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StringInterpolationDisplay;
