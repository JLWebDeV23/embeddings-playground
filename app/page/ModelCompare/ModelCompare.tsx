require("dotenv").config();
import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { repeatOutline } from "ionicons/icons";
import styles from "./ModelCompare.module.css";
import ModelHeader from "@/app/components/ModelHeader/ModelHeader";
import {
  modelResponse,
  createCosineSimilarity,
} from "@/app/utils/modelProcessing";
import InputBox from "@/app/components/InputBox/InputBox";
import UserAssistantResult from "@/app/components/UserAssistantResult/UserAssistantResult";

// future implementation
// lock boolean
// arr of models
export type ModelsData = {
  firstModel: {
    model: string | "";
    subModel: string | "";
    messages: any[] | null;
  } | null;
  secondModel: {
    model: string | "";
    subModel: string | "";
    messages: any[] | null;
  } | null;
  score: (number | null)[];
} | null;

const ModelCompare = () => {
  const [modelsData, setModelsData] = useState<ModelsData | null>(null);
  const [sysMessage, setSysMessage] = useState<string>("");

  const [messageUpdated, setMessageUpdated] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (modelsData !== null && messageUpdated) {
        const response = await modelResponse(modelsData);
        // handle the response
        setModelsData(response)
        setMessageUpdated(false); // Reset the messageUpdated flag
      }
    };

    fetchData();
  }, [messageUpdated]); // Depend only on messageUpdated

  const generateModelsData = async (value: string) => {
    const message = { role: "user", content: value };
    try {
      setModelsData((prevModelsData: ModelsData) => {
        const updatedData = {
          ...prevModelsData,
          firstModel: {
            model: prevModelsData?.firstModel?.model || "",
            subModel: prevModelsData?.firstModel?.subModel || "",
            messages: [
              ...(prevModelsData?.firstModel?.messages || []),
              message,
            ],
          },
          secondModel: {
            model: prevModelsData?.secondModel?.model || "",
            subModel: prevModelsData?.secondModel?.subModel || "",
            messages: [
              ...(prevModelsData?.secondModel?.messages || []),
              message,
            ],
          },
          score: prevModelsData?.score || [],
        };

        if (sysMessage) {
          const sysMsg = { role: "system", content: sysMessage };
          if (updatedData.firstModel.messages[0]?.role === "system") {
            updatedData.firstModel.messages[0] = sysMsg;
            updatedData.secondModel.messages[0] = sysMsg;
          } else {
            updatedData.firstModel.messages.unshift(sysMsg);
          updatedData.secondModel.messages.unshift(sysMsg);
          }
        }

        return updatedData;
      });

      // Set messageUpdated to true after updating modelsData
      setMessageUpdated(true);

      // chat complet with no sysMessage

      // check existing modelsData

      // construct object to be set to modelsData

      // => refractor modelResponse() => send to modelResponse

      // const firstModelContent: string | null = await modelResponse(
      //   modelsData?.firstModel,
      //   value
      // );
      // const secondModelContent: string | null = await modelResponse(
      //   modelsData?.secondModel,
      //   value
      // );
      // // similarity score
      // const newScore: number | null = await createCosineSimilarity(
      //   firstModelContent,
      //   secondModelContent
      // );

      // // construct object to be set to modelsData
      // setModelsData((modelsData: ModelsData) => {
      //   return {
      //     ...modelsData,
      //     firstModel: {
      //       model: modelsData?.firstModel?.model || "",
      //       subModel: modelsData?.firstModel?.subModel || "",
      //       messages: [
      //         ...(modelsData?.firstModel?.messages || []),
      //         { role: "user", content: value },
      //         { role: "assistant", content: firstModelContent },
      //       ],
      //     },
      //     secondModel: {
      //       model: modelsData?.secondModel?.model || "",
      //       subModel: modelsData?.secondModel?.subModel || "",
      //       messages: [
      //         ...(modelsData?.secondModel?.messages || []),
      //         { role: "user", content: value },
      //         { role: "assistant", content: secondModelContent },
      //       ],
      //     },
      //     score: [...(modelsData?.score || []), newScore],
      //   };
      // });
    } catch (error) {
      console.error("Error Message:", error);
    }
  };

  return (
    <div className={styles.modelCompare}>
      <div className="flex  flex-row gap-10 mt-2 mb-1">
        <ModelHeader
          dropdownContentDirection="right"
          onSubModelChange={(model, subModel) => {
            setModelsData((prevModelsData: ModelsData) => {
              if (prevModelsData) {
                return {
                  ...prevModelsData,
                  firstModel: {
                    ...prevModelsData.firstModel,
                    model: model,
                    subModel: subModel,
                    messages: prevModelsData.firstModel?.messages || null,
                  },
                };
              } else {
                return {
                  firstModel: {
                    model: model,
                    subModel: subModel,
                    messages: null,
                  },
                  secondModel: null,
                  score: [],
                };
              }
            });
          }}
        />
        <ModelHeader
          dropdownContentDirection="left"
          onSubModelChange={(model, subModel) => {
            setModelsData((prevModelsData: ModelsData) => {
              if (prevModelsData) {
                return {
                  ...prevModelsData,
                  secondModel: {
                    ...prevModelsData.secondModel,
                    model: model,
                    subModel: subModel,
                    messages: prevModelsData.secondModel?.messages || null,
                  },
                };
              } else {
                return {
                  firstModel: null,
                  secondModel: {
                    model: model,
                    subModel: subModel,
                    messages: null,
                  },
                  score: [],
                };
              }
            });
          }}
        />
      </div>
      <InputBox
        InputText={"System Messsage"}
        isButtonDisabled
        btnStyle="top-2"
        onValueChange={(value) => {
          setSysMessage(value);
        }}
      />
      {/* toggle lock field */}
      {/* <textarea className={isClicked ? styles.textAreaClicked : styles.textArea}>
        Your text here
      </textarea> */}
      {/* <button onClick={() => setIsClicked(!isClicked)}>Change Color</button> */}
      <div className={styles.replace}>
        <input type="text" className={styles.input} />
        <div className="ml-1 mr-1">
          <IonIcon icon={repeatOutline} size="large" />
        </div>
        <input type="text" className={styles.input} />
        <button></button>
      </div>
      <UserAssistantResult modelsData={modelsData} />

      <div className="mt-2">
        <InputBox
          btnName="Add"
          InputText="User Message"
          btnStyle="rounded-none rounded-r-lg h-full translate-x-[15%]"
          onClick={(value: string) => {
            // chatcompletion and display to model one => add to modelsData
            // chatcompletion of value using selected models and push both value to user and the derived completion to the ModelsData
            generateModelsData(value);
          }}
        />
      </div>
    </div>
  );
};

export default ModelCompare;
