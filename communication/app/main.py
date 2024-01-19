import uvicorn
from fastapi import FastAPI
import asyncio

from config import database

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == "__main__":
    asyncio.run(database.connect_to_mongodb())
    uvicorn.run("main:app", host="0.0.0.0", port=8001)

