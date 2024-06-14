"use client";
import React, { useEffect, useState, useCallback } from "react";
import Response from "../components/Response/Response";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import {
  ModelData,
  StringInterpolation,
  StringInterpolations,
} from "../utils/interfaces";
import ModelHeader from "../components/ModelHeader/ModelHeader";
import { chatCompletion, createNewModelData } from "../utils/modelProcessing";
import { createTestNewModelData } from "../utils/modelProcessing";
import AlertModal from "../components/AlertModal/AlertModal";
import {
  createStringInterpolation,
  upsertStringInterpolations,
} from "../utils/functions";
import Modal from "../components/Modal/Modal";
import StringInterpolationList from "../components/Modal/StringInterpolationList/StringInterpolationList";
import StringInterpolationDisplay from "../components/Modal/StringInterpolationDisplay/StringInterpolationDisplay";
import AddStringInterpolation from "../components/Modal/AddStringInterpolation/AddStringInterpolation";

import ModelCompare from "../components/ModelCompare";
import UserInput from "../components/UserInput";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

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

const buildInput = (
  systemMessage: string,
  userMessage: string,
  interpolations: StringInterpolations[],
  models: ModelData[][]
) => {
  return {
    systemMessage: systemMessage,
    userMessage: userMessage,
    interpolations: interpolations,
    models: models
  }
}

