from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://nirup:nirup@cluster0.fm1ehpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)

db = client["college_db"]