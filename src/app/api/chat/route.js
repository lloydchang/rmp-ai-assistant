import { NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'
import OpenAI from 'openai'

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`

export async function POST(req) {
    const data = await req.json()
    // We'll add more code here in the following steps
    const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()
}

const text = data[data.length - 1].content
const embedding = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text,
  encoding_format: 'float',
})

const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
})

let resultString = ''
results.matches.forEach((match) => {
  resultString += `
  Returned Results:
  Professor: ${match.id}
  Review: ${match.metadata.stars}
  Subject: ${match.metadata.subject}
  Stars: ${match.metadata.stars}
  \n\n`
})
