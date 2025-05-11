from pymongo import MongoClient

# Hardcoded version (simpler for now)
client = MongoClient("mongodb://localhost:27017/")
db = client["hungerbridge_db"]

# Create or get collection
notifications_collection = db["notifications"]
