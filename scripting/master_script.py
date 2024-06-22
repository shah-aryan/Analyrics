from dotenv import load_dotenv
import os
from pymongo import MongoClient
import logging
import concurrent.futures
from acquisition import initialize_client

from utils_lyrics import *
from utils_artist import *
from utils_album import *
from utils_song import *
from utils_mongo import *
from utils_documents import *

# add better handling for duplicate keys
# make sure an artist can't collaborate with themselves
# make sure all collaborations are in their own database
# change to top 150 words
# only increment/add a song if it actually goes through and isnt a duplicate
#! sort albums by release date for album number front end
# remove albums with no songs
# remove songs with no lyrics
# remove artists with no albums
# remove albums which are different editions of the same album
#! remove albums if theyre from the same artist and they have mostly the same name
# remove albums if they have remix or deluxe or mixes or festival or apple music or spotify or live or re-release or bonus or collection or best of or anthology or hits or greatest hits or remixes or version or deluxe or 
#! remove all albums that don't have a release date in the past
# remove all greatest hits, best of, and compilation albums
# remove songs if their name has edition or exclusive or (live) or remix or music video
#! if number in album isnt there then add it to the end
#! double check collaborations checking
#! make decision on number in discography - handle in front end and don't show it

# db_test = MongoClient(os.getenv("MONGO_URI"))['test']

def initialize_mongo_clients():
    mongodb_uri = os.getenv("MONGO_URI")
    mongodb_local_uri = os.getenv("MONGO_LOCAL_URI")
    client = MongoClient(mongodb_uri)
    client_local = MongoClient(mongodb_local_uri)
    return client, client_local

def process_song(lyr, track, album_id, artist_id, db_local, db_atlas, album_document_local, album_document_atlas):
    song_document_local = SONG_LOCAL_TEMPLATE.copy()
    song_document_atlas = SONG_ATLAS_TEMPLATE.copy()
    song_id = get_id_song(track, song_document_local, song_document_atlas, db_local, db_atlas, album_document_local, album_document_atlas, album_id)
    if song_id is None:
        return None
    
    try:
        song_lyrics = lyr.lyrics(song_id, remove_section_headers=True)
        song_lyrics = remove_first_line(song_lyrics)
        song_lyrics = remove_end_info(song_lyrics)
        song_lyrics = remove_special_characters(song_lyrics)
    except Exception as e:
        logging.error("ERROR GETTING LYRICS: %s ", e)
        print("ERROR GETTING LYRICS:", e)
        song_lyrics = ""

    if len(song_lyrics) == 0:
        print("Song {id} has no lyrics".format(id=song_id))
        logging.error("Song {id} has no lyrics".format(id=song_id))
        return None
    
    update_lyrics_song(song_lyrics, song_document_local)

    song_lyrics = song_lyrics.lower()
    
    if len(song_lyrics) != 0:
        count_characters(song_lyrics, song_document_local, song_document_atlas)
        analyze_emotions(song_lyrics, song_document_local, song_document_atlas)
        calculate_reading_level(song_lyrics, song_document_local, song_document_atlas)
    else:
        song_document_local['sentiments'] = [0] * 10
        song_document_local['readingLevel'] = 0.0
        song_document_local['numWords'] = 0
        song_document_local['numChars'] = 0
        song_document_atlas['sentiments'] = [0] * 10
        song_document_atlas['readingLevel'] = 0.0
        song_document_atlas['numWords'] = 0
        song_document_atlas['numChars'] = 0

    get_name_song(track, song_document_local, song_document_atlas)
    get_release_date_song(track, song_document_local, song_document_atlas)

    get_collaborations_song(track, song_document_local, song_document_atlas, db_local['lookup'], db_atlas['lookup'])
    get_num_in_album(track, song_document_local, song_document_atlas)
    
    if len(song_lyrics) != 0:
        num_words, counter_obj = count_words(song_lyrics, song_document_local, song_document_atlas)
        top_words_song = get_top_x_words(counter_obj, 150)
        song_document_atlas['top25words'] = top_words_song
        unique_words_set = counter_obj.copy()
    else:
        num_words = 0
        unique_words_set = {}
        song_document_atlas['top25words'] = {}

    #clear them all before appending
    song_document_local['albumId'].clear()
    song_document_atlas['albumId'].clear()
    song_document_local['artistId'].clear()
    song_document_atlas['artistId'].clear()
    #change to append it to the array (album id and artist id are arrays of ids)
    song_document_local['albumId'].append(album_id)
    song_document_atlas['albumId'].append(album_id)
    song_document_local['artistId'].append(artist_id)
    song_document_atlas['artistId'].append(artist_id)
        
    try:
        db_local['songs'].insert_one(song_document_local)
        db_atlas['songs'].insert_one(song_document_atlas)
    except Exception as e:
        logging.error("ERROR INSERTING SONG: %s ", e)
        print("ERROR INSERTING SONG:", e)

    return song_document_local, song_document_atlas, unique_words_set

def process_album(lyr, album_obj, artist_id, db_local, db_atlas):
    album_document_local = ALBUM_LOCAL_TEMPLATE.copy()
    album_document_atlas = ALBUM_ATLAS_TEMPLATE.copy()

    album_id = get_id_album(album_obj, album_document_local, album_document_atlas)

    get_name_album(album_obj, album_document_local, album_document_atlas)
    get_release_date_album(album_obj, album_document_local, album_document_atlas)

    if album_document_local['releaseDate'] is None:
        print("  No release date for album {id}".format(id=album_id))
        logging.error("  No release date for album {id}".format(id=album_id))
        return None

    tracks = lyr.album_tracks(album_id)["tracks"]

    if len(tracks) == 0:
        print("No tracks in album {id}".format(id=album_id))
        logging.error("No tracks in album {id}".format(id=album_id))
        return None

    get_num_tracks_album(tracks, album_document_local, album_document_atlas)

    songs_documents_local = []
    songs_documents_atlas = []
    unique_words_sets_songs = []
    album_document_local['songs'].clear()
    album_document_atlas['songs'].clear()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(process_song, lyr, track, album_id, artist_id, db_local, db_atlas, album_document_local, album_document_atlas) for track in tracks]
        for future in concurrent.futures.as_completed(futures):
            try:
                song_doc_local, song_doc_atlas, unique_words_set = future.result()
                if song_doc_local is not None:
                    songs_documents_local.append(song_doc_local.copy())
                    songs_documents_atlas.append(song_doc_atlas.copy())
                    unique_words_sets_songs.append(unique_words_set.copy())
                    album_document_local['songs'].append(song_doc_local['songId'])
                    album_document_atlas['songs'].append(song_doc_atlas['songId'])
                    logging.info("    " + song_doc_local['name'] + " song processed ")
                    print("    " + song_doc_local['name'] + " song processed ")
            except Exception as e:
                logging.error("    ERROR PROCESSING SONG: %s", e)
                print("    ERROR PROCESSING SONG:", e)
    
    get_number_words_album(songs_documents_local, album_document_local, album_document_atlas)
    get_collaborations_album(songs_documents_local, album_document_local, album_document_atlas)
    get_sentiments_album(songs_documents_local, album_document_local, album_document_atlas)
    get_album_reading_level(songs_documents_local, album_document_local, album_document_atlas)
    get_num_chars_album(songs_documents_local, album_document_local, album_document_atlas)
    
    unique_words_album = combine_unique_words(songs_documents_local)
    album_document_local['wordsCounter'] = unique_words_album
    get_vocabulary_size_album(unique_words_album, album_document_local, album_document_atlas) 

    top_words_album = get_top_x_words(unique_words_album, 150)
    album_document_atlas['top25words'] = top_words_album

    album_document_local['artistId'] = artist_id
    album_document_atlas['artistId'] = artist_id

    try:
        # db_test['albums'].insert_one(album_document_local)
        db_local['albums'].insert_one(album_document_local)
        db_atlas['albums'].insert_one(album_document_atlas)
    except Exception as e:
        logging.error("ERROR INSERTING ALBUM: %s ", e)
        print("ERROR INSERTING ALBUM: %s ", e)

    return album_document_local, album_document_atlas, unique_words_album

