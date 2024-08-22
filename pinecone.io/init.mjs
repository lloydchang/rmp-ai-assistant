// pinecone.io/init.mjs

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '../.env.local' });

// Retrieve environment variables
const apiKey = process.env.PINECONE_API_KEY;
const projectId = process.env.PINECONE_PROJECT_ID;

if (!apiKey || !projectId) {
  console.error('Error: PINECONE_API_KEY or PINECONE_PROJECT_ID is not defined in .env.local');
  process.exit(1);
}

console.log('Pinecone API Key:', apiKey);
console.log('Pinecone Project ID:', projectId);

async function testFetch() {
  try {
    const response = await fetch('https://api.pinecone.io/v1/indexes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // Ensure Bearer token format
        'x-project-id': projectId, // Include project ID as required
        'Content-Type': 'application/json',
      },
    });

    // Log response status and text
    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Text:', text);

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// Call the test function
testFetch();

