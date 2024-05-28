require("dotenv").config();
import React, { useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import { repeatOutline } from "ionicons/icons";
import styles from "./ModelCompare.module.css";
import TextBox from "@/app/components/TextBox/TextBox";
import TextArea from "@/app/components/TextArea/TextArea";
import {
  createChatCompletion,
  createTest,
  createTest1,
} from "@/app/utils/functions";
import ModelHeader from "@/app/components/ModelHeader/ModelHeader";
import {
  createEmbedding,
  modelResponse,
  createCosineSimilarity,
} from "@/app/utils/modelProcessing";
import InputBox from "@/app/components/InputBox/InputBox";
import UserAssistantResult from "@/app/components/UserAssistantResult/UserAssistantResult";

//test

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
  score: number | null;
} | null;

const ModelCompare = () => {
  const [modelsData, setModelsData] = useState<ModelsData | null>(null);
  // const [show, setShow] = useState(false);
  // const [numbers, setNumbers] = useState([2,3,4]);
  const [inputValue, setInputValue] = useState("");
  const handleTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    // Testing for model selection
    console.log(`Model: ${modelsData?.firstModel?.model} SubModel: ${modelsData?.firstModel?.subModel}`);
    console.log(`Model: ${modelsData?.secondModel?.model} SubModel: ${modelsData?.secondModel?.subModel}`);
  }, [modelsData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TESTING FOR SIMILARITY
    // GPT
    const completion: string | null = (await createTest(inputValue)).message
      .content;
    // Llama
    const completion1: string | null = (await createTest1(inputValue)).message
      .content;
    // similarity between the two completions
    console.log(await createCosineSimilarity(completion, completion1));

    console.log("GPT: " + completion);
    console.log("Llama: " + completion1);
  };

  const generateModelsData = async () => {
    
  }
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
                    messages:
                      prevModelsData.firstModel?.messages || null,
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
                  score: null,
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
                    messages:
                      prevModelsData.secondModel?.messages || null,
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
                  score: null,
                };
              }
            });
          }}
        />
      </div>
      <InputBox
        InputText={"System Messsage"}
        btnName={"GO"}
        btnStyle="top-2"
        onClick={(value: string) => {
          console.log(value);
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
      <UserAssistantResult />

      <div className="mt-2">
        <InputBox
          btnName="Add"
          InputText="User Message"
          btnStyle="rounded-none rounded-r-lg h-full translate-x-[15%]"
          onClick={async (value: string) => {
            console.log(value);
            // chatcompletion and display to model one => add to modelsData

            // chatcompletion of value using selected models and push both value to user and the derived completion to the ModelsData
            const content = await modelResponse(modelsData, value);
            console.log(content);
          }}
        />
      </div>
    </div>
  );
};

export default ModelCompare;
