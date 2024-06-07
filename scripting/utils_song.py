from datetime import datetime
from typing import Any, Dict
from collections import Counter

def get_id_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> str:
    id = song_obj["song"]["id"]
    local_song_document["songId"] = id
    atlas_song_document["songId"] = id
    return id

def get_name_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> str:
    name = song_obj["song"]["title"]
    local_song_document["name"] = name
    atlas_song_document["name"] = name
    return name

def get_release_date_song(song_obj: Dict[str, Any], local_song_document: Dict[str, Any], atlas_song_document: Dict[str, Any]) -> str:
    release_date_components = song_obj["song"]["release_date_components"]
    if release_date_components:
        year = release_date_components.get("year", 1)
        month = release_date_components.get("month", 1)
        day = release_date_components.get("day", 1)
        release_date = datetime(year, month, day).isoformat()
    else:
        release_date = None
    
    local_song_document["releaseDate"] = release_date
    atlas_song_document["releaseDate"] = release_date
    return release_date


def get_collaborations_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> Counter:
    featured_artists = song_obj["song"]["featured_artists"]
    primary_artists = song_obj["song"]["primary_artists"]
    
    collaborations = Counter()

    for artist in featured_artists:
        collaborations[str(artist["id"])] += 1
    
    for artist in primary_artists:
        collaborations[str(artist["id"])] += 1
    
    local_song_document["collaborations"] = collaborations
    atlas_song_document["collaborations"] = collaborations
    return collaborations

def get_num_in_album(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> int:
    num = song_obj["number"]
    local_song_document["numInAlbum"] = num
    atlas_song_document["numInAlbum"] = num
    return num