// import { Action, ActionExample, Memory, IAgentRuntime } from "@elizaos/core";
// import { SentimentAnalyzer, TwitterPost } from "../providers/sentimentAnalyzer.ts";
// import { getFolderByUserAddress } from "../getFolderData.ts";

// export const analyzeSentimentAction: Action = {
//     name: "ANALYZE_SENTIMENT",
//     similes: [
//         "CHECK_SENTIMENT", "ANALYZE_POSTS", "ANALYZE", "SENTIMENT", "show posts", "analyze posts", "show me the posts", "show me the sentiment"
//     ],
//     description: "Analyze sentiment of text content and classify as positive, negative, or neutral",
    
//     validate: async (runtime: IAgentRuntime, message: Memory) => {
//         return message.content?.text?.length > 0;
//     },

//     handler: async (runtime, message) => {
//         try {
//             // Get posts from Tusky API
//             const tuskyData = await getFolderByUserAddress(message.content.text);
            
//             if (typeof tuskyData === 'string') {
//                 throw new Error(tuskyData); // Handle error message from API
//             }

//             console.log("\n=== TUSKY RAW DATA ===");
//             console.log("Number of files found:", tuskyData.length);
            
//             // Debug first file's data
//             if (tuskyData[0]) {
//                 console.log("\nFirst file data array:");
//                 console.log(JSON.stringify(tuskyData[0].data, null, 2));
//             }
            
//             // Convert Tusky data to TwitterPosts
//             const SAMPLE_POSTS: TwitterPost[] = [
//                 // Add user's message as first post
//                 {
//                     id: '0',
//                     text: message.content.text,
//                     userId: "user",
//                     createdAt: new Date()
//                 },
//                 // Convert Tusky data to TwitterPosts
//                 ...tuskyData.reduce((acc: TwitterPost[], item: any) => [
//                     ...acc,
//                     ...(item.data || []).map((post: any, postIndex: number) => ({
//                         id: `${acc.length + 1}-${postIndex}`,
//                         text: post.text || '',
//                         userId: post.authorUsername || `tusky_user_${acc.length + 1}_${postIndex}`,
//                         createdAt: new Date(post.createdAt || Date.now())
//                     }))
//                 ], [])
//             ];

//             console.log("\n=== CONVERTED POSTS ===");
//             console.log("Number of posts (including user message):", SAMPLE_POSTS.length);
//             console.log("First converted post:", JSON.stringify(SAMPLE_POSTS[1], null, 2));

//             const analyzer = new SentimentAnalyzer();
//             const results = analyzer.classifyPosts(SAMPLE_POSTS);
            
//             console.log("\n=== SENTIMENT ANALYSIS RESULTS ===\n");
            
//             const analyzePost = (post: TwitterPost) => {
//                 const sentiment = 
//                     results.positive.includes(post) ? 'positive' :
//                     results.negative.includes(post) ? 'negative' : 'neutral';
//                 const score = analyzer.analyzeSentiment(post.text);
                
//                 return {
//                     text: post.text,
//                     sentiment,
//                     score,
//                     userId: post.userId
//                 };
//             };

//             const analysisResults = SAMPLE_POSTS.map(analyzePost);
            
//             // Log detailed analysis
//             analysisResults.forEach(result => {
//                 console.log("-----------------------------------");
//                 console.log(`Post: ${result.text}`);
//                 console.log(`Sentiment: ${result.sentiment.toUpperCase()}`);
//                 console.log(`Score: ${result.score.toFixed(2)}`);
//                 console.log(`User: ${result.userId}`);
//                 console.log("-----------------------------------\n");
//             });

//             // Format response with emojis and scores
//             const formattedPosts = analysisResults.map(result => {
//                 const emoji = 
//                     result.sentiment === 'positive' ? '📈' :
//                     result.sentiment === 'negative' ? '📉' : '➖';
                    
//                 return `${emoji} ${result.sentiment.toUpperCase()} (${result.score.toFixed(2)}):\nPost: ${result.text}\nUser: ${result.userId}\n`;
//             }).join('\n');

//             return {
//                 content: {
//                     text: `Sentiment Analysis Results:\n\n${formattedPosts}`,
//                     analysis: {
//                         posts: SAMPLE_POSTS,
//                         results: analysisResults
//                     }
//                 }
//             };
//         } catch (error) {
//             console.error('Error in sentiment analysis:', error);
//             throw error;
//         }
//     },

//     examples: [
//         [
//             {
//                 user: "{{user1}}",
//                 content: {
//                     text: "BTC smashing through ATH! $69k was just the beginning! 🚀"
//                 }
//             },
//             {
//                 user: "{{user2}}",
//                 content: {
//                     text: `=== ALL POSTS SENTIMENT ANALYSIS ===

