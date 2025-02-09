import { Action, ActionExample, Memory, IAgentRuntime } from "@elizaos/core";
import { SentimentAnalyzer, TwitterPost } from "./provider.ts";

export const sentimentAction: Action = {
    name: "ANALYZE_SENTIMENT",
    similes: [
        "analyze sentiment",
        "analyze posts",
        "show posts",
        "check sentiment",
        "sentiment analysis",
        "analyze this",
        "analyze message"
    ],
    description: "Analyze sentiment of text content and classify as positive, negative, or neutral",

    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text?.length > 0;
    },

    handler: async (runtime, message) => {
        try {
            // Add user's message as first post
            const SAMPLE_POSTS: TwitterPost[] = [
                {
                    id: '0',
                    text: message.content.text,
                    userId: "user",
                    createdAt: new Date()
                },
                {
                    id: '1',
                    text: `BTC smashing through ATH! $69k was just the beginning! 🚀`,
                    userId: "trader1",
                    createdAt: new Date()
                },
                {
                    id: '2',
                    text: `$BTC is dead. Bear market confirmed. Selling everything.`,
                    userId: "trader2",
                    createdAt: new Date()
                },
                {
                    id: '3',
                    text: `Bitcoin holding steady at support. Watching for next move. #BTC`,
                    userId: "trader3",
                    createdAt: new Date()
                },
                {
                    id: '4',
                    text: `Incredible gains for BTC today! New ATH incoming! 💪`,
                    userId: "trader4",
                    createdAt: new Date()
                },
                {
                    id: '5',
                    text: `Lost everything on Bitcoin. This market is manipulated.`,
                    userId: "trader5",
                    createdAt: new Date()
                }
            ];

            const analyzer = new SentimentAnalyzer();
            const results = analyzer.classifyPosts(SAMPLE_POSTS);

            console.log("\n=== SENTIMENT ANALYSIS RESULTS ===\n");

            const analyzePost = (post: TwitterPost) => {
                const sentiment =
                    results.positive.includes(post) ? 'positive' :
                        results.negative.includes(post) ? 'negative' : 'neutral';
                const score = analyzer.analyzeSentiment(post.text);

                return {
                    text: post.text,
                    sentiment,
                    score,
                    userId: post.userId
                };
            };

            const analysisResults = SAMPLE_POSTS.map(analyzePost);

            // Log detailed analysis
            analysisResults.forEach(result => {
                console.log("-----------------------------------");
                console.log(`Post: ${result.text}`);
                console.log(`Sentiment: ${result.sentiment.toUpperCase()}`);
                console.log(`Score: ${result.score.toFixed(2)}`);
                console.log(`User: ${result.userId}`);
                console.log("-----------------------------------\n");
            });

            // Format response with emojis and scores
            const formattedPosts = analysisResults.map(result => {
                const emoji =
                    result.sentiment === 'positive' ? '📈' :
                        result.sentiment === 'negative' ? '📉' : '➖';

                return `${emoji} ${result.sentiment.toUpperCase()} (${result.score.toFixed(2)}):\nPost: ${result.text}\nUser: ${result.userId}\n`;
            }).join('\n');

            return {
                content: {
                    text: `Sentiment Analysis Results:\n\n${formattedPosts}`,
                    analysis: {
                        posts: SAMPLE_POSTS,
                        results: analysisResults
                    }
                }
            };
        } catch (error) {
            console.error('Error in sentiment analysis:', error);
            throw error;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "BTC smashing through ATH! $69k was just the beginning! 🚀"
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: `=== ALL POSTS SENTIMENT ANALYSIS ===

-----------------------------------
Post: BTC smashing through ATH! $69k was just the beginning! 🚀
Label: positive
User: user1

Post: $BTC is dead. Bear market confirmed. Selling everything.
Label: negative
User: user1
-----------------------------------`,
                    action: "ANALYZE_SENTIMENT"
                }
            }
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "$BTC is dead. Bear market confirmed. Selling everything."
                }
            },
            {
                user: "{{user2}}",
                content: {
                    text: `=== ALL POSTS SENTIMENT ANALYSIS ===

-----------------------------------
Post: $BTC is dead. Bear market confirmed. Selling everything.
Label: negative
User: user1

Post: Bitcoin holding steady at support. Watching for next move. #BTC
Label: neutral
User: user1
-----------------------------------`,
                    action: "ANALYZE_SENTIMENT"
                }
            }
        ]
    ] as ActionExample[][]
}; 