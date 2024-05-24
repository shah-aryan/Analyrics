import re
from collections import Counter
import numpy as np
import pandas as pd
from nrclex_methods import analyze_emotions




lyrics = """124 ContributorsTranslationsEspañolРусскийPortuguêsJ. Cole - c l o s e (Traduzione Italiana)​​c l o s e Lyrics
Yeah
Close
Ville-matic, one, one
One, one, one-two, one
One-two, one, one-two, one
One-two, one, one, listen

Close, I stare at my dreams as they approach
Gotta be patient and trust in God, He the coach
Temptations are taking a shortcut, but I don't
'Cause I ain't tryna be a almost, when I get it, I'ma float
Gone are the days we was close
Now when I see you, I look at you just like a ghost
A shell of your former self, so caught up with that dope
Two niggas singin' two diffеrent notes and you know I gotta coast
Nothin' but a dollar and some hopе
Up in NY, but damn, what hurts me the most
You was a good nigga, we knew each other's folks
Now you gotta ride around with the toast and you keep that shit close
'Cause niggas plottin' on you since you chose
To roll around with the candy paint on spokes
You know 'Ville niggas don't like it when you boast
You know twelve be takin' notes and they watchin' you close
But maybe you don't see 'em 'cause the smoke
Cloudin' your vision from every cigar that you toke
Plus the lean you sippin' which started as a joke
Got you now fiendin' for your next dose, meanwhile I'm so close
Don't even give a fuck that I'm broke
'Cause in my mind I'm rich with shit I done wrote
Therefore I'm convinced that this is supposed to happen
And in time I'ma blow, they gon' label me the GOAT
How long has it been since we spoke?
Last night I jumped up from my sleep, I was soaked
Call it a nightmare, the scene that awoke me
Involved you and niggas I ain't know, they was creepin' up close
I saw the heat tucked in they coats
You didn't notice 'cause you was busy countin' dough
I tried to yell, but nothin' came out of my throat
Niggas cocked back the hammers and you froze, in your eyes I saw hope
Hope of a better way to cope with the pain
And the scars, than the lean and the coke
And I swear in that moment I wish we were still close
Maybe I could've saved you, but no, trigger squeeze, gun smoke
I opened up my eyes with a jolt
Heart pumpin' like Usain Bolt
Reached for my phone, missed calls and a text message note
From my mama sayin' you just got smoked, damn, this life is no joke
You might also like
Close
Fuck113Embed"""

def remove_first_line(lyrics):
    lines = lyrics.split('\n', 1)
    if len(lines) > 1:
        return lines[1]
    else:
        return ""

def remove_end_info(lyrics):
    last_newline_index = lyrics.rfind('\n')
    if last_newline_index != -1:
        last_line = lyrics[last_newline_index+1:]
        match = re.search(r'\d', last_line)
        if match:
            first_number_index = match.start()
            last_line = last_line[:first_number_index]
            lyrics = lyrics[:last_newline_index+1] + last_line
    else:
        match = re.search(r'\d', lyrics)
        if match:
            first_number_index = match.start()
            lyrics = lyrics[:first_number_index]
    return lyrics

def remove_special_characters(lyrics):
    return re.sub(r'[^\w\s]', '', lyrics)

def count_words(lyrics):
    # Split the cleaned lyrics into words and count them
    words = lyrics.split()
    return len(words)

def count_characters(lyrics):
    # Remove special characters
    cleaned_lyrics = re.sub(r'[^\w\s]', '', lyrics)
    return len(cleaned_lyrics)

def average_characters_per_word(num_words, num_characters):
    if num_words > 0:
        return num_characters / num_words
    else:
        return 0

def cleanLyrics(lyrics):
  #cleans lyrics by removing the first line of the song
  lyrics = remove_first_line(lyrics)
  lyrics = remove_end_info(lyrics)
  lyrics = remove_special_characters(lyrics)
  return lyrics

def top_100_words_and_vocabulary_size(lyrics):
    # Split the cleaned lyrics into words
    words = lyrics.split()
    
    # Count the frequency of each word
    word_counts = Counter(words)
    
    # Get the size of the vocabulary (number of unique words)
    vocabulary_size = len(word_counts)
    
    # Return both the top 100 words and the vocabulary size
    return {'vocabulary_size': vocabulary_size, 'top_100_words': word_counts.most_common(100)}

#! before sending it in make sure that it is cleaned and tokenized(into words), removed this because you can optimize better later
# def clean_and_tokenize(text):
#     text = re.sub(r"[^\w\s]", "", text)  # Remove punctuation
#     words = text.lower().split()  # Convert to lowercase and split into words
#     return words

emotionsList = analyze_emotions(lyrics)

num_words = count_words(lyrics)
num_characters = count_characters(lyrics)
avg_chars_per_word = average_characters_per_word(num_words, num_characters)

print("Number of words:", num_words)
print("Number of characters:", num_characters)
print("Average characters per word:", avg_chars_per_word)

result = cleanLyrics(lyrics)
result = top_100_words_and_vocabulary_size(result)
print("Vocabulary size:", result['vocabulary_size'])
print("Top 100 words:", result['top_100_words'])
