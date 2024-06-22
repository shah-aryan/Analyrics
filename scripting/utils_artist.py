from typing import List, Dict, Any
from collections import Counter

def get_id_artist(artist_obj: dict, local_artist_document: dict, atlas_artist_document: dict) -> str:
    artist_id = artist_obj['sections'][0]['hits'][0]['result']['id']
    local_artist_document['artistId'] = artist_id
    atlas_artist_document['artistId'] = artist_id
    return artist_id

def get_artist_name(artist_obj: dict, local_artist_document: dict, atlas_artist_document: dict) -> str:
    artist_name = artist_obj['sections'][0]['hits'][0]['result']['name']
    local_artist_document['name'] = artist_name
    atlas_artist_document['name'] = artist_name
    return artist_name

def get_num_songs_artist(albums_documents: list, local_artist_document: dict, atlas_artist_document: dict) -> int:
    num_songs = sum(album_document["numTracks"] for album_document in albums_documents)
    local_artist_document['numSongs'] = num_songs
    atlas_artist_document['numSongs'] = num_songs
    return num_songs

def get_vocabulary_size_artist(unique_words_set_artist: set, local_artist_document: dict, atlas_artist_document: dict) -> int:
    vocab_size = len(unique_words_set_artist)
    local_artist_document['vocabSize'] = vocab_size
    atlas_artist_document['vocabSize'] = vocab_size
    return vocab_size

def get_total_words_discography_artist(albums_documents_local: list, local_artist_document: dict, atlas_artist_document: dict) -> int:
    total_words = sum(album_document['numWords'] for album_document in albums_documents_local)
    local_artist_document['numWords'] = total_words
    atlas_artist_document['numWords'] = total_words
    return total_words

def get_collaborations_artist(albums_documents_local: List[Dict[str, Any]], local_artist_document: Dict[str, Any], atlas_artist_document: Dict[str, Any]) -> Counter:
    collaborations = Counter()
    for album_document in albums_documents_local:
        collaborations.update(album_document['collaborations'])
    
    local_artist_document['collaborations'] = collaborations
    atlas_artist_document['collaborations'] = collaborations
    return collaborations


def get_sentiments_artist(albums_documents_local: list, local_artist_document: dict, atlas_artist_document: dict) -> list:
    sentiments = [0] * 10
    for album_document in albums_documents_local:
        for i in range(10):
            sentiments[i] += album_document['sentiments'][i]
    local_artist_document['sentiments'] = sentiments
    atlas_artist_document['sentiments'] = sentiments
    return sentiments

def get_reading_level_artist(albums_documents_local: list, local_artist_document: dict, atlas_artist_document: dict) -> float:
    total_reading_level = sum(album_document['readingLevel'] for album_document in albums_documents_local)
    num_albums = len(albums_documents_local)
    reading_level = total_reading_level / num_albums if num_albums > 0 else 0.0
    local_artist_document['readingLevel'] = reading_level
    atlas_artist_document['readingLevel'] = reading_level
    return reading_level

def get_num_chars_artist(albums_documents_local: list, local_artist_document: dict, atlas_artist_document: dict) -> int:
    num_chars = sum(album_document['numChars'] for album_document in albums_documents_local)
    local_artist_document['numChars'] = num_chars
    atlas_artist_document['numChars'] = num_chars
    return num_chars
