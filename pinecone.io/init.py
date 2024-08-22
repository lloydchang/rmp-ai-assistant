# pinecone.io/init.py

from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os

# Load environment variables from the .env.local file
load_dotenv("../.env.local")

# Retrieve the API key from the environment variables
api_key = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone with the API key
pc = Pinecone(api_key=api_key)
