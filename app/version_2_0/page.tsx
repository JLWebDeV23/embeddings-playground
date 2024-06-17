"use client";
import React, { useState } from "react";
import {
  Message,
  Model,
  ModelData,
  StringInterpolation,
  StringInterpolations,
} from "@/app/utils/interfaces";

import ModelCompare from "../components/ModelCompare";
import UserInput from "../components/UserInput";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

import { insertUserPrompt, go, createNewModelData } from "../utils/api";


const MockAnswer = [
  [
    {
      "model": "OpenAI",
      "subModel": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "User",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "User",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is Joey"
        }
      ],
      "locked": true
    },
    {
      "model": "LlaMA 3",
      "subModel": "llama3-8b-8192",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "User",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is Ai"
        },
        {
          "role": "User",
          "content": "Hello, my name is Joey"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is Joey"
        }
      ],
      "locked": true
    }
  ],
  [
    {
      "model": "OpenAI",
      "subModel": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is alice"
        },
        {
          "role": "User",
          "content": "Hello, my name is alice"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is alice"
        },
        {
          "role": "User",
          "content": "Hello, my name is alice"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is alice"
        }
      ],
      "locked": true
    },
    {
      "model": "LlaMA 3",
      "subModel": "llama3-8b-8192",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is alice"
        },
        {
          "role": "User",
          "content": "Hello, my name is alice"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is assistant and I like to talk a lot and oversizing the text because I like annoy web developpers! Because it's not enought, I will add a lot of text to make sure that the text is really big to overflow the container and make the web developper life a nightmare! I'm a bad assistant!"
        },
        {
          "role": "User",
          "content": "Dont'worry assistant, it fits"
        },
        {
          "role": "Assistant",
          "content": "😭😭😭"
        }
      ],
      "locked": true
    }
  ],
  [
    {
      "model": "OpenAI",
      "subModel": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is John"
        },
        {
          "role": "User",
          "content": "Hello, my name is John"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is John"
        },
        {
          "role": "User",
          "content": "Hello, my name is John"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is John"
        }
      ],
      "locked": true
    },
    {
      "model": "LlaMA 3",
      "subModel": "llama3-8b-8192",
      "messages": [
        {
          "role": "system",
          "content": "Hello, my name is John"
        },
        {
          "role": "User",
          "content": "Hello, my name is John"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is John"
        },
        {
          "role": "User",
          "content": "Hello, my name is John"
        },
        {
          "role": "Assistant",
          "content": "Hello, my name is John"
        }
      ],
      "locked": true
    }
  ]
]

/* type goProps = {
  modelData: ModelData[][];
  systemMessage: string;
  stringInterpolations: StringInterpolations[];
};

interface ModelData {
  model: string;
  subModel: string;
  messages: Message[];
  locked: boolean;
} */
const MockInput2 = {
  systemMessage: "You are {{user}} and I am a {{system}}.",
  userPrompt: "Hello who are you?",
  stringInterpolations: [
    {
      list: [
        {
          key: 0,
          field: "AI",
          variable: "system",
        },
        {
          key: 0,
          field: "Joey",
          variable: "user",
        },
      ],
    },
    {
      list: [
        {
          key: 0,
          field: "AI",
          variable: "system",
        },
        {
          key: 0,
          field: "Alice",
          variable: "user",
        },
      ],
    },
    {
      list: [
        {
          key: 0,
          field: "AI",
          variable: "system",
        },
        {
          key: 0,
          field: "John",
          variable: "user",
        },
      ],
    },
  ],
  modelData: MockAnswer

}

const MockInput = {
  systemMessage: "You are a {{user}} and I am a {{system}}.",
  userMessage: "Hello who are you?",
  interpolations: [
    {
      list: [
        {
          key: 0,
          field: "Joey",
          variable: "name",
        },
      ],
    },
    {
      list: [
        {
          key: 0,
          field: "alice",
          variable: "name",
        },
      ],
    },
    {
      list: [
        {
          key: 0,
          field: "John",
          variable: "name",
        },
      ],
    },
  ],
  models: [[{
    "model": "OpenAI",
    "subModel": "gpt-3.5-turbo",
    "messages": [],
    "locked": true
  }]]
}


const Version_2_0 = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [systemMessage, setSystemMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialModelData = [[{
    "model": models.length > 0 ? models[0].model : '',
    "subModel": models.length > 0 ? models[0].subModel : '',
    "messages": [],
    "locked": true
  }]]

  const [modelData, setmodelData] = useState<ModelData[][]>([[]]);

  const handleGoClick = ({ newSystemMessage, interpolations }: {
    newSystemMessage: string,
    interpolations: StringInterpolation[],
  }) => {
    setSystemMessage(newSystemMessage);

    if (models.length === 0) {
      console.log("No models selected")
      return;
    }
    setIsLoading(true);
    go({
      modelData: modelData[0].length > 0 ? modelData : initialModelData,
      systemMessage: newSystemMessage,
      stringInterpolations: [{ list: interpolations }],
    }).then((response) => {
      setmodelData(response);
      setIsLoading(false);
    });
  }


  const handleAddResponseClick = (value: string) => {

    if (models.length === 0) {
      console.log("No models selected")
      return;
    }

    setIsLoading(true);
    insertUserPrompt({
      modelData: modelData[0].length > 0 ? modelData : initialModelData,
      userPrompt: value,
      systemMessage: systemMessage,
      stringInterpolations: [{
        list: [{
          key: 0,
          variable: "name",
          field: "Joey"
        }]
      }],
    }).then((response) => {
      if (response) {
        setmodelData(response);
      }
      setIsLoading(false);
    })
  }


  return (
    <>
      <div className="m-5 gap-3 flex flex-col flex-1">
        <ModelCompare
          handleGoClick={handleGoClick}
          selectedModels={models}
          setSelectedModels={setModels}
        />
        {
          modelData.map((obj, index) => (
            <ModelAnswerGroup key={index} answers={obj} isLoading={isLoading} />
          ))
        }

      </div>
      <div className="sticky bottom-0 p-5 gap-3 flex flex-col flex-1  backdrop-blur-md" >
        <UserInput
          handleAddResponseClick={handleAddResponseClick}
          className="pt-4 w-full"
        />
      </div>
    </>
  );
};

export default Version_2_0;