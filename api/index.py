import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os



### Create FastAPI instance with custom docs and openapi url
load_dotenv()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://michellechang02.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json"
BASE_URL_2 = "https://api.unsplash.com/search/photos"
ACCESS_KEY = os.getenv("access_key")
MERRIAM_KEY= os.getenv("merriam_api")

@app.get("/")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


@app.get("/unsplash/{word}")
async def unsplash_fetch(word: str):
    response = requests.get(f"{BASE_URL_2}/", params={"query": word, "client_id": ACCESS_KEY})
    if response.status_code == 200:
        data = response.json()
        if data["results"]:
            data = response.json()
            regular_urls = [result["urls"]["regular"] for result in data["results"]]
            return {"regular_urls": regular_urls}
        else:
            return {"error": "No results found"}
    else:
        return {"error": "Unable to fetch photos", "status_code": response.status_code}



@app.get("/dictionary/{word}")
async def dictionary_fetch(word: str):
    response = requests.get(f"{BASE_URL}/{word}?key={MERRIAM_KEY}")
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Unable to fetch definition", "status_code": response.status_code}


# # Run using uvicorn if needed
# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000)