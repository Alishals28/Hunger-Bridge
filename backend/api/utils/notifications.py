from pymongo import MongoClient
from datetime import datetime

def send_notification(user_id, message):
    client = MongoClient('mongodb://localhost:27017/')
    db = client['hungerbridge_db']  
    collection = db['notifications']

    notification = {
        "user_id": str(user_id),
        "message": message,
        "timestamp": datetime.utcnow()
    }

    collection.insert_one(notification)