// -----------------------------------
// Post: BTC smashing through ATH! $69k was just the beginning! 🚀
// Label: positive
// User: user1

// Post: $BTC is dead. Bear market confirmed. Selling everything.
// Label: negative
// User: user1
// -----------------------------------`,
//                     action: "ANALYZE_SENTIMENT"
//                 }
//             }
//         ],
//         [
//             {
//                 user: "{{user1}}",
//                 content: {
//                     text: "$BTC is dead. Bear market confirmed. Selling everything."
//                 }
//             },
//             {
//                 user: "{{user2}}",
//                 content: {
//                     post: `=== ALL POSTS SENTIMENT ANALYSIS ===

// -----------------------------------
// Post: $BTC is dead. Bear market confirmed. Selling everything.
// Label: negative
// User: user1

// Post: Bitcoin holding steady at support. Watching for next move. #BTC
// Label: neutral
// User: user1
// -----------------------------------`,
//                     action: "ANALYZE_SENTIMENT"
//                 }
//             }
//         ]
//     ] as ActionExample[][]
// }; 


import { Action, ActionExample, Memory, IAgentRuntime } from "@elizaos/core";
import { SentimentAnalyzer, TwitterPost } from "../providers/sentimentAnalyzer.ts";
import { getFolderByUserAddress } from "../getFolderData.ts";

export const analyzeSentimentAction: Action = {
    name: "ANALYZE_SENTIMENT",
    similes: [
        "CHECK_SENTIMENT", "ANALYZE_POSTS", "ANALYZE", "SENTIMENT", "show posts", "analyze posts"
    ],
    description: "Analyze sentiment of text content and classify as positive, negative, or neutral",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        return message.content?.text?.length > 0;
    },

    handler: async (runtime, message) => {
        try {
            // Get posts from Tusky API
            const tuskyData = await getFolderByUserAddress(message.content.text);
            
            if (typeof tuskyData === 'string') {
                throw new Error(tuskyData);
            }

            const SAMPLE_POSTS: TwitterPost[] = [
                {
                    id: '0',
                    text: message.content.text,
                    userId: "user",
                    createdAt: new Date()
                },
                ...tuskyData.reduce((acc: TwitterPost[], item: any) => [
                    ...acc,
                    ...(item.data || []).map((post: any, postIndex: number) => ({
                        id: `${acc.length + 1}-${postIndex}`,
                        text: post.text || '',
                        userId: post.authorUsername || `tusky_user_${acc.length + 1}_${postIndex}`,
                        createdAt: new Date(post.createdAt || Date.now())
                    }))
                ], [])
            ];

            const analyzer = new SentimentAnalyzer();
            const results = analyzer.classifyPosts(SAMPLE_POSTS);

            const analyzePost = (post: TwitterPost) => {
                const sentiment = 
                    results.positive.includes(post) ? 'positive' :
                    results.negative.includes(post) ? 'negative' : 'neutral';
                return {
                    text: post.text,
                    sentiment,
                    userId: post.userId
                };
            };

            const analysisResults = SAMPLE_POSTS.map(analyzePost);

            // Create callback for each post
            const callbacks = analysisResults.map(result => ({
                content: {
                    post: result.text,
                    label: result.sentiment
                },
                params: {
                    post: result.text,
                    label: result.sentiment
                }
            }));

            // Log callbacks to console
            console.log("\n=== CALLBACK DATA ===");
            callbacks.forEach((callback, index) => {
                console.log(`Callback #${index + 1}:`);
                console.log(JSON.stringify(callback, null, 2));
            });

            return {
                content: {
                    text: `Sentiment Analysis Completed for ${SAMPLE_POSTS.length} posts.`,
                    analysis: analysisResults
                },
                callbacks: callbacks
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
                    text: `=== ALL POSTS SENTIMENT ANALYSIS ===\n\n-----------------------------------\nPost: BTC smashing through ATH! $69k was just the beginning! 🚀\nLabel: positive\nUser: user1\n\nPost: $BTC is dead. Bear market confirmed. Selling everything.\nLabel: negative\nUser: user1\n-----------------------------------`,
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
                    text: `=== ALL POSTS SENTIMENT ANALYSIS ===\n\n-----------------------------------\nPost: $BTC is dead. Bear market confirmed. Selling everything.\nLabel: negative\nUser: user1\n\nPost: Bitcoin holding steady at support. Watching for next move. #BTC\nLabel: neutral\nUser: user1\n-----------------------------------`,
                    action: "ANALYZE_SENTIMENT"
                }
            }
        ]
    ] as ActionExample[][]
};
