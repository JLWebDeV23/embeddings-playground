import React, { useState, useEffect } from "react";
import {
  StringInterpolation,
  StringInterpolations,
} from "@/app/utils/interfaces";

interface StringInterpolationDisplayProps {
  selectedIndex: number;
  interpolation: StringInterpolation[];
  stringInterpolations: StringInterpolations[];
  setStringInterpolations: (value: StringInterpolations[]) => void;
}

const StringInterpolationDisplay: React.FC<StringInterpolationDisplayProps> = ({
  selectedIndex,
  interpolation,
  stringInterpolations,
  setStringInterpolations,
}) => {
  const [fieldValues, setFieldValues] = useState<string[]>([]);

  useEffect(() => {
    setFieldValues(interpolation.map((item) => item.value || ""));
  }, [interpolation]);

  const handleInputChange = (value: string, index: number) => {
    const updatedValues = [...fieldValues];
    updatedValues[index] = value;
    setFieldValues(updatedValues);
  };

  const handleSaveClick = (index: number) => {
    const updatedInterpolation = interpolation.map((item, itemIndex) => {
      if (itemIndex === index) {
        return { ...item, value: fieldValues[itemIndex] };
      }
      return item;
    });

    const updatedStringInterpolations = stringInterpolations.map(
      (item, itemIndex) => {
        if (itemIndex === selectedIndex) {
          return { ...item, list: updatedInterpolation };
        }
        return item;
      }
    );

    setStringInterpolations(updatedStringInterpolations);
  };

  const handleOnDeleteBtn = (index: number) => {
    const updatedInterpolations = stringInterpolations.map(
      (interpolation) => {
        const updatedList = interpolation.list.filter(
          (_, i) => i !== index
        );
        return { list: updatedList };
      }
    );
    setStringInterpolations(updatedInterpolations);
    const updatedFieldValues = fieldValues.filter(
      (_, i) => i !== index
    );
    setFieldValues(updatedFieldValues);
  }

  return (
    <div className="flex flex-col p-2">
      {interpolation.length ? (
        interpolation.map((item, index) => (
          <div
            key={index}
            className="flex gap-8 w-full p-2 justify-center items-center"
          >
            <span className="w-full text-slate-400">{item.field}</span>
            <input
              type="text"
              placeholder={fieldValues[index] || "Enter Field"}
              className="input w-full border-slate-600 text-slate-400 max-w-xs mr-4"
              value={fieldValues[index] || ""}
              onChange={(e) => handleInputChange(e.target.value, index)}
            />
            <ion-icon
              name="trash-outline"
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={() => {handleOnDeleteBtn(index)
              }}
            ></ion-icon>
            <ion-icon
              name="bookmark"
              style={{ fontSize: "40px", cursor: "pointer" }}
              onClick={() =>  handleSaveClick(index)}
            ></ion-icon>
          </div>
        ))
      ) : (
        <div className="m-6 ml-0 text-slate-600">Add variables</div>
      )}
    </div>
  );
};

export default StringInterpolationDisplay;
