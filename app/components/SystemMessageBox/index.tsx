import InputBox from "@/app/components/InputBox/InputBox";

import { EditStringInterpoplations } from "@/app/components/Modal/EditStringInterpolations";
import useModelData from "@/app/hooks/useModelData";
import useSystemMessage from "@/app/hooks/useSystemMessage";
import { Card, CardBody, CardHeader } from "@/app/components/Card";
import { Button, Divider } from "@nextui-org/react";

/* 
    This component is used to select the initial model for the chat and set the system message.
*/
export default function SystemMessageBox() {
    const { systemMessage, handleSystemMessage } = useSystemMessage();

    const { handleGoClick, models } = useModelData();

    return (
        <Card>
            <CardBody>
                <div className="flex gap-3 p-1 items-end">
                    <InputBox
                        inputText={"System Message"}
                        isButtonVisabled
                        value={systemMessage}
                        handleInput={(e) => {
                            handleSystemMessage(e.target.value);
                        }}
                        onSubmit={handleSystemMessage}
                    />
                    <EditStringInterpoplations
                        size="lg"
                        radius="sm"
                        variant="light"
                    />
                    <Button
                        size="lg"
                        radius="sm"
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
