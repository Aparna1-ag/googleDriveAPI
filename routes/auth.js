const express = require("express");
const authClient = require("./googleAuth");
const router = express.Router();
const { google } = require("googleapis")
const { setToken } = require("../tokenStore")

router.get("/google", (req, res) => {
  const authUrl = authClient.generateAuthUrl({
    access_type: "online",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });

  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await authClient.getToken(code);

    setToken(tokens.access_token)

    console.log(tokens.access_token)


    // authClient.setCredentials(tokens);

    // const drive = google.drive({
    //   version: "v3",
    //   auth: authClient,
    // });

    // const response = await drive.files.create({
    //   requestBody: {
    //     name: "Test",
    //     mimeType: "text/plain",
    //   },
    //   media: {
    //     mimeType: "text/plain",
    //     body: "Hello World we are here! welcome to google drive ",
    //   },
    // });

    // console.log(response.data)

    res.json({
      message: "Google authentication successful",
      accessToken: tokens.access_token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `Google Authentication Failed, ${err}` });
  }
});

module.exports = router;
