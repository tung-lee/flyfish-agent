// import { Action, ActionExample, Memory, IAgentRuntime } from "@elizaos/core";
// import { SentimentAnalyzer, TwitterPost } from "../providers/sentimentAnalyzer";
// import { getDataFromVault } from '../getFolderData';
// import { sampleDbPosts } from '../data/samplePosts';

// export const analyzeDbSentimentAction: Action = {
//     name: "ANALYZE_DB_SENTIMENT",
//     similes: [
//         "CHECK_DB_SENTIMENT", "ANALYZE_DB", "DB_SENTIMENT"
//     ],
//     description: "Analyze sentiment from database",

//     validate: async (runtime: IAgentRuntime, message: Memory) => {
//         return message.content?.text?.length > 0;
//     },

//     handler: async (runtime, message) => {
//         try {
//             // Use sample data if vault is not available
//             let dbPosts;
//             try {
//                 const vaultId = process.env.defaultvault;
//                 dbPosts = await getDataFromVault(vaultId);
//             } catch (error) {
//                 console.log('Using sample database posts');
//                 dbPosts = sampleDbPosts;
//             }

//             // Convert database posts to TwitterPost format
//             const posts: TwitterPost[] = dbPosts.map((post: any, index: number) => ({
//                 id: index.toString(),
//                 text: post.content,
//                 userId: post.author,
//                 createdAt: new Date(post.timestamp)
//             }));

//             const analyzer = new SentimentAnalyzer();
//             const results = analyzer.classifyPosts(posts);

//             // Analyze overall trend
//             const generateTrendInsight = (posts: TwitterPost[], results: any) => {
//                 const positive = results.positive.length;
//                 const negative = results.negative.length;
//                 const neutral = posts.length - (positive + negative);
                
//                 const mainTrend = 
//                     positive > negative ? "positive" :
//                     negative > positive ? "negative" : "neutral";

//                 return `Current market trend is ${mainTrend}, with ${positive} positive and ${negative} negative opinions.\n\nDetailed analysis:\n`;
//             };

//             // Analyze each post
//             const analyzePost = (post: TwitterPost) => {
//                 const sentiment = 
//                     results.positive.includes(post) ? 'positive' :
//                     results.negative.includes(post) ? 'negative' : 'neutral';

//                 return {
//                     post: post.text,
//                     sentiment: sentiment,
//                     author: post.userId
//                 };
//             };

//             const analysisResults = posts.map(analyzePost);
//             const trendInsight = generateTrendInsight(posts, results);
            
//             const postAnalysis = analysisResults
//                 .map(result => `- @${result.author}: ${result.post}\n  Sentiment: ${result.sentiment}`)
//                 .join('\n\n');

//             return {
//                 content: {
//                     text: trendInsight + postAnalysis,
//                     posts: analysisResults
//                 }
//             };
//         } catch (error) {
//             console.error('Error in DB sentiment analysis:', error);
//             throw error;
//         }
//     },

//     examples: [] as ActionExample[][]
// }; 