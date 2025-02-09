export interface TwitterPost {
    id: string;
    text: string;
    userId: string;
    createdAt: Date;
}

export class SentimentAnalyzer {
    private positiveWords = ['bullish', 'moon', 'pump', 'ath', 'gain', 'profit', 'up', 'high', 'good', 'great', 'awesome', 'excellent', 'happy', 'love', 'rocket', '🚀', '📈', '💪', 'smashing', 'incredible'];
    private negativeWords = ['bearish', 'dump', 'crash', 'dead', 'loss', 'down', 'low', 'bad', 'terrible', 'awful', 'horrible', 'sad', 'hate', '📉', 'selling', 'bear', 'lost', 'manipulated'];

    analyzeSentiment(text: string): number {
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;

        // Check for emotion indicators
        words.forEach(word => {
            if (this.positiveWords.some(pw => word.includes(pw.toLowerCase()))) {
                score += 1;
            }
            if (this.negativeWords.some(nw => word.includes(nw.toLowerCase()))) {
                score -= 1;
            }
        });

        // Additional context checks
        if (text.includes('!')) score += 0.5;  // Excitement
        if (text.match(/[A-Z]{2,}/)) score += 0.5; // CAPS for emphasis

        return score;
    }

    classifyPosts(posts: TwitterPost[]) {
        const positive: TwitterPost[] = [];
        const negative: TwitterPost[] = [];
        const neutral: TwitterPost[] = [];

        posts.forEach(post => {
            const sentimentScore = this.analyzeSentiment(post.text);

            // Classification based on score thresholds
            if (sentimentScore > 0.5) {
                positive.push(post);
            } else if (sentimentScore < -0.5) {
                negative.push(post);
            } else {
                neutral.push(post);
            }
        });

        return { positive, negative, neutral };
    }
}