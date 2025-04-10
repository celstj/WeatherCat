import express from 'express';
import { S3 } from 'aws-sdk';
import { MongoClient } from 'mongodb'; // Import MongoDB client
const app = express();

// S3 Configuration (for accessing the private S3 bucket)
const s3 = new S3();
const BUCKET_NAME = 'weathercat-2403'; 

// MongoDB configuration
const mongoURI = process.env.MONGO_URI;
const dbName = 'weatherAttachments'; 
const collectionName = 'weatherAttachments'; 

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to get the image mapping from MongoDB
const getWeatherConditionMapping = async (conditionCode) => {
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Query MongoDB to get the mapping for the weatherCondition code
        const condition = await collection.findOne({ weatherCondition_code: conditionCode });

        return condition; 
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        throw new Error('Error fetching weather condition mapping');
    }
};

// API endpoint to fetch the mascot image
app.get('/api/fetch-cat-mascot', async (req, res) => {
    const { weatherCondition, mode = 'dark_mode' } = req.query; 

    try {
        // Fetch the mapping from MongoDB based on weather condition
        const condition = await getWeatherConditionMapping(weatherCondition);

        if (!condition) {
        return res.status(404).send('Weather condition not found');
        }

        // Get the image URL for the requested mode (light_mode or dark_mode)
        const imageUrl = condition.img_url[mode];

        if (!imageUrl) {
        return res.status(404).send('Mode not found for this weather condition');
        }

        // Fetch the image from the private S3 bucket using the image URL (S3 key)
        const params = {
        Bucket: BUCKET_NAME,
        Key: imageUrl, // Assuming img_url contains the correct S3 key
        };

        // Fetch the image from S3
        const data = await s3.getObject(params).promise();
        res.set('Content-Type', 'image/gif'); // Assuming the image is a GIF
        res.send(data.Body); // Send the image as a response
    } catch (err) {
        console.error('Error fetching mascot image:', err);
        res.status(500).send('Error fetching image');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
