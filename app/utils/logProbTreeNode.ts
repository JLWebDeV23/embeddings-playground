import OpenAI from 'openai';
import { LogProbTreeNode } from './interfaces';

export class LogTree implements LogProbTreeNode {
  token: string;
  id: number;
  logProbs: OpenAI.Chat.Completions.ChatCompletion.Choice;
  children: LogProbTreeNode[] | null;

  constructor(
    token: string,
    id: number,
    logProb: OpenAI.Chat.Completions.ChatCompletion.Choice,
    children: LogProbTreeNode[] | null
  ) {
    this.token = token;
    this.id = id;
    this.logProbs = logProb;
    this.children = children;
  }
}
