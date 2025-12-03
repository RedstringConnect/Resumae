import mongoose from 'mongoose';

export async function connectDB(uri) {
  const MONGODB_URI = uri || 'mongodb://localhost:27017/resumatic';

  console.log('📋 Environment check:');
  console.log('   - MONGODB_URI exists:', !!uri);
  console.log('   - PORT:', process.env.PORT || '5000 (default)');
  console.log('   - Connecting to:', MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');
  console.log('');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    if (MONGODB_URI.includes('localhost')) {
      console.error('   - Make sure MongoDB is running locally: mongod');
      console.error('   - Or update MONGODB_URI in .env to use MongoDB Atlas');
    } else {
      console.error('   - Check your MongoDB Atlas connection string');
      console.error('   - Verify your IP is whitelisted in Atlas');
      console.error('   - Verify database user credentials are correct');
    }
    throw err;
  }
}

