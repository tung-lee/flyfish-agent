import { Plugin, IAgentRuntime } from "@elizaos/core";
import { analyzeSentimentAction } from "../actions/analyzeSentiment.ts";

export class SentimentPlugin implements Plugin {
    name = "sentiment";
    description = "Analyzes sentiment of text and social media posts";

    register(runtime: IAgentRuntime) {
        runtime.registerAction(analyzeSentimentAction);
    }
}

export const sentimentPlugin = new SentimentPlugin(); 