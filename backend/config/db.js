const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentalwellness');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// MongoDB Atlas connection (alternative)
const connectMongoAtlas = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_ATLAS_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

// Supabase connection for backend services
const { createClient } = require('@supabase/supabase-js');

const connectSupabase = () => {
  try {
    // These would typically come from environment variables
    const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'your-service-key';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
    return supabase;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDB,
  connectMongoAtlas,
  connectSupabase
};