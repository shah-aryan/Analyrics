#all fields on these document are required

ARTIST_LOCAL_TEMPLATE = {
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
    'numChars': 0  # int
}

ALBUM_LOCAL_TEMPLATE = {
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
    'readingLevel': 0.0,  # float
    'numChars': 0  # int
}

SONG_LOCAL_TEMPLATE = {
    'songId': 0,  # int
    'albumId': [],  # int
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
    'numChars': 0  # int
}

ARTIST_ATLAS_TEMPLATE = {
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
    'sentiments': []  # list of dict of float
}

ALBUM_ATLAS_TEMPLATE = {
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
    'readingLevel': 0.0,  # float
    'numChars': 0,  # int
}

SONG_ATLAS_TEMPLATE = {
    'songId': 0,  # int
    'albumId': [],  # int
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



# def clear_document(document: dict) -> None:
#     for key in document:
#         if isinstance(document[key], list):
#             document[key] = []
#         elif isinstance(document[key], dict):
#             document[key] = {}
#         elif isinstance(document[key], int):
#             document[key] = 0
#         elif isinstance(document[key], str):
#             document[key] = ''
#         elif isinstance(document[key], float):
#             document[key] = 0.0
#         else:
#             document[key] = None
