const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

(async () => {
    try {
        console.log('Starting MongoMemoryServer...');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        console.log('URI:', uri);
        await mongoose.connect(uri);
        console.log('Connected!');
        await mongoose.disconnect();
        await mongod.stop();
    } catch (e) {
        console.error('Error:', e);
    }
})();
