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
        console.log("🔍 Request Body:", req.body); // Kiểm tra dữ liệu từ client gửi lên

        if (!req.body || !req.body.idToken) {
            return res.status(400).json({ error: "idToken is required" });
        }

        const idToken = req.body.idToken; // Lấy token từ request
        console.log("📢 Received ID Token:", idToken); // Debug kiểm tra

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        console.log("✅ Decoded Token:", decodedToken);

        const { uid, email, name: displayName, picture: photoURL } = decodedToken;

        let user = await User.findOne({ uid });

        if (!user) {
            user = new User({ uid, email, displayName, photoURL });
            await user.save();
            return res.status(201).json(user);
        } else {
            user.lastLogin = new Date();
            await user.save();
            return res.status(200).json(user);
        }
    } catch (error) {
        console.error("❌ Error in sessionLogin:", error.code, error.message);
        return res.status(401).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
