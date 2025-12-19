const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config()
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/community-chat")
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  status: { type: String, default: "offline" },
  createdAt: { type: Date, default: Date.now },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  files: [
    {
      _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
      name: String,
      url: String,
      type: {
        type: String,
        enum: ["image", "video", "document"]
      },
      createdAt: String,
      size: Number,
      mimeType: String,

    }
  ]

});

const User = mongoose.model("User", userSchema);
const app = express();

const upload = multer({ dest: "uploads/" });

const KEYFILEPATH = path.join(__dirname, "key.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const uploadMiddleWare = upload.fields([{name: "photos", maxCount: 10}, {name: "videos", maxCount: 5}, {name: "documents", maxCount: 10}])



app.post("/uploadfile/:userId", uploadMiddleWare, async (req, res) => {
  // console.log(req.files)

  if (!req.files) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const user = req.params.userId

  const drive = google.drive({
    version: "v3",
    auth,
  });





  try {
    await drive.files.get({
      fileId: process.env.PARENT_ID,
      supportsAllDrives: true,
    });


    

const photoIds = []
const videoIds = []
const documentIds = []

  if (req.files.photos?.length) {
    for (let each of req.files.photos ) {

     const response = await drive.files.create({
        requestBody: {
          name: each.originalname,
          parents: [process.env.PARENT_ID],
        },
        media: {
          mimeType: each.mimetype,
          body: fs.createReadStream(each.path),
        },
        supportsAllDrives: true,
        fields: "id, name",
      });

      photoIds.push({id: response.data.id, name: response.data.name})
      
    }

  }


  if (req.files.videos?.length) {
    for (let each of req.files.videos ) {

      const response = await drive.files.create({
        requestBody: {
          name: each.originalname,
          parents: [process.env.PARENT_ID],
        },
        media: {
          mimeType: each.mimetype,
          body: fs.createReadStream(each.path),
        },
        supportsAllDrives: true,
        fields: "id, name",
      });

      videoIds.push({id: response.data.id, name: response.data.name})

      
    }
  }


  if (req.files.documents?.length) {
    for (let each of req.files.documents ) {

      const response = await drive.files.create({
        requestBody: {
          name: each.originalname,
          parents: [process.env.PARENT_ID],
        },
        media: {
          mimeType: each.mimetype,
          body: fs.createReadStream(each.path),
        },
        supportsAllDrives: true,
        fields: "id, name",
      });

      documentIds.push({id: response.data.id, name: response.data.name})

      
    }
  }

 




  console.log(photoIds)
  console.log(videoIds)

  console.log(documentIds)

  const allUsers = await User.find()
  const currentUser = await User.findOne({id: user})

  console.log(allUsers)
  console.log(currentUser)






  

    // fs.unlinkSync(req.file.path);

    return res.status(200).json({
      message: "Upload successful",
      // photoResponse, videoResponse, documentResponse

      // fileId: response.data.id,
      // fileName: response.data.name,
    });
  } catch (err) {
    console.log(err)
    console.error("Upload failed:", err.message);

    // if (fs.existsSync(req.file.path)) {
    //   fs.unlinkSync(req.file.path);
    // }

    return res.status(500).json({
      error: err.message,
    });
  }
});

const port = 3603;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});