def process_artist(lyr, artist_name, db_local, db_atlas):
    artist_document_local = ARTIST_LOCAL_TEMPLATE.copy()
    artist_document_atlas = ARTIST_ATLAS_TEMPLATE.copy()

    artist_obj = lyr.search(search_term=artist_name, type_="artist")
    artist_id = get_id_artist(artist_obj, artist_document_local, artist_document_atlas)

    #if the artist id is already in the database then cap it right here
    if db_local['artists'].find_one({"artistId": artist_id}) is not None:
        print("Artist {id} already in database".format(id=artist_id))
        logging.error("Artist {id} already in database".format(id=artist_id))
        return

    get_artist_name(artist_obj, artist_document_local, artist_document_atlas)

    # discography = lyr.artist_albums(artist_id)["albums"]
    discography = []
    page = 1
    per_page = 50
    while True:
        response = lyr.artist_albums(artist_id, per_page=per_page, page=page)
        albums = response.get('albums', [])
        if not albums:
            break
        discography.extend(albums)
        page += 1

    if len(discography) == 0:
        print("No albums in discography for artist {id}".format(id=artist_id))
        logging.error("No albums in discography for artist {id}".format(id=artist_id))
        return None

    albums_documents_local = []
    albums_documents_atlas = []
    unique_words_sets_albums = []
    artist_document_local['albumIds'].clear()
    artist_document_atlas['albumIds'].clear()

    #go in reverse order to get oldest albums first and so duplicate older albums are kept
    for album_obj in discography[::-1]:
        logging.info("  Processing " + album_obj['name'] + " album ")
        print("  Processing " + album_obj['name'] + " album ")
        
        try:
            album_doc_local, album_doc_atlas, unique_words_album = process_album(lyr, album_obj, artist_id, db_local, db_atlas)
            if album_doc_local is None:
                print("  " + album_obj['name'] + " album not processed ")
                logging.error("  " + album_obj['name'] + " album not processed ")
            else:
                albums_documents_local.append(album_doc_local.copy())
                albums_documents_atlas.append(album_doc_atlas.copy())
                unique_words_sets_albums.append(unique_words_album.copy())
                artist_document_local['albumIds'].append(album_doc_local['albumId'])
                artist_document_atlas['albumIds'].append(album_doc_atlas['albumId'])
                logging.info("  " + album_obj['name'] + " album processed ")
                print("  " + album_obj['name'] + " album processed ")
        
        except Exception as e:
            logging.error("  ERROR PROCESSING ALBUM: %s", e)
            print("  ERROR PROCESSING ALBUM:", e)

    get_num_songs_artist(albums_documents_local, artist_document_local, artist_document_atlas)

    unique_words_set_artist = combine_unique_words(albums_documents_local)
    artist_document_local['wordsCounter'] = unique_words_set_artist
    top_words_artist = get_top_x_words(unique_words_set_artist, 150)
    artist_document_atlas['top25words'] = top_words_artist
    
    get_vocabulary_size_artist(unique_words_set_artist, artist_document_local, artist_document_atlas)
    get_total_words_discography_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_collaborations_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_sentiments_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_reading_level_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    get_num_chars_artist(albums_documents_local, artist_document_local, artist_document_atlas)
    
    try:
        db_local['artists'].insert_one(artist_document_local)
        db_atlas['artists'].insert_one(artist_document_atlas)
        # lookup_local.update_one({"artistId": artist_id, "name": artist["name"]}, {"$set": artist}, upsert=True)
        
        if db_local['lookup'].find_one({"artistId": artist_document_local['artistId']}) is None:
            db_local['lookup'].insert_one({"artistId": artist_document_local['artistId'], "name": artist_document_local['name']})
        else:
            db_local['lookup'].update_one(
                {"artistId": artist_document_local['artistId']},
                {"$set": {"artistId": artist_document_local['artistId']}},
                upsert=True
            )
        
        if db_atlas['lookup'].find_one({"artistId": artist_document_atlas['artistId']}) is None:
            db_atlas['lookup'].insert_one({"artistId": artist_document_atlas['artistId'], "name": artist_document_atlas['name']})
        else:
            db_atlas['lookup'].update_one(
                {"artistId": artist_document_atlas['artistId']},
                {"$set": {"artistId": artist_document_atlas['artistId']}},
                upsert=True
            )
    except Exception as e:
        logging.error("ERROR INSERTING ARTIST: %s ", e)
        print("ERROR INSERTING ARTIST: %s ", e)

def main():
    load_dotenv()
    client, client_local = initialize_mongo_clients()
    db_local = client_local['analyrics_local']
    db_atlas = client['analyrics']
    lyr = initialize_client()
    logging.basicConfig(filename='master_script.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
    
    artist_names = ["Playboi Carti"]

    # artist_names = [
    # "Taylor Swift",
    # "Kanye West",
    # "Ariana Grande",
    # "Drake",
    # "Ed Sheeran",
    # "The Weeknd",
    # "Justin Bieber",
    # "Billie Eilish",
    # "Post Malone",
    # "Rihanna",
    # "Beyoncé",
    # "Katy Perry",
    # "Lady Gaga",
    # "Nicki Minaj",
    # "Bruno Mars",
    # "Adele",
    # "Shawn Mendes",
    # "Dua Lipa",
    # "Lil Wayne",
    # "Travis Scott",
    # "Cardi B",
    # "Lana Del Rey",
    # "SZA",
    # "Lorde",
    # "Halsey",
    # "Megan Thee Stallion",
    # "Doja Cat",
    # "Kendrick Lamar",
    # "J. Cole",
    # "Eminem",
    # "Jay-Z",
    # "50 Cent",
    # "Nas",
    # "Tupac Shakur",
    # "The Notorious B.I.G.",
    # "Snoop Dogg"
    # ]
    for artist_name in artist_names:
        logging.info("Processing " + artist_name + " artist ")
        print("Processing " + artist_name + " artist ")
        process_artist(lyr, artist_name, db_local, db_atlas)
        logging.info(artist_name + " artist processed ")
        print(artist_name + " artist processed ")
    
    client.close()
    client_local.close()

if __name__ == "__main__":
    main()
