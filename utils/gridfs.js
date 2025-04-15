import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gridfsBucket;

const initGridFS = () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not connected; GridFS not initialized');
      return;
    }
    const db = mongoose.connection.db;
    gridfsBucket = new GridFSBucket(db, { bucketName: 'videos' });
    console.log('GridFS initialized');
  } catch (error) {
    console.error('GridFS initialization error:', error);
  }
};

export { gridfsBucket, initGridFS };