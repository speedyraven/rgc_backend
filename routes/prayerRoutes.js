const express = require('express');

// Notice: we export a function that receives db
module.exports = (db) => {
  const router = express.Router();

  // POST: Save a new prayer request
  router.post('/', async (req, res) => {
    const { name, phone, email, request } = req.body;

    if (!name || !request) {
      return res.status(400).json({ error: 'Name and request are required.' });
    }

    try {
      await db.ref('prayerRequests').push({
        name,
        phone: phone || '',
        email: email || '',
        request,
        timestamp: new Date().toISOString()
      });

      res.status(201).json({ message: 'Prayer request saved successfully!' });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET: See all prayer requests
  router.get('/', async (req, res) => {
    try {
      const snapshot = await db.ref('prayerRequests').once('value');
      const data     = snapshot.val();

      const prayers = data
        ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
        : [];

      res.json(prayers);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};