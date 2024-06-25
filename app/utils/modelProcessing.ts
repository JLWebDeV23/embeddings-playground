import {
    Message,
    ModelData,
    StringInterpolations,
    modelSDK,
} from "./interfaces";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";
import { ChatCompletionResponse } from "@mistralai/mistralai";
import { Groq } from "groq-sdk";
import similarity from "compute-cosine-similarity";
import { ModelsData } from "../pages/ModelCompare/ModelCompare";
import { upsertStringInterpolations } from "./functions";
import Anthropic from "@anthropic-ai/sdk";

const testKey = "0";
type Model = {
    model: string;
    subModel: string;
    apiKey: string;
    messages: any[];
};

type Response =
    | ChatCompletionResponse
    | OpenAI.ChatCompletion
    | OpenAI.Chat.Completions.ChatCompletion
    | Anthropic.Message
    | null;

export const chatCompletion = async (model: any) => {
    let content: string | null | Anthropic.TextBlock[] = null;
    let response: Response = null;
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
        case "OpenAI":
            const client = new OpenAI({
                // apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
                apiKey: "0",
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await client.chat.completions.create({
                    messages: model.messages,
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }
            // Extract the content from the response
            content = response?.choices[0]?.message?.content || "";
            break;

        case "LlaMA 3":
            groq = new Groq({
                apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: model.messages,
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }

            content = response?.choices[0]?.message?.content || "";
            break;

        case "Gemma":
            groq = new Groq({
                // apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
                apiKey: testKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: model.messages,
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }

            content = response?.choices[0]?.message?.content || "";
            break;

        case "Mistral":
            groq = new Groq({
                // apiKey: process.env.NEXT_PUBLIC_GROPQ_API_KEY,
                apiKey: testKey,
                dangerouslyAllowBrowser: true,
            });
            try {
                response = await groq.chat.completions.create({
                    messages: model.messages,
                    model: model.subModel,
                });
            } catch (error) {
                if (error instanceof Error) {
                    throw handleError(model.model, model.subModel, error);
                }
            }

            content = response?.choices[0]?.message?.content || "";
            break;

        // case "Claude":
        //   const anthropic = new Anthropic({
        //     apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
        //   });
        //   try {
        //     response = await anthropic.messages.create({
        //       model: model.subModel,
        //       max_tokens: 1024,
        //       messages: model.messages,
        //     });
        //   } catch (error) {
        //     handleError(model.model, model.subModel, JSON.stringify(error));
        //   }
        //   const msg = await anthropic.messages.create({
        //     model: "claude-3-5-sonnet-20240620",
        //     max_tokens: 1024,
        //     messages: [{ role: "user", content: "Hello, Claude" }],
        //   });

        //   break;
    }
    return response?.choices[0].message;
};

// select model and return response from the model
export const modelResponse = async (modelsData: ModelsData) => {
    const firstModelResponse = await chatCompletion(modelsData?.firstModel);
    const secondModelResponse = await chatCompletion(modelsData?.secondModel);
    // similairty score
    const similarityScore = await createCosineSimilarity(
        firstModelResponse?.content ?? null,
        secondModelResponse?.content ?? null
    );
    // add to modelsData
    modelsData?.firstModel?.messages?.push(firstModelResponse);
    modelsData?.secondModel?.messages?.push(secondModelResponse);
    modelsData?.score.push(similarityScore);

    return modelsData;
};

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
        console.log(message.role);
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
    console.log("newModelDataCopy", newModelDataCopy);
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
    console.log("updatedColData", updatedData);

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
