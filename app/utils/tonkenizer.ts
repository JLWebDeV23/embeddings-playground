import OpenAI from "openai";

type TokenNode = {
  id: string; // unique identifier, e.g., "0.3"
  token: OpenAI.ChatCompletionTokenLogprob;
  children: TokenNode[];
  completion?: string; // chat completion result
};

type TokenTree = TokenNode[];
