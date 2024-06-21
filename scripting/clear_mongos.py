from pymongo import MongoClient

def clear_collections(db_uri_1, db_name_1, db_name_2):
    # Connect to the first MongoDB database
    client1 = MongoClient(db_uri_1)
    db1 = client1[db_name_1]
    db2 = client1[db_name_2]

    # Function to clear documents in all collections except system collections
    def clear_documents(db, db_name):
        for collection_name in db.list_collection_names():
            if not collection_name.startswith("system."):
                db[collection_name].delete_many({})
                print(f"Cleared all documents in collection {collection_name} in database {db_name}")
            else:
                print(f"Skipped system collection {collection_name} in database {db_name}")

    # Clear all collections in the first database
    clear_documents(db1, db_name_1)

    # Clear all collections in the second database
    clear_documents(db2, db_name_2)

    print("All documents cleared in all collections in both databases.")


# Example usage
db_uri_1 = "mongodb://localhost:27017"
db_name_1 = "analyrics"
db_name_2 = "analyrics_local"


clear_collections(db_uri_1, db_name_1, db_name_2)
