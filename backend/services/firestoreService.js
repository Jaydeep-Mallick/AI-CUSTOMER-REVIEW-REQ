const { db } = require('../firebase/config');
const { v4: uuidv4 } = require('uuid');

// In-memory fallback if Firebase is not configured
const mockDB = {
  generations: [],
  feedback: []
};

const saveGeneration = async (data) => {
  const docData = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  if (db) {
    const docRef = await db.collection('generations').add(docData);
    return { id: docRef.id, ...docData };
  } else {
    // Fallback
    const id = uuidv4();
    const newDoc = { id, ...docData };
    mockDB.generations.push(newDoc);
    return newDoc;
  }
};

const getGenerations = async () => {
  if (db) {
    const snapshot = await db.collection('generations')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } else {
    // Fallback
    return [...mockDB.generations].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
};

const getGenerationById = async (id) => {
  if (db) {
    const doc = await db.collection('generations').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  } else {
    // Fallback
    return mockDB.generations.find(g => g.id === id) || null;
  }
};

const deleteGeneration = async (id) => {
  if (db) {
    await db.collection('generations').doc(id).delete();
    return true;
  } else {
    // Fallback
    const index = mockDB.generations.findIndex(g => g.id === id);
    if (index !== -1) {
      mockDB.generations.splice(index, 1);
      return true;
    }
    return false;
  }
};

const saveFeedback = async (data) => {
  const { generationId, rating, comment } = data;
  const docData = {
    generationId,
    rating,
    comment: comment || null,
    createdAt: new Date().toISOString()
  };

  if (db) {
    // Save to feedback collection
    const docRef = await db.collection('feedback').add(docData);
    
    // Optionally update the generation document with the rating for easier querying
    if (generationId) {
      await db.collection('generations').doc(generationId).update({
        rating: rating
      });
    }
    
    return { id: docRef.id, ...docData };
  } else {
    // Fallback
    const id = uuidv4();
    const newDoc = { id, ...docData };
    mockDB.feedback.push(newDoc);
    
    const genIndex = mockDB.generations.findIndex(g => g.id === generationId);
    if (genIndex !== -1) {
      mockDB.generations[genIndex].rating = rating;
    }
    
    return newDoc;
  }
};

const getAnalyticsData = async () => {
  let generations = [];
  
  if (db) {
    const snapshot = await db.collection('generations').get();
    generations = snapshot.docs.map(doc => doc.data());
  } else {
    generations = mockDB.generations;
  }

  const totalGenerations = generations.length;
  
  // Calculate average rating
  const ratedGenerations = generations.filter(g => g.rating);
  const totalRatings = ratedGenerations.reduce((sum, g) => sum + g.rating, 0);
  const averageRating = ratedGenerations.length > 0 
    ? (totalRatings / ratedGenerations.length).toFixed(1) 
    : 0;

  // Calculate positive feedback % (rating >= 4)
  const positiveRatings = ratedGenerations.filter(g => g.rating >= 4).length;
  const positiveFeedback = ratedGenerations.length > 0
    ? Math.round((positiveRatings / ratedGenerations.length) * 100)
    : 0;

  // Process tones
  const toneUsage = {};
  generations.forEach(g => {
    const tone = g.tone || 'Friendly';
    toneUsage[tone] = (toneUsage[tone] || 0) + 1;
  });

  // Process trip types
  const tripTypes = {};
  generations.forEach(g => {
    const type = g.tripType || 'Other';
    tripTypes[type] = (tripTypes[type] || 0) + 1;
  });

  // Take top 5 trip types
  const sortedTripTypes = Object.entries(tripTypes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

  // Group by day for the last 7 days
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const generationsPerDay = {};
  last7Days.forEach(date => generationsPerDay[date] = 0);

  generations.forEach(g => {
    const dateStr = new Date(g.createdAt).toISOString().split('T')[0];
    if (generationsPerDay[dateStr] !== undefined) {
      generationsPerDay[dateStr]++;
    }
  });

  return {
    totalGenerations,
    averageRating: parseFloat(averageRating),
    positiveFeedback,
    generationsPerDay: {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
      data: Object.values(generationsPerDay)
    },
    toneUsage: {
      labels: Object.keys(toneUsage),
      data: Object.values(toneUsage)
    },
    tripTypes: {
      labels: Object.keys(sortedTripTypes),
      data: Object.values(sortedTripTypes)
    }
  };
};

module.exports = {
  saveGeneration,
  getGenerations,
  getGenerationById,
  deleteGeneration,
  saveFeedback,
  getAnalyticsData
};
