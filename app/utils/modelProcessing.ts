import Anthropic from "@anthropic-ai/sdk";
import similarity from "compute-cosine-similarity";
import dotenv from "dotenv";
import { Groq } from "groq-sdk";
import OpenAI from "openai";
import { ModelsData } from "../pages/ModelCompare/ModelCompare";
import { upsertStringInterpolations } from "./functions";
import { Message, ModelData, StringInterpolations } from "./interfaces";
dotenv.config();

type Model = {
    model: string;
    subModel: string;
    apiKey: string;
    messages: any[];
};

type ClaudeMessage = {
    role: "user" | "assistant";
    content: string;
};

type ClaudeSystemMessage = {
    role: "system";
    content: string;
};

type Response =
    | Groq.Chat.Completions.ChatCompletion
    | OpenAI.Chat.Completions.ChatCompletion
    | Anthropic.Messages.Message
    | null;

export const chatCompletion = async (model: ModelData) => {
    let response: Response = null;
    let newMessage: Message;
    let groq: Groq;

    model = {
        ...model,
        messages: model.messages.map((message: any) => {
            return {
                role: JSON.parse(JSON.stringify(message.role.toLowerCase())),
                content: message.content,
            };
        }),
    };

    switch (model.model) {
        case "OpenAI": {
            console.log(model, model.apiKey);
            const apiKey = model.apiKey.find((key) => key.name === "OpenAI");
            if (!apiKey) {
                throw new Error("API Key not found");
            }
            const client = new OpenAI({
                apiKey: apiKey.apiKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await client.chat.completions.create({
                    messages: JSON.parse(JSON.stringify(model.messages)),
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }
            break;
        }

        case "LlaMA 3": {
            console.log(model.apiKey, model);
            const apiKey = model.apiKey.find(
                (key) => key.name === "Groq (Llama | Mistral | Gemma)"
            );
            if (!apiKey) {
                throw new Error("API Key not found");
            }
            groq = new Groq({
                apiKey: apiKey.apiKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: JSON.parse(JSON.stringify(model.messages)),
                    model: model.subModel,
                });
                console.log(response);
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }
            break;
        }
        case "Gemma":
            const apiKey = model.apiKey.find(
                (key) => key.name === "Groq (Llama | Mistral | Gemma)"
            );
            if (!apiKey) {
                throw new Error("API Key not found");
            }
            groq = new Groq({
                apiKey: apiKey.apiKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: JSON.parse(JSON.stringify(model.messages)),
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }
            break;

        case "Mistral": {
            const apiKey = model.apiKey.find(
                (key) => key.name === "Groq (Llama | Mistral | Gemma)"
            );
            if (!apiKey) {
                throw new Error("API Key not found");
            }
            groq = new Groq({
                apiKey: apiKey.apiKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: JSON.parse(JSON.stringify(model.messages)),
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
                break;
            }
        }

        case "Claude": {
            const apiKey = model.apiKey.find((key) => key.name === "Claude");
            if (!apiKey) {
                throw new Error("API Key not found");
            }
            const domain = window?.location?.origin || "";
            const anthropic = new Anthropic({
                apiKey: apiKey.apiKey,
                baseURL: domain + "/anthropic/",
            });
            const [systemMessage, ...messages] = model.messages as (
                | ClaudeMessage
                | ClaudeSystemMessage
            )[];
            if (systemMessage.role !== "system") {
                throw new Error("First message must be a system message");
            }
            try {
                response = await anthropic.messages.create({
                    model: model.subModel,
                    max_tokens: 1024,
                    system: systemMessage.content,
                    messages: messages as ClaudeMessage[],
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }
        }
    }
    if (model.model === "Claude" && response) {
        newMessage = {
            role: (response as Anthropic.Messages.Message).role || "",
            content:
                (response as Anthropic.Messages.Message).content[0].text || "",
        };
    } else {
        newMessage = {
            role: (
                response as
                    | Groq.Chat.Completions.ChatCompletion
                    | OpenAI.Chat.Completions.ChatCompletion
            )?.choices[0].message.role,
            content:
                (
                    response as
                        | Groq.Chat.Completions.ChatCompletion
                        | OpenAI.Chat.Completions.ChatCompletion
                )?.choices[0].message.content || "",
        };
    }
    return newMessage;
};

// select model and return response from the model
// export const modelResponse = async (modelData: ModelData) => {
//   const firstModelResponse = await chatCompletion(modelData);
//   const secondModelResponse = await chatCompletion(modelData);
//   // similairty score
//   const similarityScore = await createCosineSimilarity(
//     firstModelResponse?.content ?? null,
//     secondModelResponse?.content ?? null
//   );
//   // add to modelsData
//   modelData.messages?.push(firstModelResponse);
//   modelData.messages?.push(secondModelResponse);
//   modelData.messages.score.push(similarityScore);

//   return modelsData;
// };

export const createEmbedding = async (input: string | []) => {
    let embedding: number[] = [];
    try {
        embedding = (
            await new OpenAI({
                apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                dangerouslyAllowBrowser: true,
            }).embeddings.create({
                model: "text-embedding-3-small",
                input: input,
            })
        ).data[0].embedding;
    } catch (error) {
        console.error("Error in Create OpenAI Embeddings:", error);
    }
    return embedding;
};

// compare cosine similarity between two model response
// TODO: function takes input for now, will need to look into taking as []
export const createCosineSimilarity: (
    response1: string | null,
    response2: string | null
) => Promise<number | null> = async (
    response1: string | null,
    response2: string | null
) => {
    // Embeddings
    const embedding1: number[] = await createEmbedding(response1!);
    const embedding2: number[] = await createEmbedding(response2!);

    const cosineSimilarity: NodeRequire = require("compute-cosine-similarity");

    const similarityScore = similarity(embedding1, embedding2);
    // const roundedSimilarity = Number(similarityScore?.toFixed(7));
    return similarityScore;
};

// create new model data
export const getNewModelData = async (
    originalModelData: ModelData,
    newModelData: ModelData
): Promise<ModelData> => {
    let newModelDataCopy: ModelData = JSON.parse(JSON.stringify(newModelData)); // create a copy of the newModelData
    let tempModelDataCopy: ModelData = JSON.parse(JSON.stringify(newModelData)); // only to use for chatcompletion

    const systemMessage = originalModelData.messages.find(
        (message) => message.role === "system"
    );
    if (systemMessage) {
        newModelDataCopy.messages.push(systemMessage);
        tempModelDataCopy.messages.push(systemMessage);
    }
    for (let index = 0; index < originalModelData.messages.length; index++) {
        const message = originalModelData.messages[index];
        if (message.role.toLowerCase() === "user") {
            newModelDataCopy.messages.push(message);
            console.log(newModelDataCopy, "here");
            tempModelDataCopy.messages.push(message);
        } else if (message.role.toLowerCase() === "assistant") {
            const newMessage = JSON.parse(
                JSON.stringify(await chatCompletion(tempModelDataCopy))
            );

            newMessage.score = await createCosineSimilarity(
                newMessage?.content,
                message.content
            );

            newModelDataCopy.messages.push(newMessage);
            tempModelDataCopy.messages.push(message);
        }
    }
    return newModelDataCopy;
};

type CreateNewModelDataProps = {
    modelData: ModelData[][];
    newModelData: ModelData;
    systemMessage: string;
    stringInterpolations: StringInterpolations[];
};

// Add New Model Button
export const createNewModelData = async (
    props: CreateNewModelDataProps
): Promise<ModelData[][]> => {
    const { modelData, newModelData, systemMessage, stringInterpolations } =
        props;

    const changedSysMessageData = upsertStringInterpolations(
        systemMessage,
        modelData,
        stringInterpolations
    );
    const updatedData = await Promise.all(
        changedSysMessageData.map(async (colData: ModelData[]) => {
            return [
                ...colData,
                await getNewModelData(colData[0], newModelData),
            ];
        })
    );

    return updatedData;
};

type goProps = {
    modelData: ModelData[][];
    systemMessage: string;
    stringInterpolations: StringInterpolations[];
};

// GO Button
export const go = async (props: goProps) => {
    const { modelData, systemMessage, stringInterpolations } = props;

    const changedSysMessageData = upsertStringInterpolations(
        systemMessage,
        modelData,
        stringInterpolations
    );

    try {
        const newModelData = await Promise.all(
            changedSysMessageData.map(async (colData) => {
                const processedData = await Promise.all(
                    colData.map(async (data) => {
                        if (!data.locked) {
                            // Create an empty model data object
                            const emptyData = {
                                ...data,
                                messages: [],
                            };
                            const createdNewModelData = await getNewModelData(
                                colData[0],
                                emptyData
                            );
                            // Return the empty data object
                            return createdNewModelData;
                        }
                        // If the data is locked, return it as is
                        return data;
                    })
                );
                return processedData;
            })
        );
        return newModelData;
    } catch (error) {
        console.error("Error in go:", error);
        throw error;
    }
};

type InsertUserPromptProps = {
    modelData: ModelData[][];
    userPrompt: string;
    systemMessage: string;
    stringInterpolations: StringInterpolations[];
};

// Add User Input Button
export const insertUserPrompt = async (
    props: InsertUserPromptProps
): Promise<ModelData[][] | undefined> => {
    const { modelData, userPrompt, systemMessage, stringInterpolations } =
        props;

    // Generate the new system message data
    const changedSysMessageData = upsertStringInterpolations(
        systemMessage,
        modelData,
        stringInterpolations
    );

    try {
        if (!modelData) {
            throw new Error("modelData is undefined");
        }

        const newModelData = await Promise.all(
            changedSysMessageData.map(async (colData) => {
                const baseModelDataHistoryMessages = colData[0].messages;

                return Promise.all(
                    colData.map(async (data, index) => {
                        let baseModelDataMessage: string = "";

                        if (index === 0) {
                            const newData = {
                                ...data,
                                messages: [
                                    ...data.messages,
                                    { role: "user", content: userPrompt },
                                ],
                            };
                            data = newData;
                            let newMessage;
                            try {
                                newMessage = await chatCompletion(data);
                            } catch (error) {
                                console.log(error);
                                throw error;
                            }
                            baseModelDataMessage = newMessage!.content!;

                            const assistantMessage: Message = {
                                role: newMessage!.role,
                                content: newMessage!.content!,
                            };
                            return {
                                ...data,
                                messages: [...data.messages, assistantMessage],
                            };
                        } else {
                            const newData = {
                                ...data,
                                messages: [
                                    ...data.messages,
                                    { role: "user", content: userPrompt },
                                ],
                            };
                            data = newData;
                            let newMessage;

                            try {
                                newMessage = JSON.parse(
                                    JSON.stringify(await chatCompletion(data))
                                );
                            } catch (error) {
                                console.log(newMessage);
                            }

                            // Use newMessage as needed

                            const assistantMessage: Message = {
                                role: newMessage!.role,
                                content: newMessage!.content!,
                                score:
                                    (await createCosineSimilarity(
                                        baseModelDataMessage,
                                        newMessage!.content!
                                    )) || undefined,
                            };

                            return {
                                ...data,
                                messages: [...data.messages, assistantMessage],
                            };
                        }
                    })
                );
            })
        );

        return newModelData;
    } catch (error) {
        console.error("Error in insertUserPrompt:", error);
        throw error;
    }
};

class ModelError extends Error {
    constructor(model: string, subModel: string, message: string) {
        super(message);
        this.name = "ModelError";
        this.model = model;
        this.subModel = subModel;
    }
    model: string;
    subModel: string;
}

// Define the error handling function
const handleError = (
    model: string,
    subModel: string,
    error: Error
): ModelError => {
    return new ModelError(model, subModel, error.message);
};
