from nrclex import NRCLex
import re

# lyrics = """124 ContributorsTranslationsEspañolРусскийPortuguêsJ. Cole - c l o s e (Traduzione Italiana)​​c l o s e Lyrics
# Yeah
# Close
# Ville-matic, one, one
# One, one, one-two, one
# One-two, one, one-two, one
# One-two, one, one, listen

# Close, I stare at my dreams as they approach
# Gotta be patient and trust in God, He the coach
# Temptations are taking a shortcut, but I don't
# 'Cause I ain't tryna be a almost, when I get it, I'ma float
# Gone are the days we was close
# Now when I see you, I look at you just like a ghost
# A shell of your former self, so caught up with that dope
# Two niggas singin' two diffеrent notes and you know I gotta coast
# Nothin' but a dollar and some hopе
# Up in NY, but damn, what hurts me the most
# You was a good nigga, we knew each other's folks
# Now you gotta ride around with the toast and you keep that shit close
# 'Cause niggas plottin' on you since you chose
# To roll around with the candy paint on spokes
# You know 'Ville niggas don't like it when you boast
# You know twelve be takin' notes and they watchin' you close
# But maybe you don't see 'em 'cause the smoke
# Cloudin' your vision from every cigar that you toke
# Plus the lean you sippin' which started as a joke
# Got you now fiendin' for your next dose, meanwhile I'm so close
# Don't even give a fuck that I'm broke
# 'Cause in my mind I'm rich with shit I done wrote
# Therefore I'm convinced that this is supposed to happen
# And in time I'ma blow, they gon' label me the GOAT
# How long has it been since we spoke?
# Last night I jumped up from my sleep, I was soaked
# Call it a nightmare, the scene that awoke me
# Involved you and niggas I ain't know, they was creepin' up close
# I saw the heat tucked in they coats
# You didn't notice 'cause you was busy countin' dough
# I tried to yell, but nothin' came out of my throat
# Niggas cocked back the hammers and you froze, in your eyes I saw hope
# Hope of a better way to cope with the pain
# And the scars, than the lean and the coke
# And I swear in that moment I wish we were still close
# Maybe I could've saved you, but no, trigger squeeze, gun smoke
# I opened up my eyes with a jolt
# Heart pumpin' like Usain Bolt
# Reached for my phone, missed calls and a text message note
# From my mama sayin' you just got smoked, damn, this life is no joke
# You might also like
# Close
# Fuck113Embed"""

# Ensure that NRCLex is installed in your environment with:
# pip install NRCLex

# Function to clean and tokenize the text


# Function to calculate overall emotion scores using NRC Lexicon
def analyze_emotions(text):
    # Check if the text contains between 100 and 1000 words
    word_count = len(text.split())


    # Analyze the text using NRCLex
    emotions = NRCLex(" ".join(text))

    # Aggregate emotions
    emotion_scores = emotions.raw_emotion_scores

    # Create a list of all 10 emotions with their counts
    all_emotions = ['fear', 'anger', 'anticipation', 'trust', 'surprise', 'positive', 'negative', 'sadness', 'disgust', 'joy']
    emotion_list = [emotion_scores.get(emotion, 0) for emotion in all_emotions]

    # #sum of all emotion scores
    # sum_emotion_scores = sum(emotion_list)

    # #normalize the emotion scores
    # emotion_list = [score / sum_emotion_scores for score in emotion_list]

    return emotion_list

def print_emotions(emotion_scores):
  all_emotions = [
    'fear', 'anger', 'anticipation', 'trust', 'surprise', 'positive',
    'negative', 'sadness', 'disgust', 'joy'
  ]
  sorted_emotions = sorted(zip(all_emotions, emotion_scores), key=lambda x: x[1], reverse=True)
  for emotion, score in sorted_emotions:
    print(f"{emotion.capitalize()}: {score}")

