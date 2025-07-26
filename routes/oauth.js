const express = require("express");
const router = express.Router();
const { createConnection, getAuthUrl } = require("../salesforce"); //sali di un livello
const { sendMessage, setTelegramMessage } = require("../telegram");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.get("/oauth2/auth", (req, res) => {
  res.redirect(getAuthUrl());
});

router.get("/oauth2/callback", async (req, res) => {
  const conn = createConnection();
  const code = req.query.code;

  try {
    const userInfo = await conn.authorize(code);

    console.log("Access Token:", conn.accessToken);
    console.log("Refresh Token:", conn.refreshToken);
    console.log("Instance URL:", conn.instanceUrl);
    console.log("User ID:", userInfo.id);
    console.log("Org ID:", userInfo.organizationId);

    //subscribe Cdc
    const eventName = "/data/ContactChangeEvent";
    conn.streaming.topic(eventName).subscribe((payload) => {
      console.log("payload:", payload.payload);
      // Invia un messaggio
      console.log("Received message:\n", JSON.stringify(payload, null, 2));
      sendMessage(process.env.CHAT_ID, setTelegramMessage(payload));
    });

    res.redirect(process.env.SF_USER_REDIRECT_AFTER_LOGIN);
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).send("Authorization failed");
  }
});

module.exports = router;
