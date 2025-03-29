require('dotenv').config();
import { useEffect, useState } from 'react';
import styles from './ModelCompare.module.css';
import ModelHeader from '@/app/components/ModelHeader/ModelHeader';
// import { modelResponse } from "@/app/utils/modelProcessing";
import InputBox from '@/app/components/InputBox/InputBox';
import UserAssistantResult from '@/app/components/UserAssistantResult/UserAssistantResult';
import InputCard from '@/app/components/InputCard/InputCard';
import { CardData } from '@/app/utils/interfaces';

// future implementation
// lock boolean
// arr of models
export type ModelsData = {
  firstModel: {
    model: string | '';
    subModel: string | '';
    messages: any[] | null;
  } | null;
  secondModel: {
    model: string | '';
    subModel: string | '';
    messages: any[] | null;
  } | null;
  score: (number | null)[];
} | null;

const ModelCompare = () => {
  const [modelsData, setModelsData] = useState<ModelsData | null>(null);
  const [sysMessage, setSysMessage] = useState<string>('');
  const [messageUpdated, setMessageUpdated] = useState<boolean>(false);
  const [cards, setCards] = useState<CardData[]>([{ x: '', y: '' }]);

  const addCard = () => {
    setCards([...cards, { x: '', y: '' }]);
  };

  // useEffect(() => {
  //     const fetchData = async () => {
  //         if (modelsData !== null && messageUpdated) {
  //             const response = await modelResponse(modelsData);
  //             // handle the response
  //             setModelsData(response);
  //             setMessageUpdated(false); // Reset the messageUpdated flag
  //         }
  //     };

  //     fetchData();
  // }, [messageUpdated, modelsData]); // Depend only on messageUpdated

  const generateModelsData = async (value: string) => {
    const message = { role: 'user', content: value };
    try {
      setModelsData((prevModelsData: ModelsData) => {
        const updatedData = {
          ...prevModelsData,
          firstModel: {
            model: prevModelsData?.firstModel?.model || '',
            subModel: prevModelsData?.firstModel?.subModel || '',
            messages: [
              ...(prevModelsData?.firstModel?.messages || []),
              message,
            ],
          },
          secondModel: {
            model: prevModelsData?.secondModel?.model || '',
            subModel: prevModelsData?.secondModel?.subModel || '',
            messages: [
              ...(prevModelsData?.secondModel?.messages || []),
              message,
            ],
          },
          score: prevModelsData?.score || [],
        };

        if (sysMessage) {
          const sysMsg = { role: 'system', content: sysMessage };
          if (updatedData.firstModel.messages[0]?.role === 'system') {
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
    } catch (error) {
      console.error('Error Message:', error);
    }
  };

  const handleCardInputChange = (
    index: number,
    field: keyof CardData,
    value: string
  ) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const collectCardData = () => {
    // Here you can do whatever you need with the card data
    console.log(cards);
  };

  const handleOnSubModelChange = (model: string, subModel: string) => {
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
  };
  return (
    <div className={styles.modelCompare}>
      <div className="flex  flex-row gap-10 mt-2 mb-1">
        <ModelHeader
          dropdownContentDirection="right"
          onSubModelChange={handleOnSubModelChange}
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
        inputText={'System Messsage'}
        isButtonDisabled
        btnStyle="top-2"
        handleInput={(e) => {
          setSysMessage(e.target.value);
        }}
      />
      {/* toggle lock field */}
      {/* <textarea className={isClicked ? styles.textAreaClicked : styles.textArea}>
        Your text here
      </textarea> */}
      {/* <button onClick={() => setIsClicked(!isClicked)}>Change Color</button> */}
      <div className="flex flex-col mt-2 mb-2 ">
        <div className="flex flex-row gap-4">
          {cards.map((card, index) => (
            <InputCard
              key={index}
              index={index}
              x={card.x}
              y={card.y}
              onInputChange={handleCardInputChange}
            />
          ))}
          <button
            className="btn w-30 bg-transparent border-emerald-600 opacity-70 text-white text-lg h-full border-l-0"
            onClick={addCard}
          >
            +
          </button>
        </div>
      </div>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={collectCardData}
      >
        Collect Card Data
      </button>
      <UserAssistantResult modelsData={modelsData} />

      <div className="mt-2">
        <InputBox
          btnName="Add"
          inputText="User Message"
          btnStyle="rounded-none rounded-r-lg h-full translate-x-[15%]"
          onSubmit={(value: string) => {
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
