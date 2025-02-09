import { getFolderByUserAddress, getDataFromVault, uploadFile } from './getFolderData.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testTuskyAPI() {
    console.log('\n=== Testing Tusky API ===');
    
    try {
        // Test 1: Upload sample data
        console.log('\n1. Testing Upload:');
        const samplePosts = [
            {
                id: '1',
                text: 'BTC smashing through ATH! $69k was just the beginning! 🚀 #Bitcoin',
                userId: 'trader1',
                createdAt: new Date()
            },
            {
                id: '2',
                text: '$BTC is dead. Bear market confirmed. Selling everything.',
                userId: 'trader2',
                createdAt: new Date()
            }
        ];

        await uploadFile(
            samplePosts as any,
            "crypto_posts",
            (percentage) => console.log(`Upload progress: ${percentage}%`),
            (upload) => console.log('Upload completed successfully'),
            () => console.error('Upload failed')
        );

        // Test 2: Get folder data
        console.log('\n2. Testing getFolderByUserAddress:');
        const folderData = await getFolderByUserAddress("crypto_posts");
        console.log('Folder Data:', JSON.stringify(folderData, null, 2));

        // Test 3: Get vault data
        console.log('\n3. Testing getDataFromVault:');
        const vaultData = await getDataFromVault('dfae36c8-dcbd-4e12-b13e-c7cb95be40ba');
        console.log('Vault Data:', JSON.stringify(vaultData, null, 2));

    } catch (error) {
        console.error('Error during API testing:', error);
    }
}

// Run the tests
testTuskyAPI().catch(console.error);