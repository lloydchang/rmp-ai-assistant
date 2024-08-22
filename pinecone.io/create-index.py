# pinecone.io/create-index.py

from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import os

# Load environment variables from the .env.local file in the parent directory
load_dotenv("../.env.local")

# Retrieve the API key from the environment variables
api_key = os.getenv("PINECONE_API_KEY")

# Initialize Pinecone with the API key
pc = Pinecone(api_key=api_key)

# Create the index
pc.create_index(
    name="quickstart",
    dimension=2,  # Replace with your model dimensions
    metric="cosine",  # Replace with your model metric
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)

