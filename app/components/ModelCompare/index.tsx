import InputBox from "@/app/components/InputBox/InputBox";
import ModelSelector from "@/app/components/ModelSelector";

import { EditStringInterpoplations } from "@/app/components/Modal/EditStringInterpolations";
import useModelData from "@/app/hooks/useModelData";
import useSystemMessage from "@/app/hooks/useSystemMessage";
import { Model } from "@/app/utils/interfaces";
import SetupApiKeyModal from "./SetupApiKeyModal";
import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Button, Divider } from "@nextui-org/react";

/* 
    This component is used to select the initial model for the chat and set the system message.
*/
export default function ModelCompare() {
    const { systemMessage, handleSystemMessage } = useSystemMessage();

    const { handleGoClick, models } = useModelData();

    return (
        <Card>
            <CardHeader className="flex flex-wrap justify-between items-center gap-3 p-3">
                <h1 className="font-bold text-xl whitespace-nowrap">
                    Model Compare
                </h1>
                <div className="flex gap-3 ">
                    <EditStringInterpoplations />
                    <SetupApiKeyModal />
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="flex gap-3 pt-3 items-end">
                    <InputBox
                        inputText={"System Message"}
                        isButtonVisabled
                        value={systemMessage}
                        handleInput={(e) => {
                            handleSystemMessage(e.target.value);
                        }}
                        onSubmit={handleSystemMessage}
                    />
                    <Button
                        className="h-16"
                        isDisabled={!systemMessage || models.length < 1}
                        onClick={() =>
                            handleGoClick({
                                newSystemMessage: systemMessage,
                            })
                        }
                    >
                        GO
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
