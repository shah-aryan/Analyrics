import lyricsgenius
import api_key

import requests
from bs4 import BeautifulSoup

# Replace 'your_access_token_here' with your Genius API token
genius = lyricsgenius.Genius('api_key.client_access_token', timeout=1, sleep_time=0.1, retries=5)


def get_song_lyrics(artist_name, song_title):
    
    # Optional: Set any additional properties on the Genius object
    genius.verbose = False  # Turn off status messages
    genius.remove_section_headers = True  # Remove [Chorus], [Verse], etc. headers

    # Search for the song by artist
    try:
        song = genius.search_song(song_title, artist_name)
    except requests.RequestException as e:
        return f"Lyrics Not Found: {str(e)}"
    
    if song:
        return song.lyrics
    else:
        return "NULL"

def format_url_component(string):
    """Format strings for URL components by replacing spaces and special characters."""
    return string.replace(' ', '-').replace('&', 'and').lower()

def get_tracklist(artist_name, album_name):
    # Format the artist name and album name for the URL
    artist_formatted = format_url_component(artist_name)
    album_formatted = format_url_component(album_name)

    # Construct the URL to the album page on Genius
    url = f"https://genius.com/albums/{artist_formatted}/{album_formatted}"

    try:
        # Fetch the page
        response = requests.get(url)
        response.raise_for_status()  # Check that the request was successful
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all song links in the tracklist
        tracklist = soup.find_all('h3', class_='chart_row-content-title')
        tracks = [track.get_text(strip=True).split('\n')[0] for track in tracklist]
            
        # Remove the last 6 characters from each track in the list
        tracks = [track[:-6] for track in tracks]

        if not tracks:
            return "Tracklist not found. Check the album and artist name, or the album may not be listed."
        return tracks
    except requests.RequestException as e:
        return f"Album Not Found: {str(e)}"
    







# Example usage
artist = "J Cole"
album = "2014 Forest Hills Drive"
tracks = get_tracklist(artist, album)

lyrics = []

for track in tracks:
    print(lyrics.append(get_song_lyrics(artist, track)))

for lyric in lyrics:
    print(lyric)

  
# Write the tracklist to a file
with open('/Users/aryanshah/personalProjects/musicProject/tracklist.txt', 'w') as file:
  file.write(f"Tracklist for {artist} - {album}:\n\n")
  for i, track in enumerate(tracks, 1):
    file.write(f"{i}. {track}\n")

# Write the track name and its lyrics to a file
  for track, lyric in zip(tracks, lyrics):
    file.write(f"Track: {track}\n\n")
    file.write(f"Lyrics:\n{lyric}\n\n\n")

