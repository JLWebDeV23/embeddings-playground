import React from "react";
import InputBox from "@/app/components/InputBox/InputBox";
import { CardData } from "@/app/utils/interfaces";

type CardProps = {
    index: number;
    x: string;
    y: string;
    onInputChange: (
        index: number,
        field: keyof CardData,
        value: string
    ) => void;
    onSwap?: (index: number) => void;
};

const Card: React.FC<CardProps> = ({ index, x, y, onInputChange }) => {
    return (
        <div className="card shadow-md w-full border-r-0 border border-indigo-600 opacity-70 ">
            <div className="card-body">
                <InputBox
                    onSubmit={(value) => onInputChange(index, "x", value)}
                    inputText="Searh Word"
                    isButtonDisabled
                />
                <InputBox
                    onSubmit={(value) => onInputChange(index, "y", value)}
                    inputText="Replace With"
                    isButtonDisabled
                />
            </div>
        </div>
    );
};

export default Card;
