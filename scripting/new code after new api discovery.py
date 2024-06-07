import lyricsgenius
from dotenv import load_dotenv
from scripting.utils_documents import *
from scripting.utils_lyrics import *
import os

load_dotenv()
client_access_token = os.getenv("CLIENT_ACCESS_TOKEN")

# Initialize Genius API client
genius = lyricsgenius.Genius(client_access_token, timeout=5, sleep_time=0.1, retries=3)

from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['musicProject']  

# List of artist names to process
artist_names = ["J Cole"]

# Loop through each artist in the list
for artist_name in artist_names:
  # Search for artist object
  artist = genius.search(search_term=artist_name, type_="artist")
  artist_id = artist['sections'][0]['hits'][0]['result']['id']
  official_artist_name = artist['sections'][0]['hits'][0]['result']['name']
  artist_document['name'] = official_artist_name
  artist_document['i'] = artist_id
  
  # Retrieve artist's discography
  discography = genius.artist_albums(artist_id)
  
  print(f"\nDiscography for {official_artist_name}:")
  for album in discography["albums"]:
    album_id = album["id"]
    album_name = album["name"]
    album_document['name'] = album_name
    album_document['albumId'] = album_id
    album_document['artistId'].append(artist_id)
    artist_document['albums'].append(album_id)

    # Retrieve and print each track in the album
    tracks = genius.album_tracks(album_id)
    for track in tracks["tracks"]:
      song_id = track["song"]["id"]
      song_name = track["song"]["title"]
      song_document['name'] = song_name
      song_document['songId'] = song_id
      song_document['artistId'].append(artist_id)
      song_document['albumId'] = album_id
      album_document['songs'].append(song_id)

      song_lyrics = genius.lyrics(song_id, remove_section_headers=True)
      song_lyrics = remove_first_line(song_lyrics)
      song_lyrics = remove_end_info(song_lyrics)
      song_document['lyrics'] = song_lyrics
      song_lyrics = remove_special_characters(song_lyrics)
      word_count = count_words(song_lyrics)
      song_document['wordCount'] = word_count #!add this
      char_count = count_characters(song_lyrics)
      song_document['charCount'] = char_count #!check this
      average_characters_per_word = char_count/word_count
      song_document['averageCharactersPerWord'] = average_characters_per_word #!check this
      top_100_words_and_vocabulary_size = top_100_words_and_vocabulary_size(song_lyrics)
      song_document['top100Words'] = top_100_words_and_vocabulary_size[0] #!this is a dictionary or something gotta fix this
      song_document['vocabularySize'] = top_100_words_and_vocabulary_size[1] 
      song_document['emotion'] = analyze_emotions(song_lyrics)       #! before using clean lryics properly
      song_document['collaborations'].append(artist_id) #!this is wrong and placeholder
      #! get song length in seconds somehow
      #! maybe get genre as well?
      song_document['collaborations'].clear()
      song_document['artistId'].clear()
    
    print (album_document)
    album_document['songs'].clear()
    album_document['artistId'].clear()

  artist_document["albums"].clear()
