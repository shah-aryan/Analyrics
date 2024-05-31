from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from datetime import datetime
import lyricsgenius
import api_key
import time
import os
import requests

# Replace 'your_access_token_here' with your Genius API token
genius = lyricsgenius.Genius(api_key.client_access_token, timeout=1, sleep_time=0.1, retries=10)

def get_song_lyrics(artist_name, song_title):
    """Retrieve song lyrics given an artist name and song title."""
    genius.verbose = False  # Turn off status messages
    genius.remove_section_headers = True  # Remove [Chorus], [Verse], etc. headers

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

def scroll_to_bottom(driver):
    """Scroll to the bottom of the page."""
    scroll_pause_time = 2
    last_height = driver.execute_script("return document.body.scrollHeight")

    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(scroll_pause_time)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

def get_tracklist(artist_name, album_name):
    """Retrieve the tracklist of an album given the artist name and album name."""
    artist_formatted = format_url_component(artist_name)
    album_formatted = format_url_component(album_name)
    url = f"https://genius.com/albums/{artist_formatted}/{album_formatted}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        tracklist = soup.find_all('h3', class_='chart_row-content-title')
        tracks = [track.get_text(strip=True).split('\n')[0] for track in tracklist]
        tracks = [track[:-6] for track in tracks]  # Remove the last 6 characters (position numbers)

        if not tracks:
            return "Tracklist not found. Check the album and artist name, or the album may not be listed."
        return tracks
    except requests.RequestException as e:
        return f"Album Not Found: {str(e)}"

def get_albums(artist_name):
    """Retrieve all albums by an artist."""
    artist_formatted = format_url_component(artist_name)
    artist_url = f"https://genius.com/artists/{artist_formatted}/albums"

    response = requests.get(artist_url)
    response.raise_for_status()
    scroll_to_bottom(driver)
    soup = BeautifulSoup(response.text, "html.parser")
    album_items = soup.find_all("li", class_="ListItem__Container-sc-122yj9e-0")

    if not album_items:
        return "No albums found on the page."

    albums = []
    for item in album_items:
        title_element = item.find("h3", class_="ListItem__Title-sc-122yj9e-4")
        date_element = item.find("div", class_="ListItem__Info-sc-122yj9e-5")
        
        if title_element and date_element:
            title = title_element.text.strip()
            date_text = date_element.text.strip()
            if title.endswith("Single"):
                continue
            
            try:
                release_date = datetime.strptime(date_text, "%B %d, %Y")
            except ValueError:
                release_date = None
            
            if release_date:
                albums.append({"title": title, "release_date": release_date})

    return sorted(albums, key=lambda x: x["release_date"])

# Example usage
artist = "Taylor Swift"
albums = get_albums(artist)

# Create a directory for the artist
artist_dir = f"/Users/aryanshah/personalProjects/musicProject/{artist.replace(' ', '_')}"
os.makedirs(artist_dir, exist_ok=True)

# For each album, create a folder and write each track's lyrics to a separate file
for album in albums:
    album_title = album["title"]
    album_dir = os.path.join(artist_dir, album_title.replace(' ', '_'))
    os.makedirs(album_dir, exist_ok=True)

    tracks = get_tracklist(artist, album_title)

    if isinstance(tracks, list):
        for track in tracks:
            lyrics = get_song_lyrics(artist, track)
            track_filename = f"{track.replace(' ', '_')}.txt"
            track_path = os.path.join(album_dir, track_filename)
            
            # Write the lyrics of the track to its own file
            with open(track_path, 'w') as file:
                file.write(f"Track: {track}\n\n")
                file.write(f"Lyrics:\n{lyrics}\n")

# # Example usage
# artist = "J Cole"
# albums = get_albums(artist)

# # Write the albums, tracklists, and lyrics to a file
# with open('/Users/aryanshah/personalProjects/musicProject/tracklist_and_lyrics.txt', 'w') as file:
#     file.write(f"Albums and Tracklists for {artist}:\n\n")

#     for album in albums:
#         album_title = album["title"]
#         file.write(f"Album: {album_title} - {album['release_date'].strftime('%B %d, %Y')}\n\n")
#         tracks = get_tracklist(artist, album_title)

#         if isinstance(tracks, list):
#             for i, track in enumerate(tracks, 1):
#                 file.write(f"{i}. {track}\n")
#             file.write("\n")
            
#             # Get and write the lyrics for each track
#             for track in tracks:
#                 lyrics = get_song_lyrics(artist, track)
#                 file.write(f"Track: {track}\n\n")
#                 file.write(f"Lyrics:\n{lyrics}\n\n\n")
#         else:
#             file.write(f"{tracks}\n\n")
