import {
    Select,
    SelectItem,
    SelectSection,
    type SelectProps,
} from "@nextui-org/react";
import { type Model } from "@/app/utils/interfaces";
import modelsData from "@/public/assets/data/ModelData.json";
import { useEffect } from "react";

type ModelSelectorProps = {
    models?: typeof modelsData;
    onChange: (model: Model) => void;
    selectedModels?: Model[];
} & Omit<SelectProps, "children" | "onChange">;

export default function ModelSelector({
    models = modelsData,
    onChange,
    selectedModels,
    ...props
}: ModelSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!e.target.value) return;
        const model: Model = JSON.parse(e.target.value);
        onChange(model);
    };
    useEffect(() => {
        console.log("selectedModels in ModelSelector", selectedModels);
    }, [selectedModels]);

    return (
        <Select
            className="max-w-64"
            onChange={(e) => handleChange(e)}
            selectedKeys={selectedModels?.map((model) => JSON.stringify(model))}
            {...props}
        >
            {models.map((model) => (
                <SelectSection title={model.model} key={model.model}>
                    {model.submodel.map((submodel, sindex) => (
                        <SelectItem
                            key={JSON.stringify({
                                model: model.model,
                                subModel: submodel.model,
                            })}
                            value={sindex}
                        >
                            {submodel.model}
                        </SelectItem>
                    ))}
                </SelectSection>
            ))}
        </Select>
    );
}
