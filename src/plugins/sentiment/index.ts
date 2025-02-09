import { Plugin, IAgentRuntime } from "@elizaos/core";
import { analyzeSentimentAction } from "../../actions/analyzeSentiment.ts";

export class SentimentPlugin implements Plugin {
    name = "sentiment";
    description = "Analyzes sentiment of text and social media posts";

    async analyzeSentiment(text: string) {
        // Simple sentiment analysis logic
        const words = text.toLowerCase().split(' ');
        const positiveWords = ['good', 'great', 'awesome', 'excellent', 'happy', 'love'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'sad', 'hate'];
        
        let score = 0;
        const emotions = [];
        const keywords = [];

        words.forEach(word => {
            if (positiveWords.includes(word)) {
                score += 1;
                emotions.push('positive');
                keywords.push(word);
            }
            if (negativeWords.includes(word)) {
                score -= 1;
                emotions.push('negative');
                keywords.push(word);
            }
        });

        const normalizedScore = score / words.length;
        
        return {
            score: normalizedScore,
            label: normalizedScore > 0 ? 'positive' : normalizedScore < 0 ? 'negative' : 'neutral',
            emotions: [...new Set(emotions)],
            keywords: [...new Set(keywords)]
        };
    }

    async analyzePost(text: string) {
        const sentiment = await this.analyzeSentiment(text);
        
        return {
            content: text,
            sentiment,
            recommendations: this.generateRecommendations(sentiment),
            risks: this.assessRisks(sentiment)
        };
    }

    private generateRecommendations(sentiment: any) {
        const recommendations = [];
        if (sentiment.score < 0) {
            recommendations.push('Consider using more positive language');
            recommendations.push('Try to focus on constructive feedback');
        }
        return recommendations;
    }

    private assessRisks(sentiment: any) {
        const risks = [];
        if (sentiment.score < -0.5) {
            risks.push('High negative sentiment may impact engagement');
            risks.push('Potential reputation risk');
        }
        return risks;
    }

    register(runtime: IAgentRuntime) {
        runtime.registerAction(analyzeSentimentAction);
    }
}

export const sentimentPlugin = new SentimentPlugin(); 