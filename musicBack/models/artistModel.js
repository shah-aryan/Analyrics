import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
  i: { type: Number, required: true },
  name: { type: String, required: true },
  albums: { type: [Number], description: 'array of ids of albums' },
  collaborationNetwork: { type: [Number], description: 'must be an array of integers representing artist ids or null' },
  vocabularySize: { type: Number, default: null, description: 'must be an integer or null' },
  mostUsedWords: {
    type: [{
      word: { type: String, required: true },
      count: { type: Number, required: true }
    }],
    default: null,
    description: 'must be an array of objects containing a string (word) and an integer (count) or null'
  },
  readingLevel: { type: Number, default: null, description: 'must be a double or null' },
  numberOfWords: { type: Number, default: null, description: 'must be an integer or null' },
  numberOfSongs: { type: Number, default: null, description: 'must be an integer or null' },
  numberOfCharacters: { type: Number, default: null, description: 'must be an integer or null' },
  averageSentenceLength: { type: Number, default: null, description: 'must be a double or null' },
  averageWordLength: { type: Number, default: null, description: 'must be a double or null' },
  averageSongLengthWords: { type: Number, default: null, description: 'must be an integer or null' },
  averageSongLengthSeconds: { type: Number, default: null, description: 'must be an integer or null' },
  varianceOfEmotionsOfAlbums: {
    type: [Number],
    validate: [array => array.length === 10, 'must have exactly 10 items'],
    description: 'all_emotions = [fear, anger, anticipation, trust, surprise, positive, negative, sadness, disgust, joy]'
  },
  emotion: {
    type: [Number],
    validate: [array => array.length === 10, 'must have exactly 10 items'],
    description: 'all_emotions = [fear, anger, anticipation, trust, surprise, positive, negative, sadness, disgust, joy]'
  }
});

export const Artist = mongoose.model("Artist", artistSchema);
