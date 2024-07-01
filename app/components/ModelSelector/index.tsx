import {
    Select,
    SelectItem,
    SelectSection,
    type SelectProps,
} from "@nextui-org/react";
import { type Model } from "@/app/utils/interfaces";
import modelsData from "@/public/assets/data/ModelData.json";
import { useEffect } from "react";
import { useApiKeys } from "@/app/hooks/useApiKeys";

type ModelSelectorProps = {
    models?: typeof modelsData;
    onChange: (model: Model) => void;
    selectedModels?: Model[];
    multipleModels?: boolean;
} & Omit<SelectProps, "children" | "onChange" | "id">;

export default function ModelSelector({
    models = modelsData,
    onChange,
    selectedModels,
    multipleModels = true,
    ...props
}: ModelSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!e.target.value) return;
        const model: Model = JSON.parse(e.target.value);
        onChange(model);
    };
    useEffect(() => {}, [selectedModels]);

    const { apiKeys } = useApiKeys();

    const disabledKeys = apiKeys.filter((key) => key.apiKey === "");
    const disabledModels = models.filter((model) =>
        disabledKeys.some((key) => key.modelsNames.includes(model.model))
    );

    // array of submodels that are disabled
    const disabledSubmodels = disabledModels.reduce(
        (submodels: string[], model) => {
            return [
                ...submodels,
                ...model.submodel.map((submodel) =>
                    JSON.stringify({
                        model: model.model,
                        subModel: submodel.model,
                    })
                ),
            ];
        },
        []
    );

    return (
        <Select
            onChange={(e) => handleChange(e)}
            selectedKeys={selectedModels?.map((model) => JSON.stringify(model))}
            disabledKeys={disabledSubmodels}
            multiple={multipleModels}
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
