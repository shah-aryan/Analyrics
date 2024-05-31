artist_document = {
    'i': 0,  # Required field
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

album_document = {
    'albumId': 0,  # Required field
    'artistId': [],  # Required field, assuming the sample artist has ID 1
    'name': 'Sample Album',  # Required field
    'songs': [],  # Required field, assuming a song has ID 1
    'genre': None,  # Nullable field
    'overallAlbumSentiment': None,  # Nullable field
    'varianceOfSentimentsOfSongs': None,  # Nullable field
    'toneMood': None,  # Nullable field
    'emotionIntensity': None  # Nullable field
}

song_document = {
    'songId': 0,  # Required field
    'albumId': 0,  # Required field, assuming the sample album has ID 1
    'artistId': [],  # Required field, assuming the sample artist has ID 1
    'lyrics': None,  # Nullable field
    'numberOfUniqueWords': None,  # Nullable field
    'genre': None,  # Nullable field
    'moodTone': None,  # Nullable field
    'emotionIntensity': None  # Nullable field
}