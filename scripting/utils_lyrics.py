import re
from collections import Counter
from nrclex import NRCLex
from textatistic import Textatistic
from typing import List, Dict, Any, Tuple
from nltk.corpus import stopwords

def update_lyrics_song(song_lyrics: str, song_document_local: Dict[str, Any]) -> None:
    song_document_local['lyrics'] = song_lyrics

def remove_first_line(lyrics: str) -> str:
    lines = lyrics.split('\n', 1)
    return lines[1] if len(lines) > 1 else ""

def remove_end_info(lyrics: str) -> str:
    last_newline_index = lyrics.rfind('\n')
    if last_newline_index != -1:
        last_line = lyrics[last_newline_index + 1:]
        match = re.search(r'\d', last_line)
        if match:
            first_number_index = match.start()
            last_line = last_line[:first_number_index]
            lyrics = lyrics[:last_newline_index + 1] + last_line
    else:
        match = re.search(r'\d', lyrics)
        if match:
            first_number_index = match.start()
            lyrics = lyrics[:first_number_index]
    return lyrics

def remove_special_characters(lyrics: str) -> str:
    return re.sub(r'[^\w\s]', '', lyrics)

def count_characters(lyrics: str, song_document_local: Dict[str, Any], song_document_atlas: Dict[str, Any]) -> int:
    length = len(lyrics)
    song_document_local['numChars'] = length
    song_document_atlas['numChars'] = length
    return length

def count_words(lyrics: str, song_document_local: Dict[str, Any], song_document_atlas: Dict[str, Any]) -> Tuple[int, Counter]:
    words = lyrics.split()
    count = len(words)
    stop_words = stopwords.words('english')
    stop_words = [re.sub(r'[^\w\s]', '', word) for word in stop_words]
    stop_words = set(stop_words)
    stop_words.add('im')
    stop_words.add('oh')
    stop_words.add('like')
    words = [word for word in words if word not in stop_words]
    word_counts = Counter(words)
    song_document_local['numWords'] = count
    song_document_atlas['numWords'] = count
    song_document_local['numUniqueWords'] = len(word_counts)
    song_document_atlas['numUniqueWords'] = len(word_counts)
    song_document_local['wordsCounter'] = word_counts
    return count, word_counts

def analyze_emotions(text: str, song_document_local: Dict[str, Any], song_document_atlas: Dict[str, Any]) -> List[int]:
    if isinstance(text, list):
        text = " ".join(text)

    emotions = NRCLex(text)
    emotion_scores = emotions.raw_emotion_scores
    all_emotions = ['fear', 'anger', 'anticipation', 'trust', 'surprise', 'positive', 'negative', 'sadness', 'disgust', 'joy']
    emotion_list = [emotion_scores.get(emotion, 0) for emotion in all_emotions]

    song_document_local['sentiments'] = emotion_list
    song_document_atlas['sentiments'] = emotion_list
    return emotion_list

def get_top_x_words(counter_obj: Counter, num: int = 150) -> List[Tuple[str, int]]:
    return counter_obj.most_common(num)

def calculate_reading_level(song_lyrics: str, song_document_local: Dict[str, Any], song_document_atlas: Dict[str, Any]) -> float:
    if not song_lyrics.strip():  # Check if the song_lyrics is empty or only contains whitespace
        song_document_local['readingLevel'] = 0.0
        song_document_atlas['readingLevel'] = 0.0
        return 0.0
    
    song_lyrics += " . ! ? " 


    text = Textatistic(song_lyrics)
    reading_level = text.dalechall_score
    song_document_local['readingLevel'] = reading_level
    song_document_atlas['readingLevel'] = reading_level
    return reading_level


def combine_unique_words(documents: List[dict]) -> Counter:
    all_words = Counter()
    for document in documents:
        all_words.update(document['wordsCounter'])
    return all_words
