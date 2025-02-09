import { analyzeSentimentAction } from './actions/analyzeSentiment';
import { IAgentRuntime, Memory } from "@elizaos/core";

async function testSentimentAnalysis() {
    try {
        const mockRuntime = {} as IAgentRuntime;
        const mockMemory: Memory = {
            userId: "123e4567-e89b-12d3-a456-426614174000",
            agentId: "987fcdeb-51a2-43d7-9012-345678901234",
            roomId: "550e8400-e29b-41d4-a716-446655440000",
            content: {
                text: "SUI" // Sử dụng từ khóa để test
            }
        };
        
        const result = await analyzeSentimentAction.handler(
            mockRuntime,
            mockMemory
        );
        console.log("Analysis complete!", result);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testSentimentAnalysis(); 