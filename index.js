const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
require("dotenv").config()
const mongoose = require("mongoose");
const cors = require('cors')
const authMiddleware =  require('./middleware/authMiddleware')


const app = express();



app.use(cors())

app.use(express.json())


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
  // files: [
  //   {
  //     _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
  //     name: String,
  //     url: String,
  //     type: {
  //       type: String,
  //       enum: ["image", "video", "document"]
  //     },
  //     createdAt: { type: Date, default: Date.now },
  //     size: Number,
  //     mimeType: String,

  //   }
  // ]

});




const fileSchema = new mongoose.Schema({
  
    _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
    name: String,
    url: String,
    type: {
      type: String,
      enum: ["image", "video", "document"]
    },
    createdAt: { type: Date, default: Date.now },
    size: Number,
    mimeType: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}

  

})

const User = mongoose.model("User", userSchema);

const File = mongoose.model("File", fileSchema)

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

  const userId = req.params.userId

  const drive = google.drive({
    version: "v3",
    auth,
  });





  try {
    await drive.files.get({
      fileId: process.env.PARENT_ID,
      supportsAllDrives: true,
    });


    

// const photoIds = []
// const videoIds = []
// const documentIds = []

const allFiles = []

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

      allFiles.push({url: response.data.id, name: response.data.name, mimeType: each.mimetype, size: each.size, type: "image", user: userId})
      
      fs.unlinkSync(each.path);

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

      allFiles.push({url: response.data.id, name: response.data.name, mimeType: each.mimetype, size: each.size, type: "video", user: userId})

      fs.unlinkSync(each.path);

      
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

      allFiles.push({url: response.data.id, name: response.data.name, mimeType: each.mimetype, size: each.size, type: "document", user: userId})

      fs.unlinkSync(each.path);


      
    }
  }

 




  // console.log(photoIds)
  // console.log(videoIds)

  // console.log(documentIds)

  console.log(allFiles)

  // const allUsers = await User.find()
  // const currentUser = await User.updateOne({_id: user}, {files: allFiles})
  const insertFiles = await File.insertMany(allFiles)

  // console.log(allUsers)
  console.log(insertFiles)






  

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


app.get('/allfiles/:userId', async (req, res) => {

  const userId = req.params.userId

  try {

    const allFiles =  await File.find({user: userId}, 
      // {url: 1, user: 1}
    )

    res.json({allFiles})

    

    


  } catch (err) {
    console.log(err)
  }
})





const port = 3603;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});