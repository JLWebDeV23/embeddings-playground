import useModelData from '@/app/hooks/useModelData';
import { Model } from '@/app/utils/interfaces';
import { Button } from '@nextui-org/react';
import ModelSelector from '../ModelSelector';

export default function ModelCompareInputFooter() {
  const { models, handleModelsAction } = useModelData();

  const handleModelSelection = (model: Model) => {
    handleModelsAction({ action: 'set_initial', model: model });
  };
  return (
    <>
      <ModelSelector
        placeholder="Select the initial model"
        aria-label="initial model"
        selectedModels={models}
        onChange={handleModelSelection}
        className="w-full max-w-64"
        size="sm"
        variant="flat"
      />
      <Button
        size="sm"
        onPress={() => {
          handleModelsAction({ action: 'reset' });
        }}
        className="hover:bg-danger"
        variant="flat"
      >
        Reset
      </Button>
    </>
  );
}
