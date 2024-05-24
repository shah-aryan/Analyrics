from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['musicProject']  

artist_document = {
    'i': 98735,  # Required field
    'name': 'Sample Artist',  # Required field
    'albums': [],  # Nullable field
    'genre': None,  # Nullable field
    'collaborationNetwork': [],  # Nullable field
    'vocabularySize': None,  # Nullable field
    'mostUsedWords': None,  # Nullable field
    'readingLevel': None,  # Nullable field
    'numberOfWords': None,  # Nullable field
    'numberOfSongs': None,  # Nullable field
    'numberOfCharacters': None,  # Nullable field
    'averageSentenceLength': None,  # Nullable field
    'averageWordLength': None,  # Nullable field
    'averageSongLengthWords': None,  # Nullable field
    'averageSongLengthSeconds': None,  # Nullable field
    'overallToneMood': None  # Nullable field
}
db.artists.insert_one(artist_document)

album_document = {
    'albumId': 98735,  # Required field
    'artistId': [1],  # Required field, assuming the sample artist has ID 1
    'name': 'Sample Album',  # Required field
    'songs': [1],  # Required field, assuming a song has ID 1
    'genre': None,  # Nullable field
    'overallAlbumSentiment': None,  # Nullable field
    'varianceOfSentimentsOfSongs': None,  # Nullable field
    'toneMood': None,  # Nullable field
    'emotionIntensity': None  # Nullable field
}
db.albums.insert_one(album_document)

song_document = {
    'songId': 98735,  # Required field
    'albumId': 1,  # Required field, assuming the sample album has ID 1
    'artistId': [1],  # Required field, assuming the sample artist has ID 1
    'lyrics': "",  # Nullable field
    'numberOfUniqueWords': 0,  # Nullable field
    'genre': None,  # Nullable field
    'moodTone': None,  # Nullable field
    'emotionIntensity': None  # Nullable field
}
db.songs.insert_one(song_document)

client.close()
