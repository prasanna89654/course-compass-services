import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()

URI = os.getenv("DB_URL")

async def connect_to_mongodb():
    try:
        print(URI)
        client = motor.motor_asyncio.AsyncIOMotorClient(URI)
        db = client.get_database()
        await db.command("ping")
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

