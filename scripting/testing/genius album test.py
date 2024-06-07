import lyricsgenius
from dotenv import load_dotenv
import json

load_dotenv()
import os
api_key = os.getenv("CLIENT_ACCESS_TOKEN")


genius = lyricsgenius.Genius(api_key, timeout=3, sleep_time=0.1, retries=3)

#song = genius.search_song("Runaway", "Kanye West")
#album = genius.search_album("JORDI", "Maroon 5")
# artist = genius.search_artist("J. Cole")
# artistid = artist.id

# artist = genius.artist_albums(69)
# print(artist)

#print(album.to_json())
# print(album.to_json())



# result = genius.search(search_term="J Cole", type_="artist")
# print (result)

artist = genius.artist(1)

# Convert artist data to JSON format
artist_albums_json = genius.artist_albums(2)
tracks = genius.album_tracks(350958)


# Define the file path to save the JSON data
file_path = "tracks.json"

# Save the JSON data to a file
with open(file_path, "w") as json_file:
    json.dump(tracks, json_file, indent=2)

print(f"Artist data saved to {file_path}")



