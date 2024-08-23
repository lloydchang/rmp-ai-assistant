// src/app/api/chat/route.js

import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

export async function POST(req) {
    try {
        // Parse the request data
        const data = await req.json();

        // Initialize Pinecone and OpenAI clients
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index('rag').namespace('ns1');
        const openai = new OpenAI();

        // Extract text from the last message in the data
        const text = data[data.length - 1].content;

        // Generate an embedding for the text
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
            encoding_format: 'float',
        });
        const embedding = embeddingResponse.data[0].embedding;

        // Query Pinecone for similar embeddings
        const results = await index.query({
            topK: 5,
            includeMetadata: true,
            vector: embedding,
        });

        // Format the results into a string
        let resultString = '';
        results.matches.forEach((match) => {
            resultString += `
            Returned Results:
            Professor: ${match.id}
            Review: ${match.metadata.stars}
            Subject: ${match.metadata.subject}
            Stars: ${match.metadata.stars}
            \n\n`;
        });

        // Prepare the chat completion request
        const lastMessage = data[data.length - 1];
        const lastMessageContent = lastMessage.content + resultString;
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

        // Create a chat completion with OpenAI
        const completionResponse = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...lastDataWithoutLastMessage,
                { role: 'user', content: lastMessageContent },
            ],
            model: 'gpt-3.5-turbo',
            stream: true,
        });

        // Create a ReadableStream to stream the response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of completionResponse) {
                        const content = chunk.choices[0]?.delta?.content;
                        if (content) {
                            const text = encoder.encode(content);
                            controller.enqueue(text);
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    controller.close();
                }
            },
        });

        // Return the stream as the response
        return new NextResponse(stream);
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
