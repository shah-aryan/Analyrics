from datetime import datetime
from typing import List, Dict, Any
from collections import Counter

def get_id_album(album_obj: Dict[str, Any], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> str:
    album_id = album_obj["id"]
    local_album_document["albumId"] = album_id
    atlas_album_document["albumId"] = album_id
    return album_id

def get_name_album(album_obj: Dict[str, Any], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> str:
    name = album_obj["name"]
    local_album_document["name"] = name
    atlas_album_document["name"] = name
    return name

def get_release_date_album(album_obj: Dict[str, Any], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> str:
    release_date_components = album_obj.get("release_date_components")
    if release_date_components:
        year = release_date_components.get("year", 1)
        month = release_date_components.get("month", 1)
        day = release_date_components.get("day", 1)
        release_date = datetime(year, month, day).isoformat()
    else:
        release_date = None
    
    local_album_document["releaseDate"] = release_date
    atlas_album_document["releaseDate"] = release_date
    return release_date

def get_num_tracks_album(tracks: Dict[str, Any], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> int:
    num_tracks = len(tracks)
    local_album_document["numTracks"] = num_tracks
    atlas_album_document["numTracks"] = num_tracks
    return num_tracks

def get_number_words_album(songs_documents: List[Dict[str, Any]], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> int:
    num_words = sum(song_document["numWords"] for song_document in songs_documents)
    local_album_document["numWords"] = num_words
    atlas_album_document["numWords"] = num_words
    return num_words

def get_vocabulary_size_album(unique_words_album: Dict[str, int], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> int:
    vocab_size = len(unique_words_album)
    local_album_document["vocabSize"] = vocab_size
    local_album_document["wordsCounter"] = unique_words_album
    atlas_album_document["vocabSize"] = vocab_size
    return vocab_size

def get_collaborations_album(songs_documents: List[Dict[str, Any]], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> Counter:
    collaborations = Counter()
    for song_document in songs_documents:
        collaborations.update(song_document["collaborations"])
    
    local_album_document["collaborations"] = collaborations
    atlas_album_document["collaborations"] = collaborations
    return collaborations

def get_sentiments_album(songs_documents: List[Dict[str, Any]], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> List[int]:
    sentiments = [0] * 10
    for song_document in songs_documents:
        for i in range(10):
            sentiments[i] += song_document["sentiments"][i]
    
    local_album_document["sentiments"] = sentiments
    atlas_album_document["sentiments"] = sentiments
    return sentiments

def get_album_reading_level(songs_documents: List[Dict[str, Any]], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> float:
    total_reading_level = sum(song_document["readingLevel"] for song_document in songs_documents)
    num_songs = len(songs_documents)
    album_reading_level = total_reading_level / num_songs if num_songs > 0 else 0.0

    local_album_document["readingLevel"] = album_reading_level
    atlas_album_document["readingLevel"] = album_reading_level
    return album_reading_level

def get_num_chars_album(songs_documents: List[Dict[str, Any]], local_album_document: Dict[str, Any], atlas_album_document: Dict[str, Any]) -> int:
    num_chars = sum(song_document["numChars"] for song_document in songs_documents)
    local_album_document["numChars"] = num_chars
    atlas_album_document["numChars"] = num_chars
    return num_chars
