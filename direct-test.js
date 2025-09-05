const { MongoClient } = require('mongodb');
const dns = require('dns').promises;
require('dotenv').config();

// Test DNS resolution
const testDNS = async () => {
  const hostname = 'portfoliodb.ltts5u.mongodb.net';
  console.log(`🔍 Testing DNS resolution for: ${hostname}`);
  
  try {
    // Test regular DNS lookup
    const addresses = await dns.lookup(hostname);
    console.log('✅ DNS lookup successful:', addresses);
    
    // Test SRV record lookup (what MongoDB uses)
    try {
      const srvRecords = await dns.resolveSrv(`_mongodb._tcp.${hostname}`);
      console.log('✅ SRV records found:', srvRecords);
    } catch (srvError) {
      console.error('❌ SRV lookup failed:', srvError.message);
    }
    
  } catch (error) {
    console.error('❌ DNS lookup failed:', error.message);
    
    // Try with different DNS servers
    console.log('🔄 Trying with Cloudflare DNS...');
    dns.setServers(['1.1.1.1', '1.0.0.1']);
    
    try {
      const addresses2 = await dns.lookup(hostname);
      console.log('✅ Cloudflare DNS successful:', addresses2);
    } catch (error2) {
      console.error('❌ Cloudflare DNS failed:', error2.message);
    }
  }
};

// Test with standard connection string (non-SRV)
const testStandardConnection = async () => {
  console.log('\n🔄 Trying standard connection format...');
  
  // You'll need to get this from your MongoDB Atlas - Connect -> Drivers -> Standard connection
  // For now, let's try to construct it
  const standardUri = 'mongodb://portfoliodb-shard-00-00.ltts5u.mongodb.net:27017,portfoliodb-shard-00-01.ltts5u.mongodb.net:27017,portfoliodb-shard-00-02.ltts5u.mongodb.net:27017/portfoliodb?ssl=true&replicaSet=atlas-12345-shard-0&authSource=admin&retryWrites=true&w=majority';
  
  console.log('⚠️ Note: You may need to get the exact standard connection string from Atlas');
  console.log('📋 Standard URI format example shown above');
};

// Test network connectivity
const testNetwork = async () => {
  console.log('\n🌐 Testing network connectivity...');
  
  const { exec } = require('child_process');
  const util = require('util');
  const execAsync = util.promisify(exec);
  
  try {
    // Test ping to MongoDB cluster
    const { stdout } = await execAsync('ping -n 4 portfoliodb.ltts5u.mongodb.net');
    console.log('✅ Ping successful:', stdout.split('\n')[0]);
  } catch (error) {
    console.error('❌ Ping failed:', error.message);
  }
  
  try {
    // Test nslookup
    const { stdout: nslookup } = await execAsync('nslookup portfoliodb.ltts5u.mongodb.net');
    console.log('✅ NSLookup result:', nslookup.split('\n').slice(0, 3).join('\n'));
  } catch (error) {
    console.error('❌ NSLookup failed:', error.message);
  }
};

// Alternative connection methods
const tryAlternatives = async () => {
  console.log('\n🧪 Trying alternative connection methods...\n');
  
  // Method 1: Force resolve with custom options
  const client1 = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    family: 4,
    hints: 0,
  });
  
  try {
    console.log('🔄 Method 1: Custom DNS options...');
    await client1.connect();
    console.log('✅ Method 1 successful!');
    await client1.close();
    return true;
  } catch (error) {
    console.error('❌ Method 1 failed:', error.message);
  }
  
  // Method 2: Try without SRV (you'll need the actual hosts)
  console.log('\n🔄 Method 2: Check if you need to use standard connection string...');
  console.log('📋 Go to Atlas -> Connect -> Connect your application -> Select "Standard connection string" instead of SRV');
  
  return false;
};

// Main test function
const runAllTests = async () => {
  console.log('🚀 Starting comprehensive connection diagnostics...\n');
  
  await testDNS();
  await testNetwork();
  await testStandardConnection();
  await tryAlternatives();
  
  console.log('\n📋 Summary of recommendations:');
  console.log('1. Try restarting your computer to clear all DNS caches');
  console.log('2. Check if your ISP/corporate firewall blocks MongoDB Atlas');
  console.log('3. Try connecting from mobile hotspot to test network');
  console.log('4. Get standard connection string from Atlas (not SRV)');
  console.log('5. Try connecting from a different network location');
};

runAllTests();