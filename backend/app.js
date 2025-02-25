require('dotenv').config();
const express = require('express');
const app = express();
const admin = require('firebase-admin');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User');

// Load Firebase Service Account
const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');
let serviceAccount;
try {
    serviceAccount = require(serviceAccountPath);
} catch (error) {
    console.error("❌ Firebase service account file is missing or invalid.");
    process.exit(1);
}

app.use(express.json()); // Middleware for parsing JSON

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ MongoDB URI is missing. Set MONGO_URI in .env file.");
    process.exit(1);
}

// Connect to MongoDB with error handling
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.post('/sessionLogin', async (req, res) => {
    try {
        console.log("🔍 Request Body:", req.body);

        if (!req.body || !req.body.idToken) {
            console.error("❌ idToken is missing in the request.");
            return res.status(400).json({ error: "idToken is required" });
        }

        const idToken = req.body.idToken.trim(); // Ensure no spaces
        console.log("📢 Received ID Token:", idToken);

        // ✅ Ensure token length is reasonable
        if (idToken.length < 200) {
            console.error("❌ Token too short, likely invalid:", idToken);
            return res.status(401).json({ error: "Invalid ID Token" });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("✅ Decoded Token:", decodedToken);

        const { uid, email, name: displayName, picture: photoURL } = decodedToken;

        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({ uid, email, displayName, photoURL });
            await user.save();
            console.log("🆕 New user created:", user);
            return res.status(201).json(user);
        } else {
            user.lastLogin = new Date();
            await user.save();
            console.log("🔄 User login updated:", user);
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error("❌ Error in sessionLogin:", error);
        return res.status(401).json({ error: "Invalid ID Token", details: error.message });
    }
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
