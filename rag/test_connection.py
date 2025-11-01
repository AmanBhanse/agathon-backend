"""
Test Azure OpenAI connection
"""
import os
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

def test_connection():
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT") 
    api_version = os.getenv("OPENAI_API_VERSION", "2025-01-01-preview")
    
    print(f"API Key: {'✅ Set' if api_key else '❌ Missing'}")
    print(f"Endpoint: {endpoint}")
    print(f"API Version: {api_version}")
    
    try:
        client = AzureOpenAI(
            api_key=api_key,
            api_version=api_version,
            azure_endpoint=endpoint
        )
        
        print("\n🧪 Testing embedding...")
        # Try different embedding model names based on the new endpoint
        models_to_try = [
            "text-embedding-3-large", 
            "text-embedding-ada-002", 
            "embedding",
            "text-embedding-3-small",
            "ada"
        ]
        
        embedding_success = False
        for model in models_to_try:
            try:
                print(f"Trying embedding model: {model}")
                response = client.embeddings.create(
                    input=["test text"],
                    model=model
                )
                embedding_dim = len(response.data[0].embedding)
                print(f"✅ Embedding successful with {model}: {embedding_dim} dimensions")
                embedding_success = True
                break
            except Exception as e:
                print(f"❌ Failed with {model}: {str(e)[:100]}...")
                continue
        
        if not embedding_success:
            print("❌ No embedding model worked")
        
        print("\n🧪 Testing chat completion...")
        chat_models_to_try = ["gpt-4.1", "gpt-4", "gpt-35-turbo"]
        
        for model in chat_models_to_try:
            try:
                print(f"Trying chat model: {model}")
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": "Say hello"}],
                    max_tokens=10
                )
                print(f"✅ Chat completion successful with {model}: {response.choices[0].message.content}")
                break
            except Exception as e:
                print(f"❌ Failed with {model}: {str(e)[:100]}...")
                continue
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_connection()