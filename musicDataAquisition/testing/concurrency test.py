from concurrent.futures import ThreadPoolExecutor, as_completed
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime
import lyricsgenius
import api_key
import time
import os
import requests

# Set up Genius API
genius = lyricsgenius.Genius(api_key.client_access_token, timeout=3, sleep_time=0.1, retries=10)

# Set up Selenium WebDriver
options = Options()
options.add_argument('--disable-gpu')  # Needed sometimes in headless mode

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)

def scroll_to_bottom_with_wait(driver):
    """Scroll to the bottom of a dynamically loaded page, waiting for a sentinel element to appear."""
    scroll_pause_time = 2
    sentinel_xpath = "//*[contains(@class, 'InfiniteScrollSentinel__Container')]"

    last_height = driver.execute_script("return document.body.scrollHeight")
    max_attempts = 3
    attempts = 0

    while attempts < max_attempts:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(scroll_pause_time)

        try:
            WebDriverWait(driver, scroll_pause_time).until(
                EC.presence_of_element_located((By.XPATH, sentinel_xpath))
            )
        except Exception:
            pass

        new_height = driver.execute_script("return document.body.scrollHeight")

        if new_height == last_height:
            attempts += 1
        else:
            attempts = 0
            last_height = new_height

def get_song_lyrics(artist_name, song_title):
    """Retrieve song lyrics given an artist name and song title."""
    genius.verbose = False
    genius.remove_section_headers = True
    genius.skip_non_songs = True

    try:
        song = genius.search_song(song_title, artist_name)
    except requests.RequestException as e:
        return f"Lyrics Not Found: {str(e)}"

    return song.lyrics if song else "NULL"

def format_url_component(string):
    """Format strings for URL components."""
    return string.replace(' ', '-').replace('&', 'and').lower()

def get_tracklist(artist_name, album_name):
    """Retrieve the tracklist of an album given the artist name and album name."""
    artist_formatted = format_url_component(artist_name)
    album_formatted = format_url_component(album_name)
    url = f"https://genius.com/albums/{artist_formatted}/{album_formatted}"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        soup = BeautifulSoup(response.text, 'html.parser')
        tracklist = soup.find_all('h3', class_='chart_row-content-title')
        tracks = [track.get_text(strip=True).split('\n')[0] for track in tracklist]
        tracks = [track[:-6] for track in tracks]  # Remove the last 6 characters (position numbers)

        if not tracks:
            return "Tracklist not found."
        return tracks

    except requests.exceptions.HTTPError as e:
        return "Tracklist not found due to HTTP error."

    except requests.RequestException as e:
        print(f"Network or Request error: {str(e)}")
        return "Tracklist not found due to request error."

def get_albums(artist_name):
    """Retrieve all albums by an artist using Selenium and scroll to the bottom to load all albums."""
    artist_formatted = format_url_component(artist_name)
    artist_url = f"https://genius.com/artists/{artist_formatted}/albums"

    driver.get(artist_url)
    scroll_to_bottom_with_wait(driver)

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
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
            albums.append({"title": title, "release_date": date_text})

    return albums

def save_lyrics(artist, album, track, album_dir):
    """Save lyrics to a file for a given track."""
    lyrics = get_song_lyrics(artist, track)
    track_filename = f"{track.replace(' ', '_')}.txt"
    track_path = os.path.join(album_dir, track_filename)

    with open(track_path, 'w') as file:
        file.write(f"Track: {track}\n\n")
        file.write(f"Lyrics:\n{lyrics}\n")
    return track_path

def process_album(artist, album):
    """Process an album by creating folders and saving track lyrics."""
    album_title = album["title"]
    tracks = get_tracklist(artist, album_title)

    if isinstance(tracks, list) and tracks:
        album_dir = os.path.join(artist_dir, album_title.replace(' ', '_'))
        os.makedirs(album_dir, exist_ok=True)

        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(save_lyrics, artist, album_title, track, album_dir) for track in tracks]
            for future in as_completed(futures):
                print(f"Saved: {future.result()}")

    else:
        print(f"Skipping folder creation for '{album_title}' due to missing or empty track list.")

# Example usage
artist = "Kanye West"
albums = get_albums(artist)

artist_dir = f"/Users/aryanshah/personalProjects/musicProject/outputs/{artist.replace(' ', '_')}"
os.makedirs(artist_dir, exist_ok=True)

with ThreadPoolExecutor() as executor:
    album_futures = [executor.submit(process_album, artist, album) for album in albums]
    for future in as_completed(album_futures):
        future.result()

driver.quit()