const Version_2_0 = () => {
  const [systemMessage, setSystemMessage] = useState<string>("");

  const handleGoClick = ({ newSystemMessage, interpolations, models }: {
    newSystemMessage: string,
    interpolations: StringInterpolation[],
    models: ModelData[]

  }) => {
    setSystemMessage(newSystemMessage);
    console.log(newSystemMessage, interpolations, models);
  }


  const handleAddResponseClick = (value: string) => {
    console.log(buildInput(systemMessage, value, [], [[]]));
  }

  return (
    <>
      <div className="m-5 gap-3 flex flex-col flex-1">
        <ModelCompare
          handleGoClick={handleGoClick}
        />
        {
          MockAnswer.map((obj, index) => (
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


const _Version_2_0 = () => {
  const [modelData, setModelData] = useState<ModelData[]>([]);
  const [sysMessage, setSysMessage] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stringInterpolation, setStringInterpolation] = useState<
    StringInterpolation[]
  >([]); // Todo: dont touch for now - will be replace with stringInterpolationList to interact with the models for display
  const [stringInterpolations, setStringInterpolations] = useState<
    StringInterpolations[]
  >([
    {
      list: [],
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [variable, setVariable] = useState("");
  const [field, setField] = useState("");
  const [isUserInputDisabled, setIsUserInputDisabled] = useState(false);

  const onClose = useCallback(() => {
    setShowAlert(false);
  }, []);

  useEffect(() => {
    console.log("String Interpolations", stringInterpolations.length);
    console.log(stringInterpolations);
  }, [stringInterpolations]);

  useEffect(() => {
    console.log("Selected Index", selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    console.log("ModelData", modelData);
  }, [modelData]);

  useEffect(() => {
    const generateAndUpdateModelData = async () => {
      if (shouldGenerate) {
        const newModelData = await generateModelsData();
        try {
          go(newModelData);
        } catch (error) {
          console.error("Failed to update model data:", error);
        }
        setShouldGenerate(false);
      }
    };

    generateAndUpdateModelData();
  }, [shouldGenerate]);

  const handleAddResponseClick = (value: string) => {
    try {
      if (!modelData.length || !modelData[0].model || !modelData[0].subModel) {
        setShowAlert(true);
      } else {
        // TODO: Do not clear user prompt after alert pops up
        // Add a new response to the modelResponses
        // construct a new response object
        let newMessages = [];
        let newSysMessage = "";
        if (sysMessage) {
          newSysMessage = createStringInterpolation(
            sysMessage,
            stringInterpolation
          );
          newMessages.push({ role: "system", content: newSysMessage });
        }
        if (value) {
          newMessages.push({ role: "user", content: value });
        }
        try {
          // input -> check sys msg -> add to modelData
          if (modelData && modelData[0] && modelData[0].messages?.length > 0) {
            const updatedSystemMessage = updateSystemMessage();

            if (value) {
              if (updatedSystemMessage) {
                const [firstModelData, ...restModelData] = updatedSystemMessage;
                const newMessages = [
                  ...firstModelData.messages,
                  { role: "user", content: value },
                ];
                // newMessages.forEach((msg) => {});

                const newFirstModelData = {
                  ...firstModelData,
                  messages: newMessages,
                };
                const newModelData = [newFirstModelData, ...restModelData];
                setModelData(newModelData);
              }
            }
          } else {
            // const { messages } = modelData[0];
            const newModelData: ModelData = {
              ...modelData[0], // Spread the properties of the first element
              messages: newMessages, // Replace the messages with the new array
              locked: true,
            };
            setModelData([newModelData]);
          }
          setShouldGenerate(true);
        } catch (error) {
          console.error("Add Error Message: " + error);
        }
      }
    } catch (error) {
      console.error("Model Message: " + error);
    }
  };

  const handleOnSubModelChange = (model: string, subModel: string) => {
    const newModelData: ModelData = {
      model: model,
      subModel: subModel,
      messages: [],
      locked: true,
    };
    setModelData([newModelData]);
    setShowAlert(false);
    setIsUserInputDisabled(false);
  };

  const handleOnAddModel = async (model: string, subModel: string) => {
    console.log("Add Model" + model + " " + subModel);
    // console.log(newModelData)
    const newModelData: ModelData = {
      model: model,
      subModel: subModel,
      messages: [],
      locked: false,
    };
    const [firstModelData, ...restModelData] = modelData;
    const result = await createNewModelData(firstModelData, newModelData);
    setModelData([...modelData, result]);
  };

  const updateSystemMessage = () => {
    try {
      const newSysMessage = createStringInterpolation(
        sysMessage,
        stringInterpolation
      );
      const systemMessage = { role: "system", content: newSysMessage };
      const [firstModelData, ...restModelData] = modelData;
      if (firstModelData && firstModelData.messages) {
        const updatedFirstModelData = {
          ...firstModelData,
          messages: [systemMessage, ...firstModelData.messages.slice(1)],
        };
        const newModelData = [updatedFirstModelData, ...restModelData];
        // setModelData(newModelData);
        return newModelData;
      }
    } catch (error) {
      console.error("Create System Message Error:", error);
    }
  };

  const generateModelsData = async () => {
    try {
      const message = await chatCompletion(modelData[0]);
      const assistantMessage = {
        role: message?.role || "",
        content: message?.content || "",
      };
      const [firstModelData, ...restModelData] = modelData;
      const newFirstModelData = {
        ...firstModelData,
        messages: [...firstModelData.messages, assistantMessage],
      };
      const newModelData = [newFirstModelData, ...restModelData];
      // DO a go here
      return newModelData;
      // setModelData(newModelData);
    } catch (error) {
      console.error("Model Fetching Error:", error);
    }
  };

  const handleLockBtn = (modelIndex: number) => {
    setModelData((prevModelData) =>
      prevModelData.map((modelData, index) => {
        if (index === modelIndex) {
          return {
            ...modelData,
            locked: !modelData.locked,
          };
        }
        return modelData;
      })
    );
  };

  const handleAddStringInterpolation = () => {
    const newInterpolations = stringInterpolations.map((interpolation) => {
      return {
        ...interpolation,
        list: [
          ...interpolation.list,
          {
            key: interpolation.list.length,
            field: field,
            variable: variable,
          },
        ],
      };
    });
    setStringInterpolations(newInterpolations);
    setVariable("");
    setField("");
  };

  const go = async (modelData1: ModelData[] | undefined) => {
    // setIsUserInputDisabled(true);
    const newSysMessage = createStringInterpolation(
      sysMessage,
      stringInterpolation
    );

    let newModelData = modelData1!.map((data, dataIndex) => {
      if (dataIndex === 0) {
        const updatedMessages = data.messages.map((message, messageIndex) => {
          if (message.role === "system" && messageIndex === 0) {
            return { ...message, content: newSysMessage };
          }
          return message;
        });
        return {
          ...data,
          messages: updatedMessages,
        };
      }
      return data;
    });
    newModelData = await Promise.all(
      newModelData.map(async (data) => {
        if (!data.locked) {
          // Create an empty model data object
          const emptyData = {
            ...data,
            messages: [],
          };
          const createdNewModelData = await createNewModelData(
            newModelData[0],
            emptyData
          );
          // Return the empty data object
          return createdNewModelData;
        }
        // If the data is locked, return it as is
        return data;
      })
    );
    setModelData(newModelData);
    return newModelData;
  };

  const handleAddStringInterpolations = () => {
    const [firstInterpolation, ...restInterpolations] = stringInterpolations;
    const newInterpolations = [...stringInterpolations, firstInterpolation];
    setStringInterpolations(newInterpolations);
    setSelectedIndex(newInterpolations.length - 1);
    setVariable("");
    setField("");
  };

  const handleDeleteInterpolationFieldBtn = (value: number) => {
    console.log(value);
  };

  const handleTest = async () => {
    // const testData = [
    //   [
    //     {
    //       model: "OpenAI",
    //       subModel: "gpt-3.5-turbo",
    //       messages: [],
    //       locked: true,
    //     },
    //   ],
    // ] as ModelData[][];
    const newModelData: ModelData = {
      model: "LlaMA 3",
      subModel: "llama3-8b-8192",
      messages: [],
      locked: false,
    };
    const systemMessage = "Hello, my name is {{name}}";
    const stringInterpolations: StringInterpolations[] = [
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
            field: "Alice",
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
    ];
    const props = {
      systemMessage: systemMessage,
      modelData: testData,
      stringInterpolations: stringInterpolations,
      newModelData: newModelData,
    };
    console.log(testData, "hi")
    console.log(await createTestNewModelData(props));
    console.log(upsertStringInterpolations(systemMessage, testData, stringInterpolations));
    // const template = "Hello, {{name}}. Welcome to {{place}}.";
    // const interpolations: StringInterpolation[] = [
    //   { key: 1, variable: "name", field: "Alice" },
    //   { key: 2, variable: "place", field: "Wonderland" },
    // ];
    // console.log(createStringInpterpolation(template, interpolations));
  };

  return (
    <div className="flex-col w-full">
      <div className="flex items-end p-2 border-b-2 border-black">
        <h1 className="flex-grow pl-2 font-sans text-2xl">Model Compare</h1>
        <div className="flex ml-auto items-end">
          <button className="btn btn-square ml-4" onClick={handleTest}>
            test
          </button>
          {/* // Todo: add caution msg onclick again, history will be remove for new chat */}
          <ModelHeader
            dropdownContentDirection="left"
            onSubModelChange={handleOnSubModelChange}
          />
          <div className="flex mx-auto">
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-opacity-90 backdrop-blur-sm z-40"></div>
            )}
            <button
              className="btn btn-square ml-4"
              onClick={() => {
                const modal = document.getElementById(
                  "api_modal"
                ) as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                  setIsModalOpen(true);
                }
              }}
            >
              API
            </button>
            <Modal
              id="api_modal"
              title="API Keys"
              onClose={() => setIsModalOpen(false)}
            >
              <p className="py-4">none</p>
              <section className="border-t border-t-green opacity-80">
                <div className="flex p-4 pb-0">
                  <select className="select select-ghost max-w-xs">
                    <option disabled selected>
                      API
                    </option>
                    <option>OpenAI</option>
                    <option>Groq</option>
                    <option>Claude</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter your key"
                    className="input input-ghost flex-grow mr-4"
                  />
                  <button className="btn bg-transparent border-none hover:bg-green hover:text-white">
                    +
                  </button>
                </div>
              </section>
            </Modal>

            <button
              className="btn btn-square ml-4"
              onClick={() => {
                const modal = document.getElementById(
                  "string_interpolation_modal"
                ) as HTMLDialogElement;
                if (modal) {
                  modal.showModal();
                  setIsModalOpen(true);
                }
              }}
            >
              /
            </button>
            <Modal
              id="string_interpolation_modal"
              title="String /"
              onClose={() => setIsModalOpen(false)}
            >
              <div className="flex overflow-x-hidden h-auto ">
                <div className="overflow-x-auto z-10">
                  <StringInterpolationList
                    list={stringInterpolations}
                    selectedIndex={selectedIndex}
                    onSelect={setSelectedIndex}
                  />
                </div>
                <button
                  className="btn btn-sm bg-transparent hover:bg-green border-none hover:text-white"
                  onClick={handleAddStringInterpolations}
                >
                  +
                </button>
              </div>
              <hr className=" border-t border-orange-300 z-0" />

              {stringInterpolations.length > 0 && (
                <StringInterpolationDisplay
                  selectedIndex={selectedIndex}
                  interpolation={stringInterpolations[selectedIndex]?.list}
                  stringInterpolations={stringInterpolations}
                  setStringInterpolations={setStringInterpolations}
                />
              )}

              <AddStringInterpolation
                variable={variable}
                setVariable={setVariable}
                field={field}
                setField={setField}
                onAdd={handleAddStringInterpolation}
              />
            </Modal>
          </div>
        </div>
      </div>
      <div className="flex flex-row p-2 pt-4 gap-4 h-full w-full items-end border-b-2 border-black">
        <div className="flex-grow">
          {/* <InputBox
            inputText={"System Message"}
            isButtonVisabled
            onValueChange={setSysMessage}
          /> */}
        </div>
        <div className="ml-auto">
          <button className="btn btn-lg" onClick={() => go(modelData)}>
            GO
          </button>
        </div>
      </div>
      <div
        className="border-b-2 border-black overflow-auto"
        style={{ height: "55vh" }}
      >
        <div className="skeleton w-full">
          <ScrollShadow>
            <div className="flex flex-row gap-4">
              {modelData.map((data, index) => (
                <Response
                  key={index}
                  data={data}
                  handleOnAddModel={handleOnAddModel}
                  handleLockBtn={() => handleLockBtn(index)}
                  isLastElement={index === modelData.length - 1}
                  handleDeleteModelBtn={() => {
                    setModelData((prevModelData) =>
                      prevModelData.filter((_, i) => i !== index)
                    );
                  }}
                />
              ))}
            </div>
          </ScrollShadow>
        </div>
      </div>
      <div className="pt-4 pb-4 pl-8 pr-8">
        {/* <InputBox
          isButtonDisabled={isButtonDisabled}
          btnName="Add"
          inputText="User Message"
          isUserInputDisabled={isUserInputDisabled}
          showAlert={showAlert}
          btnStyle={
            isButtonDisabled
              ? "cursor-not-allowed rounded-none rounded-r-lg h-full translate-x-[15%]"
              : "text-lime-50 cursor-pointer bg-emerald-300 rounded-none rounded-r-lg h-full translate-x-[15%] "
          }
          onValueChange={(value: string) => {
            setIsButtonDisabled(!value);
          }}
          onClick={(value: string) => {
            handleAddResponseClick(value);
            setIsButtonDisabled(true);

            // chatcompletion and display to model one => add to modelsData
            // chatcompletion of value using selected models and push both value to user and the derived completion to the ModelsData
          }}
        /> */}
        {<AlertModal showAlert={showAlert} onClose={onClose} />}
      </div>
    </div>
  );
};

export default Version_2_0;
