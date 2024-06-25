import express from "express";
import { MongoClient } from "mongodb";
import { PORT, mongoDBURL } from "./config.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

let db;

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Hello, world!");
});

app.get("/artists", async (req, res) => {
  try {
    const artists = await db.collection("artists").find().toArray();
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const regex = new RegExp(searchQuery, 'i');

    const artists = await db.collection("artists").find({ name: { $regex: regex } }).limit(20).toArray();
    let resultsCount = artists.length;

    let albums = [];
    if (resultsCount < 20) {
      albums = await db.collection("albums").find({ name: { $regex: regex } }).limit(20 - resultsCount).toArray();
      resultsCount += albums.length;
    }

    let songs = [];
    if (resultsCount < 20) {
      songs = await db.collection("songs").find({ name: { $regex: regex } }).limit(20 - resultsCount).toArray();
    }

    const results = { artists, albums, songs };
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


app.get("/artists/:artistId", async (req, res) => {
  try {
    const artist = await db.collection("artists").findOne({ artistId: parseInt(req.params.artistId) });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    const albumIds = artist.albumIds;
    const albums = [];
    for (const id of albumIds) {
      const album = await db.collection("albums").findOne({ albumId: id });
      if (album) {
        albums.push(album);
      }
    }
    const artistWithAlbums = { ...artist, albums: albums };
    return res.status(200).json(artistWithAlbums);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/albums/:albumId", async (req, res) => {
  try {
    const album = await db.collection("albums").findOne({ albumId: parseInt(req.params.albumId) });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    const songIds = album.songs;
    const songs = [];
    for (const id of songIds) {
      const song = await db.collection("songs").findOne({ songId: id });
      if (song) {
        songs.push(song);
      }
    }
    const artistName = (await db.collection("lookup").findOne({ artistId: album.artistId })).name;
    const albumWithSongs = { ...album, artistName: artistName, songsObj: songs };;

    return res.status(200).json(albumWithSongs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/lookup", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.every(id => !isNaN(parseInt(id)))) {
      return res.status(400).json({ message: "Please provide an array of valid numeric IDs" });
    }

    const artistNames = [];

    for (const id of ids) {
      const artist = await db.collection("lookup").findOne({ artistId: parseInt(id) });
      if (artist) {
        artistNames.push(artist.name);
      }
    }
    
    return res.status(200).json(artistNames);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



app.get("/songs/:songId", async (req, res) => {
  try {
    const song = await db.collection("songs").findOne({ songId: parseInt(req.params.songId) });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    return res.status(200).json(song);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/lookup", async (req, res) => {
  try {
    console.log(req.body);
    const { ids } = req.body;
    if (!Array.isArray(ids) || !ids.every(id => !isNaN(parseInt(id)))) {
      return res.status(400).json({ message: "Please provide an array of valid numeric IDs" });
    }

    const artistNames = [];

    for (const id of ids) {
      const artist = await db.collection("lookup").findOne({ artistId: id });
      if (artist) {
        artistNames.push(artist.name);
      }
    }
    
    return res.status(200).json(artistNames);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});




MongoClient.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB", error);
  });
