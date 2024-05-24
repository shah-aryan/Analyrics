import lyricsgenius
import api_key



genius = lyricsgenius.Genius(api_key.client_access_token, timeout=3, sleep_time=0.1, retries=3)

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

song = genius.song(5)
print(song)
