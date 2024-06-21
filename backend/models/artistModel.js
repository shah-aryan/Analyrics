import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
 artistId: { type: Number, required: true },
 artistName: { type: String, required: true },
 albumIds: { type: [Number], required: true },
 collaborations: {
  type: Map,
  of: Number,
  required: true
 },
 vocabSize: { type: Number, required: true },
 top25words: {
  type: [[Number]],
  required: true
 },
 readingLevel: { type: Number, required: true },
 numWords: { type: Number, required: true },
 numSongs: { type: Number, required: true },
 numChars: { type: Number, required: true },
 sentiments: {
  type: [{
   value: { type: mongoose.Schema.Types.Decimal128, required: true }
  }],
  required: true
 },
 fivePopularSongs: {
  type: [{
   songId: { type: Number, required: true }
  }],
  required: true
 }
});

export const Artist = mongoose.model("Artist", artistSchema);
