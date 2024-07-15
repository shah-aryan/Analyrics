# Initialize lists for various rankings
most_positive_lyrics = []
most_negative_lyrics = []
largest_vocabulary = []
smallest_vocabulary = []
largest_discography = []
most_collaborative = []
least_collaborative = []
highest_reading_level = []
lowest_reading_level = []
most_repetitive = []
least_repetitive = []
longest_songs = []
most_trusting_lyrics = []
most_fearful_lyrics = []
most_surprise_in_lyrics = []
most_joyous_lyrics = []
most_anticipation_in_lyrics = []
most_anger_in_lyrics = []
most_sad_lyrics = []
most_disgust_in_lyrics = []

# Handle rankings based on the document
def handle_rankings(document):
    if document['artistId'] == 690350 or document['artistId'] == 70113:
        return
    name = document['name']
    if name == "The Jimi Hendrix Experience" or name == "The Beatles":
        return
    albumIds = document['albumIds']
    collaborations = document['collaborations']
    numCollaborations = sum(collaborations.values()) - 1
    vocabSize = document['vocabSize']
    topWords = document['top25words']
    readingLevel = document['readingLevel']
    numWords = document['numWords']
    if numWords < 5000:
        return
    numSongs = document['numSongs']
    numChars = document['numChars']
    sentiments = document['sentiments']
    fear = (sentiments[0] / numWords) * 100
    anger = (sentiments[1] / numWords) * 100
    anticipation = (sentiments[2] / numWords) * 100
    trust = (sentiments[3] / numWords) * 100
    surprise = (sentiments[4] / numWords) * 100
    positive = sentiments[5] 
    negative = sentiments[6]
    sadness = (sentiments[7] / numWords) * 100
    disgust = (sentiments[8] / numWords) * 100
    joy = (sentiments[9] / numWords) * 100
    song_length = numWords / numSongs if numSongs > 0 else -1
    repetitiveness = vocabSize / numWords if numWords > 0 else -1

    positiveAndNegative = positive + negative
    positive = (positive / positiveAndNegative) * 100
    negative = (negative / positiveAndNegative) * 100



    def update_top_list(top_list, item, score, reverse=False):
        top_list.append((item, score))
        top_list.sort(key=lambda x: x[1], reverse=reverse)
        if len(top_list) > 5:
            top_list.pop()

    update_top_list(most_negative_lyrics,       document, negative,          reverse=True )
    update_top_list(most_positive_lyrics,       document, positive,          reverse=True )
    update_top_list(largest_vocabulary,         document, vocabSize,         reverse=True )
    update_top_list(smallest_vocabulary,        document, vocabSize,         reverse=False)
    update_top_list(largest_discography,        document, numSongs,          reverse=True )
    update_top_list(most_collaborative,         document, numCollaborations, reverse=True )
    update_top_list(least_collaborative,        document, numCollaborations, reverse=False)
    update_top_list(highest_reading_level,      document, readingLevel,      reverse=True )
    update_top_list(lowest_reading_level,       document, readingLevel,      reverse=False)
    update_top_list(most_repetitive,            document, repetitiveness,    reverse=False)
    update_top_list(least_repetitive,           document, repetitiveness,    reverse=True )
    update_top_list(longest_songs,              document, song_length,       reverse=True )
    update_top_list(most_trusting_lyrics,       document, trust,             reverse=True )
    update_top_list(most_fearful_lyrics,        document, fear,              reverse=True )
    update_top_list(most_surprise_in_lyrics,    document, surprise,          reverse=True )
    update_top_list(most_joyous_lyrics,         document, joy,               reverse=True )
    update_top_list(most_anticipation_in_lyrics,document, anticipation,      reverse=True )
    update_top_list(most_anger_in_lyrics,       document, anger,             reverse=True )
    update_top_list(most_sad_lyrics,            document, sadness,           reverse=True )
    update_top_list(most_disgust_in_lyrics,     document, disgust,           reverse=True )

  
