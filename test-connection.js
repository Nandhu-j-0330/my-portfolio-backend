const { MongoClient } = require('mongodb');
require('dotenv').config();

console.log('🔍 Environment variables loaded');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Missing');

const testConnection = async () => {
  try {
    console.log('\n🚀 Starting MongoDB connection test...');
    console.log('📋 Connection URI:', process.env.MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password
    
    const client = new MongoClient(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4
    });
    
    console.log('🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database operations
    const db = client.db('portfoliodb'); // Explicitly specify database name
    console.log('📁 Database name:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('📦 Available collections:', collections.map(c => c.name));
    
    // Test a simple operation
    const testCollection = db.collection('test');
    const testDoc = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful!' 
    });
    console.log('📝 Test document inserted with ID:', testDoc.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: testDoc.insertedId });
    console.log('🧹 Test document cleaned up');
    
    await client.close();
    console.log('🔐 Connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('📋 Error details:', {
      name: error.name,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname
    });
    return false;
  }
};

// Test different connection string variations
const testVariations = async () => {
  console.log('\n🧪 Testing connection string variations...\n');
  
  const originalUri = process.env.MONGO_URI;
  
  // Variation 1: Add database name if missing
  if (!originalUri.includes('mongodb.net/')) {
    const uriWithDb = originalUri.replace('mongodb.net/?', 'mongodb.net/portfoliodb?');
    process.env.MONGO_URI = uriWithDb;
    console.log('🔄 Testing with database name in URI...');
    const result1 = await testConnection();
    if (result1) return;
  }
  
  // Variation 2: Add connection timeout options
  const uriWithOptions = originalUri.includes('?') 
    ? originalUri + '&serverSelectionTimeoutMS=30000&socketTimeoutMS=45000'
    : originalUri + '?serverSelectionTimeoutMS=30000&socketTimeoutMS=45000';
  
  process.env.MONGO_URI = uriWithOptions;
  console.log('\n🔄 Testing with additional timeout options...');
  const result2 = await testConnection();
  if (result2) return;
  
  // Restore original
  process.env.MONGO_URI = originalUri;
  console.log('\n🔄 Testing original connection string...');
  await testConnection();
};

// Run the test
testVariations();