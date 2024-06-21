import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
  albumId: { type: Number, required: true, description: 'must be an integer and is required' },
  artistId: { type: [Number], required: true, description: 'must be an array of integers and is required' },
  name: { type: String, required: true, description: 'must be a string and is required' },
  releaseDate: {
    type: String,
    match: /^\d{4}-\d{2}-\d{2}$/,
    required: true,
    description: 'must be a string in ISO 8601 date format and is required'
  },
  songs: { type: [Number], required: true, description: 'must be an array of integers and is required' },
  numWords: { type: Number, required: true, description: 'must be an integer and is required' },
  top25words: {
    type: Map,
    of: Number,
    required: true,
    description: 'must be a dictionary with string keys and integer values and is required'
  },
  vocabSize: { type: Number, required: true, description: 'must be an integer and is required' },
  sentiments: {
    type: [Number],
    required: true,
    description: 'must be an array of doubles and is required'
  },
  collaborations: {
    type: Map,
    of: Number,
    required: true,
    description: 'must be a dictionary with integer keys and values and is required'
  },
  numberInDiscography: { type: Number, required: true, description: 'must be an integer and is required' },
  readingLevel: { type: Number, required: true, description: 'must be a double and is required' },
  numChars: { type: Number, required: true, description: 'must be an integer and is required' }
});

export const Album = mongoose.model("Album", albumSchema);
