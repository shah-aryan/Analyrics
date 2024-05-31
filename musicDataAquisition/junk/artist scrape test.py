import requests
from bs4 import BeautifulSoup
from datetime import datetime

def format_url_component(string):
    """Format strings for URL components by replacing spaces and special characters."""
    return string.replace(' ', '-').replace('&', 'and').lower()

artist = "Taylor Swift"
artistToEnter = format_url_component(artist)
artist_url = f"https://genius.com/artists/{artistToEnter}/albums"

# Fetch the HTML content using requests
response = requests.get(artist_url)
response.raise_for_status()  # Raise an exception for any HTTP errors
html_content = response.text

# Parse the HTML content with BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Update this if album items have a different class name or structure
album_items = soup.find_all("li", class_="ListItem__Container-sc-122yj9e-0")

if not album_items:
    print("No albums found on the page")

# Extract album information
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

# Sort the albums by release date in ascending order
sorted_albums = sorted(albums, key=lambda x: x["release_date"])

# Print the sorted list
for album in sorted_albums:
    print(f"{album['title']} - {album['release_date'].strftime('%B %d, %Y')}")
