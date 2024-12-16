import express from 'express';
import { connectToDatabase } from './connectToDatabase.js';
import { getWeatherImage } from './queries/getWeatherImage.js';

const app = express();
app.use(express.json());

// Connect to MongoDB at startup
let client;

connectToDatabase()
    .then((connectedClient) => {
        client = connectedClient;
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
        process.exit(1); // Exit the app if the DB connection fails
    });

// Route to fetch weather images
app.get('/api/weatherAttachments', async (req, res) => {
    try {
        const { condition } = req.query;
        const image = await getWeatherImage(client, condition);

        if (image) {
            res.json({ url: image });
        } else {
            res.status(404).json({ message: 'No image found' });
        }
    } catch (error) {
        console.error('Error fetching weather image:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
