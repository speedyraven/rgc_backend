require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const admin   = require('firebase-admin');

const app  = express();

// Use environment variable instead of file
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();
console.log('✅ SUCCESS: Firebase Realtime Database Connected');

app.use(cors());
app.use(express.json());

const prayerRoutes = require('./routes/prayerRoutes')(db);
app.use('/api/prayers', prayerRoutes);

app.get('/', (req, res) => {
  res.send('RGC Mwihoko 2 API is live on Firebase Realtime DB!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});