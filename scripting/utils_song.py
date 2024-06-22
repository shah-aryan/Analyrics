from datetime import datetime
from typing import Any, Dict
from collections import Counter
from typing import Optional
import logging
import re
from pymongo import errors

def get_id_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict, db_local, db_atlas, album_document_local, album_document_atlas, album_id) -> str:
    id = song_obj["song"]["id"]
    local_song_document["songId"] = id
    atlas_song_document["songId"] = id
    song_id = id

    if db_local['songs'].find_one({"songId": song_id}) is not None:
        print("Song {id} already in database".format(id=song_id))
        logging.error("Song {id} already in database".format(id=song_id))
        #append the second album id to the song document
        db_local['songs'].update_one(
            {"songId": song_id},
            {"$addToSet": {"albumId": album_id}}
        )
        db_atlas['songs'].update_one(
            {"songId": song_id},
            {"$addToSet": {"albumId": album_id}}
        )

        #remove the number in album property from the song document
        db_local['songs'].update_one(
            {"songId": song_id},
            {"$unset": {"numInAlbum": ""}}
        )
        db_atlas['songs'].update_one(
            {"songId": song_id},
            {"$unset": {"numInAlbum": ""}}
        )

        album_document_local['songs'].append(song_id)
        album_document_atlas['songs'].append(song_id)
        return None

    return id

def get_name_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> str:
    words_to_remove = {
    "edition", "exclusive", "(live)", "remix", "video", "version", "deluxe", 
    "mix", "festival", "apple", "spotify", "live", "rerelease", "bonus", 
    "collection", "best of", "anthology", "hits", "greatest hits", "remixes", 
    "video", "edition", "mixes", "compilation", "exclusive", "mix", "remastered", 
    "reissue", "expanded", "digital booklet", "anniversary", "radio", "edit",  
    "unplugged", "acoustic", "instrumental", "karaoke", "demo", 
    "b-sides", "soundtrack",  "itunes", "amazon", "google",
    "studio", "mono", "stereo", "alternate", "bonus", "concert", 
    "enhanced", "EP", "cappella", "special", "tour",
    "podcast", "interview", "cover", "tribute", "bootleg", 
    }
    name = song_obj["song"]["title"]
    lowername = name.lower()
    lowername = re.sub(r'[^a-z\s]', '', lowername)
    lowername = lowername.split()
    #remove special characters in lowername
    #if any of these words are in the name throw exception
    for word in lowername:
        if word in words_to_remove:
            #"Name contains special word Name: Word:"
            raise Exception("Name contains special word \n Name: " + name + " Word: " + word)

    
    local_song_document["name"] = name
    atlas_song_document["name"] = name
    return name

def get_release_date_song(song_obj: Dict[str, Any], local_song_document: Dict[str, Any], atlas_song_document: Dict[str, Any]) -> Optional[str]:
    try:
        release_date_components = song_obj.get("song", {}).get("release_date_components", None)
        if release_date_components:
            year = release_date_components.get("year", 1)
            month = release_date_components.get("month", 1)
            day = release_date_components.get("day", 1)
            release_date = datetime(year, month, day).isoformat()
        else:
            release_date = None
    except Exception as e:
        logging.error("Error extracting release date: %s", e)
        release_date = None
    
    local_song_document["releaseDate"] = release_date
    atlas_song_document["releaseDate"] = release_date
    return release_date


def get_collaborations_song(song_obj: dict, local_song_document: dict, atlas_song_document: dict, lookup_local, lookup_atlas) -> Counter:
    featured_artists = song_obj["song"]["featured_artists"]
    primary_artists = song_obj["song"]["primary_artists"]
    
    collaborations = Counter()

    for artist in featured_artists:
        artist_id = int(artist["id"])
        if artist_id not in local_song_document["artistId"]:
            collaborations[str(artist_id)] = collaborations.get(str(artist_id), 0) + 1
        if not lookup_local.find_one({"artistId": artist_id}):
            lookup_local.update_one({"artistId": artist_id, "name": artist["name"]}, {"$set": {"artistId": artist_id}}, upsert=True)
        if not lookup_atlas.find_one({"artistId": artist_id}):
            lookup_atlas.update_one({"artistId": artist_id, "name": artist["name"]}, {"$set": {"artistId": artist_id}}, upsert=True)

    
    for artist in primary_artists:
        artist_id = int(artist["id"])
        if artist_id not in local_song_document["artistId"]:
            collaborations[str(artist_id)] = collaborations.get(str(artist_id), 0) + 1
        if not lookup_local.find_one({"artistId": artist_id}):
            lookup_local.update_one({"artistId": artist_id, "name": artist["name"]}, {"$set": {"artistId": artist_id}}, upsert=True)
        if not lookup_atlas.find_one({"artistId": artist_id}):
            lookup_atlas.update_one({"artistId": artist_id, "name": artist["name"]}, {"$set": {"artistId": artist_id}}, upsert=True)

    
    local_song_document["collaborations"] = collaborations
    atlas_song_document["collaborations"] = collaborations
    return collaborations

def get_num_in_album(song_obj: dict, local_song_document: dict, atlas_song_document: dict) -> int:
    num = song_obj["number"]
    local_song_document["numInAlbum"] = num
    atlas_song_document["numInAlbum"] = num
    return num