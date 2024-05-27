require("dotenv").config();
import React, { use, useEffect, useState } from "react";
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

type ModelInteraction = {
  user: string;
  assistant: string;
};

export type ModelsData = {
  firstModel: {
    model: string | "";
    modelInteraction: ModelInteraction[] | null;
  } | null;
  secondModel: {
    model: string | "";
    modelInteraction: ModelInteraction[] | null;
  } | null;
  score: number | null;
} | null;

const ModelCompare = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [modelsData, setModelsData] = useState<ModelsData | null>(null);
  // const [show, setShow] = useState(false);
  // const [numbers, setNumbers] = useState([2,3,4]);
  const [inputValue, setInputValue] = useState("");
  const handleTestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    // Testing for model selection
    console.log(modelsData?.firstModel?.model);
    console.log(modelsData?.secondModel?.model);
  }, [modelsData?.firstModel?.model, modelsData?.secondModel?.model]);


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
  return (
    <div className={styles.modelCompare}>
      <div className="flex  flex-row gap-10 mt-2 mb-1">
        <ModelHeader
          dropdownContentDirection="right"
          onSubModelChange={(model) => {
            setModelsData((prevModelsData: ModelsData) => {
              if (prevModelsData) {
                return {
                  ...prevModelsData,
                  firstModel: {
                    ...prevModelsData.firstModel,
                    model: model,
                    modelInteraction:
                      prevModelsData.firstModel?.modelInteraction || null,
                  },
                };
              } else {
                return {
                  firstModel: { model: model, modelInteraction: null },
                  secondModel: null,
                  score: null,
                };
              }
            });
          }}
        />
        <ModelHeader
          dropdownContentDirection="left"
          onSubModelChange={(model) => {
            setModelsData((prevModelsData: ModelsData) => {
              if (prevModelsData) {
                return {
                  ...prevModelsData,
                  secondModel: {
                    ...prevModelsData.secondModel,
                    model: model,
                    modelInteraction:
                      prevModelsData.secondModel?.modelInteraction || null,
                  },
                };
              } else {
                return {
                  firstModel: null,
                  secondModel: { model: model, modelInteraction: null },
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
          onClick={(value: string) => {
            console.log(value);
            // chatcompletion and display to model one => add to modelsData

            // push to the ModelsData

          }}
        />
      </div>
    </div>
  );
};

export default ModelCompare;
