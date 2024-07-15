#! for anyone reading this, this script exists to cache the rankings for the leaderboards in MongoDB for O(1) retrieval

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from utils_rankings import *
import json
from bson import ObjectId

# Custom JSON encoder to handle ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)

try:
    # Establish a connection to MongoDB
    client = MongoClient('mongodb://localhost:27017/')  # Replace with your MongoDB URI if different

    # Access the database
    db = client['analyrics']  # Replace with your database name

    # Access the collection
    collection = db['artists']  # Replace with your collection name

    # Iterate through the documents matching the query in the collection
    for document in collection.find():
        handle_rankings(document)
      
    rankings = {
        "most_positive_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_positive_lyrics],
        "most_negative_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_negative_lyrics],
        "largest_vocabulary": [{"document": doc, "score": score} for doc, score in largest_vocabulary],
        "smallest_vocabulary": [{"document": doc, "score": score} for doc, score in smallest_vocabulary],
        "largest_discography": [{"document": doc, "score": score} for doc, score in largest_discography],
        "most_collaborative": [{"document": doc, "score": score} for doc, score in most_collaborative],
        "least_collaborative": [{"document": doc, "score": score} for doc, score in least_collaborative],
        "highest_reading_level": [{"document": doc, "score": round(score, 2)} for doc, score in highest_reading_level],
        "lowest_reading_level": [{"document": doc, "score": round(score, 2)} for doc, score in lowest_reading_level],
        "most_repetitive": [{"document": doc, "score": round(score, 2)} for doc, score in most_repetitive],
        "least_repetitive": [{"document": doc, "score": round(score, 2)} for doc, score in least_repetitive],
        "longest_songs": [{"document": doc, "score": round(score, 0)} for doc, score in longest_songs],
        "most_trusting_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_trusting_lyrics],
        "most_fearful_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_fearful_lyrics],
        "most_surprise_in_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_surprise_in_lyrics],
        "most_joyous_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_joyous_lyrics],
        "most_anticipation_in_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_anticipation_in_lyrics],
        "most_anger_in_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_anger_in_lyrics],
        "most_sad_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_sad_lyrics],
        "most_disgust_in_lyrics": [{"document": doc, "score": round(score, 2)} for doc, score in most_disgust_in_lyrics]
    }

    # Save rankings to a JSON file
    with open('rankings.json', 'w') as json_file:
        json.dump(rankings, json_file, cls=JSONEncoder, indent=4)

except ConnectionFailure as e:
    print(f"Could not connect to MongoDB: {e}")
finally:
    client.close()
