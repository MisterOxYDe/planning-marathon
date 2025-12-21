import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

/**
 * 1️⃣ Redirection vers Strava (OAuth)
 */
app.get("/login", (req, res) => {
  const redirectUrl =
    `https://www.strava.com/oauth/authorize` +
    `?client_id=${process.env.STRAVA_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${process.env.BASE_URL}/exchange_token` +
    `&approval_prompt=auto` +
    `&scope=read,activity:read_all`;

  res.redirect(redirectUrl);
});

/**
 * 2️⃣ Échange code → access token
 */
app.get("/exchange_token", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
      }
    );

    res.redirect(
      `${process.env.FRONT_URL}/activities.html?token=${response.data.access_token}`
    );
  } catch (error) {
    res.status(500).send("Erreur lors de l'authentification Strava");
  }
});

/**
 * 3️⃣ Récupération des activités
 */
app.get("/activities", async (req, res) => {
  const { token } = req.query;

  try {
    const activities = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities?per_page=50",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json(activities.data);
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Strava démarré sur le port ${PORT}`);
});
