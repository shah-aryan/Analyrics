import lyricsgenius
from dotenv import load_dotenv
import os
from pymongo import MongoClient
from utils_lyrics import *
from utils_artist import *
from utils_album import *
from utils_song import *
from utils_mongo import *
from utils_documents import *

db_test = MongoClient(os.getenv("MONGO_URI"))['test']

def initialize_mongo_clients():
    mongodb_uri = os.getenv("MONGO_URI")
    mongodb_local_uri = os.getenv("MONGO_LOCAL_URI")
    client = MongoClient(mongodb_uri)
    client_local = MongoClient(mongodb_local_uri)
    return client, client_local

def initialize_genius_client():
    client_access_token = os.getenv("CLIENT_ACCESS_TOKEN")
    return lyricsgenius.Genius(client_access_token, timeout=5, sleep_time=0.1, retries=3)

def process_song(genius, track, album_id, artist_id, db_local, db_atlas):
    song_id = get_id_song(track, song_document_local, song_document_atlas)
    song_lyrics = genius.lyrics(song_id, remove_section_headers=True)
    song_lyrics = remove_first_line(song_lyrics)
    song_lyrics = remove_end_info(song_lyrics)
    song_lyrics = remove_special_characters(song_lyrics)
    update_lyrics_song(song_lyrics, song_document_local)

    song_lyrics = song_lyrics.lower()
    
    count_characters(song_lyrics, song_document_local, song_document_atlas)
    analyze_emotions(song_lyrics, song_document_local, song_document_atlas)
    calculate_reading_level(song_lyrics, song_document_local, song_document_atlas)

    get_name_song(track, song_document_local, song_document_atlas)
    get_release_date_song(track, song_document_local, song_document_atlas)
    get_collaborations_song(track, song_document_local, song_document_atlas)
    get_num_in_album(track, song_document_local, song_document_atlas)
    
    num_words, counter_obj = count_words(song_lyrics, song_document_local, song_document_atlas)
    top_words_song = get_top_x_words(counter_obj, 25)
    song_document_atlas['top25words'] = top_words_song
    unique_words_set = counter_obj.copy()

    song_document_local['albumId'] = album_id
    song_document_atlas['albumId'] = album_id
    song_document_local['artistId'] = artist_id
    song_document_atlas['artistId'] = artist_id
    
    song_doc_local = song_document_local.copy()
    clear_document(song_document_local)
    song_doc_atlas = song_document_atlas.copy()
    clear_document(song_document_atlas)

    # Insert documents into MongoDB
    # db_local['songs_local'].insert_one(song_doc_local)
    # db_atlas['songs_atlas'].insert_one(song_doc_atlas)
    db_test['songs'].insert_one(song_doc_local)

    return song_doc_local, song_doc_atlas, unique_words_set

def process_album(genius, album_obj, artist_id, db_local, db_atlas):
    album_id = get_id_album(album_obj, album_document_local, album_document_atlas)
    get_name_album(album_obj, album_document_local, album_document_atlas)
    get_release_date_album(album_obj, album_document_local, album_document_atlas)
    tracks = genius.album_tracks(album_id)["tracks"]
    get_num_tracks_album(tracks, album_document_local, album_document_atlas)

    songs_documents_local = []
    songs_documents_atlas = []
    unique_words_sets_songs = []

    for track in tracks:
        song_doc_local, song_doc_atlas, unique_words_set = process_song(genius, track, album_id, artist_id, db_local, db_atlas)
        songs_documents_local.append(song_doc_local.copy())
        songs_documents_atlas.append(song_doc_atlas.copy())
        unique_words_sets_songs.append(unique_words_set.copy())
        album_document_local['songs'].append(song_doc_local['songId'])
        album_document_atlas['songs'].append(song_doc_atlas['songId'])
    
    get_number_words_album(songs_documents_local, album_document_local, album_document_atlas)
    get_collaborations_album(songs_documents_local, album_document_local, album_document_atlas)
    get_sentiments_album(songs_documents_local, album_document_local, album_document_atlas)
    get_album_reading_level(songs_documents_local, album_document_local, album_document_atlas)
    get_num_chars_album(songs_documents_local, album_document_local, album_document_atlas)
    
    unique_words_album = combine_unique_words(songs_documents_local)
    album_document_local['wordsCounter'] = unique_words_album
    get_vocabulary_size_album(unique_words_album, album_document_local, album_document_atlas) 

    top_words_album = get_top_x_words(unique_words_album, 25)
    album_document_atlas['top25words'] = top_words_album

    album_document_local['artistId'] = artist_id
    album_document_atlas['artistId'] = artist_id

    album_document_local['numberInDiscography'] = len(artist_document_local['albumIds']) + 1
    album_document_atlas['numberInDiscography'] = len(artist_document_atlas['albumIds']) + 1

    album_doc_local = album_document_local.copy()
    clear_document(album_document_local)
    album_doc_atlas = album_document_atlas.copy()
    clear_document(album_document_atlas)

    # Insert documents into MongoDB
    # db_local['albums_local'].insert_one(album_doc_local)
    # db_atlas['albums_atlas'].insert_one(album_doc_atlas)
    db_test['albums'].insert_one(album_doc_local)

    return album_doc_local, album_doc_atlas, unique_words_album

def process_artist(genius, artist_name, db_local, db_atlas):
    artist_obj = genius.search(search_term=artist_name, type_="artist")
    artist_id = get_id_artist(artist_obj, artist_document_local, artist_document_atlas)
    get_artist_name(artist_obj, artist_document_local, artist_document_atlas)
    discography = genius.artist_albums(artist_id)["albums"]

    albums_documents_local = []
    albums_documents_atlas = []
    unique_words_sets_albums = []

    for album_obj in discography:
        album_doc_local, album_doc_atlas, unique_words_album = process_album(genius, album_obj, artist_id, db_local, db_atlas)
        albums_documents_local.append(album_doc_local.copy())
        albums_documents_atlas.append(album_doc_atlas.copy())
        unique_words_sets_albums.append(unique_words_album.copy())
        artist_document_local['albumIds'].append(album_doc_local['albumId'])
        artist_document_atlas['albumIds'].append(album_doc_atlas['albumId'])
        break #TODO remove this

    get_num_songs_artist(albums_documents_local, artist_document_local, artist_document_atlas)

    unique_words_set_artist = combine_unique_words(albums_documents_local)
    artist_document_local['wordsCounter'] = unique_words_set_artist
    top_words_artist = get_top_x_words(unique_words_set_artist, 25)
    artist_document_atlas['top25words'] = top_words_artist
    
    get_vocabulary_size_artist(unique_words_set_artist, artist_document_local, artist_document_atlas)
    get_total_words_discography_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_collaborations_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_sentiments_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_reading_level_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_num_chars_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    
    # Insert documents into MongoDB
    # db_local['artists_local'].insert_one(artist_document_local)
    # db_atlas['artists_atlas'].insert_one(artist_document_atlas)
    db_test['artists'].insert_one(artist_document_local)
    
    clear_document(artist_document_local)
    clear_document(artist_document_atlas)

def main():
    load_dotenv()
    client, client_local = initialize_mongo_clients()
    db_local = client_local['music_db']
    db_atlas = client['music_db']
    genius = initialize_genius_client()
    
    artist_names = ["J Cole"]
    for artist_name in artist_names:
        process_artist(genius, artist_name, db_local, db_atlas)
    
    client.close()
    client_local.close()

if __name__ == "__main__":
    main()
