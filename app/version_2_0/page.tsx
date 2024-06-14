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
  const [systemMessage, setSystemMessage] = useState<string>("");
  const [modelData, setmodelData] = useState<ModelData[][]>([[]]);

  const handleGoClick = ({ newSystemMessage, interpolations, models }: {
    newSystemMessage: string,
    interpolations: StringInterpolation[],
    models: Model[]
  }) => {
    setSystemMessage(newSystemMessage);

    if (models.length === 0) {
      console.log("No models selected")
      return;
    }
    /* set({
      model: models[0].model,
      subModel: models[0].subModel,
      messages: [],
      locked: false;
    }) */
    go({
      modelData: modelData,
      systemMessage: newSystemMessage,
      stringInterpolations: [{ list: interpolations }],
    }).then((response) => {
      setmodelData(response);
    });
  }

  /* 
  type InsertUserPromptProps = {
    modelData: ModelData][];
    userPrompt: string;
    systemMessage: string;
    stringInterpolations: StringInterpolations[];
  };
  */

  const handleAddResponseClick = (value: string) => {
    insertUserPrompt({
      modelData: modelData,
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
    })
  }

  return (
    <>
      <div className="m-5 gap-3 flex flex-col flex-1">
        <ModelCompare
          handleGoClick={handleGoClick}
        />
        {
          modelData.map((obj, index) => (
            <ModelAnswerGroup key={index} answers={obj} />
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