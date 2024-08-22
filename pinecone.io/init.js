// pinecone.io/init.js

const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env.local' });

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
        'Authorization': `Bearer ${apiKey}`,
        'x-project-id': projectId,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Text:', text);

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetch();

