import { createChatCompletionLogProb } from "@/app/utils/functions";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OpenAI } from "openai";

type Token = OpenAI.ChatCompletionTokenLogprob;

export interface Node {
    token: Token;
    id: string;
    children: Node[];
}

const initialState: Node = {
    token: { token: "", logprob: 0, bytes: [], top_logprobs: [] },
    id: "0",
    children: [
        {
            token: { token: "Hello", logprob: 0, bytes: [], top_logprobs: [] },
            id: "0.0",
            children: [
                {
                    token: {
                        token: " How",
                        logprob: 0,
                        bytes: [],
                        top_logprobs: [],
                    },
                    id: "0.0.0",
                    children: [
                        {
                            token: {
                                token: " are",
                                logprob: 0,
                                bytes: [],
                                top_logprobs: [],
                            },
                            id: "0.0.0.0",
                            children: [
                                {
                                    token: {
                                        token: " you",
                                        logprob: 0,
                                        bytes: [],
                                        top_logprobs: [],
                                    },
                                    id: "0.0.0.0.0",
                                    children: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

const makeId = (node: Node): string => {
    return `${node.id}.${node.children.length}`;
};

const findParentNode = (node: Node, id: string): Node | undefined => {
    for (const child of node.children) {
        if (child.id === id) {
            return node;
        }
        const found = findParentNode(child, id);
        if (found) {
            return found;
        }
    }
    return undefined;
};

const findNode = (node: Node, id: string): Node | undefined => {
    if (node.id === id) {
        return node;
    }
    for (const child of node.children) {
        const found = findNode(child, id);
        if (found) {
            return found;
        }
    }
    return undefined;
};

export const getTokenHistory = (node: Node): string[] => {
    if (node.token.token) {
        return [node.token.token];
    }
    return node.children.flatMap(getTokenHistory);
};

export const treeSlice = createSlice({
    name: "tree",
    initialState,
    reducers: {
        addSibling: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            /* root cannot have a sibling */
            if (id === "0") {
                return;
            }
            const parent = findParentNode(state, id);
            if (parent) {
                parent.children.push({
                    token: {
                        token: "New sibling",
                        logprob: 0,
                        bytes: [],
                        top_logprobs: [],
                    },
                    id: makeId(parent),
                    children: [],
                });
            }
        },
        addChildren: (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            const node = findNode(state, id);
            if (node) {
                node.children.push({
                    token: {
                        token: "New child",
                        logprob: 0,
                        bytes: [],
                        top_logprobs: [],
                    },
                    id: makeId(node),
                    children: [],
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addAISibling.fulfilled, (state, action) => {
            const { id, newResponse } = action.payload;
            /* push each response in the previous generated child */
            let lastGeneratedId = findParentNode(state, id)?.id || id;
            newResponse.forEach((response) => {
                const parent = findNode(state, lastGeneratedId);
                if (parent) {
                    lastGeneratedId = makeId(parent);
                    parent.children.push({
                        token: response,
                        id: lastGeneratedId,
                        children: [],
                    });
                } else {
                    console.error("Parent not found");
                }
            });
        });
    },
});

const generateNewToken = (token: Token): Token => {
    token.top_logprobs.forEach((topLogProb) => {
        if (topLogProb.token.toLowerCase() !== token.token.toLowerCase()) {
            return topLogProb;
        }
    });
    return token;
};

export const addAISibling = createAsyncThunk(
    "tree/addAISibling",
    async ({
        id,
        token,
        tokenHistory,
    }: {
        id: string;
        token: Token;
        tokenHistory: string[];
    }) => {
        if (id === "0") {
            console.error("Root cannot have a sibling");
            return {
                id: "0",
                newResponse: [],
            };
        }
        const newToken = generateNewToken(token);
        const generateToken: OpenAI.ChatCompletionTokenLogprob = {
            ...token,
            token: newToken.token,
            top_logprobs: token.top_logprobs,
        };
        const logProbInput =
            tokenHistory
                .map((parentToken) => {
                    return parentToken;
                })
                .join("") + generateToken.token;
        const res = await createChatCompletionLogProb(logProbInput);
        const response = res.logprobs?.content;
        if (!response) {
            throw new Error("No response");
        }
        const newResponse: typeof response = [generateToken, ...response];
        return {
            id,
            newResponse,
        };
    }
);

export const { addSibling } = treeSlice.actions;
export default treeSlice.reducer;
