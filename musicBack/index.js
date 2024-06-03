import express from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Artist } from "./models/artistModel.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Hello, world!");
});

// Route to get all artists
app.get("/artists", async (req, res) => {
  try {
    const artists = await Artist.find();
    return res.status(200).json(artists);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// app.get("/search", async (req, res) => {
//   try {
//     const searchQuery = req.query.search || "";
//     const regex = new RegExp(searchQuery, 'i');

//     // Perform parallel searches
//     const [artists, albums, songs] = await Promise.all([
//       Artist.find({ name: regex }),
//       Album.find({ title: regex }),
//       Song.find({ title: regex })
//     ]);

//     // Combine results into a single response object
//     const results = {
//       artists,
//       albums,
//       songs
//     };

//     return res.status(200).json(results);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// });

//! Search only artists
app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const regex = new RegExp(searchQuery, 'i');

    // Search artists
    const artists = await Artist.find({ name: regex });

    // Return results
    const results = {
      artists
    };

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to get an artist by custom field 'i'
app.get("/artists/:i", async (req, res) => {
  try {
    const artist = await Artist.findOne({ i: parseInt(req.params.i) });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    return res.status(200).json(artist);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}); 

mongoose
  .connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });
