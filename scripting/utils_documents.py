#all fields on these document are required

artist_document_local = {
    'artistId': 0,  # int
    'name': '',  # str
    'albumIds': [],  # list of int
    'collaborations': {},  # dict of int, int
    'vocabSize': 0,  # int
    'wordsCounter': {},  # dict of str, int
    'readingLevel': 0.0,  # float
    'numWords': 0,  # int
    'numSongs': 0,  # int
    'numChars': 0,  # int
    'sentiments': [],  # list of float
    'fivePopularSongs': [],  # list of int
    'numChars': 0,  # int

}

album_document_local = {
    'albumId': 0,  # int
    'artistId': [],  # list of int
    'name': '',  # str
    'releaseDate': '',  # str (ISO 8601 date)
    'songs': [],  # list of int
    'numWords': 0,  # int
    'wordsCounter': {},  # dict of str, int
    'vocabSize': 0,  # int
    'sentiments': [],  # list of float
    'collaborations': {},  # dict of int, int
    'numberInDiscography': 0,  # int
    'readingLevel': 0.0,  # float
    'numChars': 0,  # int

}

song_document_local = {
    'songId': 0,  # int
    'albumId': 0,  # int
    'artistId': [],  # list of int
    'name': '',  # str
    'releaseDate': '',  # str (ISO 8601 date)
    'lyrics': '',  # str
    'numWords': 0,  # int
    'wordsCounter': {},  # dict of str, int
    'numUniqueWords': 0,  # int
    'sentiments': [],  # list of float
    'readingLevel': 0.0,  # float
    'collaborations': {},  # dict of int, int
    'numInAlbum': 0,  # int
    'numChars': 0,  # int
}

artist_document_atlas = {
    'artistId': 0,  # int
    'name': '',  # str
    'albumIds': [],  # list of int
    'collaborations': {},  # dict of int, int
    'vocabSize': 0,  # int
    'top25words': {},  # dict of str, int
    'readingLevel': 0,  # int
    'numWords': 0,  # int
    'numSongs': 0,  # int
    'numChars': 0,  # int
    'sentiments': [],  # list of dict of float
    'fivePopularSongs': []  # list of dict of int
}

album_document_atlas = {
    'albumId': 0,  # int
    'artistId': [],  # list of int
    'name': '',  # str
    'releaseDate': '',  # str (ISO 8601 date)
    'songs': [],  # list of int
    'numWords': 0,  # int
    'top25words': {},  # dict of str, int
    'vocabSize': 0,  # int
    'sentiments': [],  # list of float
    'collaborations': {},  # dict of int, int
    'numberInDiscography': 0,  # int
    'readingLevel': 0.0,  # float
    'numChars': 0,  # int
}

song_document_atlas = {
    'songId': 0,  # int
    'albumId': 0,  # int
    'artistId': [],  # list of int
    'name': '',  # str
    'releaseDate': '',  # str (ISO 8601 date)
    'numWords': 0,  # int
    'top25words': {},  # dict of str, int
    'numUniqueWords': 0,  # int
    'sentiments': [],  # list of float
    'readingLevel': 0.0,  # float
    'collaborations': {},  # dict of int, int
    'numInAlbum': 0,  # int
    'numChars': 0,  # int
}



def clear_document(document: dict) -> None:
    for key in document:
        if isinstance(document[key], list):
            document[key] = []
        elif isinstance(document[key], dict):
            document[key] = {}
        elif isinstance(document[key], int):
            document[key] = 0
        elif isinstance(document[key], str):
            document[key] = ''
        elif isinstance(document[key], float):
            document[key] = 0.0
        else:
            document[key] = None