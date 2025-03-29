// AddStringInterpolation.js
import React from 'react';

interface AddStringInterpolationProps {
  variable: string;
  setVariable: (value: string) => void;
  field: string;
  setField: (value: string) => void;
  onAdd: () => void;
}

const AddStringInterpolation: React.FC<AddStringInterpolationProps> = ({
  variable,
  setVariable,
  field,
  setField,
  onAdd,
}) => {
  return (
    <section className="">
      <div className="flex">
        <input
          type="text"
          placeholder="Variable"
          className="input input-ghost w-full max-w-xs"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
        />
        <input
          type="text"
          placeholder="Field"
          className="input input-ghost w-full max-w-xs mr-4"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <button
          className="btn bg-transparent
          hover:bg-green hover:text-white"
          onClick={onAdd}
        >
          +
        </button>
      </div>
    </section>
  );
};

export default AddStringInterpolation;
