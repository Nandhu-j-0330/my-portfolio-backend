 
require('dotenv').config();
const { MongoClient } = require('mongodb');
const dns = require('dns').promises;

const testMumbaiCluster = async () => {
  console.log('🇮🇳 Testing Mumbai region cluster patterns...\n');
  
  // Common MongoDB Atlas hostname patterns for Mumbai region
  const possibleHostnames = [
    'portfoliodb.ltts5u.mongodb.net', // Current
    'portfoliodb-shard-00-00.ltts5u.mongodb.net', // Shard pattern
    'cluster0.ltts5u.mongodb.net', // Default naming
    'cluster0-shard-00-00.ltts5u.mongodb.net', // Default shard
  ];
  
  console.log('🔍 Testing DNS resolution for different hostname patterns:');
  
  for (const hostname of possibleHostnames) {
    try {
      console.log(`🔄 Testing: ${hostname}`);
      const result = await dns.lookup(hostname);
      console.log(`✅ SUCCESS: ${hostname} → ${result.address}`);
    } catch (error) {
      console.log(`❌ FAILED: ${hostname} → ${error.code}`);
    }
  }
  
  console.log('\n🧪 Testing connection with different URI patterns:');
  
  // Test pattern 1: Your current
  const uri1 = process.env.MONGO_URI;
  await testConnectionQuick(uri1, 'Current URI');
  
  // Test pattern 2: Try cluster0 pattern
  const uri2 = process.env.MONGO_URI.replace('portfoliodb.ltts5u', 'cluster0.ltts5u');
  await testConnectionQuick(uri2, 'Cluster0 pattern');
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. If all tests fail, try mobile hotspot');
  console.log('2. Your ISP/network might be blocking MongoDB Atlas');
  console.log('3. Try downloading MongoDB Compass to test connectivity');
};

const testConnectionQuick = async (uri, testName) => {
  if (!uri || !uri.includes('mongodb')) {
    console.log(`\n❌ ${testName}: Invalid URI`);
    return;
  }
  
  try {
    console.log(`\n🔄 ${testName}:`);
    console.log(`   URI: ${uri.replace(/:[^:]*@/, ':****@')}`);
    
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    
    await client.connect();
    console.log(`   ✅ SUCCESS! Connected to ${testName}`);
    await client.close();
    return true;
  } catch (error) {
    console.log(`   ❌ Failed: ${error.code || error.message}`);
    return false;
  }
};

// Also test basic network connectivity to MongoDB Atlas
const testNetworkToAtlas = async () => {
  console.log('\n🌐 Testing network connectivity to MongoDB Atlas:');
  
  const { exec } = require('child_process');
  const util = require('util');
  const execAsync = util.promisify(exec);
  
  try {
    // Test general MongoDB Atlas connectivity
    console.log('🔄 Testing MongoDB Atlas main domain...');
    const { stdout } = await execAsync('ping -n 2 cloud.mongodb.com');
    console.log('✅ Can reach MongoDB Atlas:', stdout.split('\n')[2]);
  } catch (error) {
    console.log('❌ Cannot reach MongoDB Atlas - network/firewall issue');
    console.log('   Try connecting via mobile hotspot to test');
  }
};

const runFullTest = async () => {
  await testNetworkToAtlas();
  await testMumbaiCluster();
};

runFullTest();