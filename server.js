// server.js

import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb'; // Import ObjectId for querying by _id
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;

// MongoDB URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

// Database and Collection
const dbName = 'machines';

// __dirname and __filename replacement for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(dbName);
        console.log(`Connected to MongoDB database: ${dbName}`);

        // Middleware
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json()); // JSON body parser
        app.use(express.static(path.join(__dirname, 'frontend/build'))); // Serve React build files

        // API Route to fetch all treatments
        app.get('/api/treatments', async (req, res) => {
            try {
                const treatments = await db.collection('treatments').find({}).toArray();
                res.json(treatments);
            } catch (err) {
                console.error('Error fetching treatments:', err);
                res.status(500).json({ error: 'Failed to fetch treatments' });
            }
        });

        // API Route to fetch treatments by machineType
        app.get('/api/treatments/:machineType', async (req, res) => {
            const { machineType } = req.params;

            try {
                const treatments = await db.collection('treatments').find({ machineType }).toArray();
                res.json(treatments);
            } catch (err) {
                console.error(`Error fetching treatments for machineType ${machineType}:`, err);
                res.status(500).json({ error: `Failed to fetch treatments for machineType ${machineType}` });
            }
        });

        // API Route for handling machine treatment details
        app.post('/api/treatments', async (req, res) => {
            const { machineType, treatment } = req.body;

            try {
                // Assuming 'treatments' is your collection in MongoDB
                const result = await db.collection('treatments').insertOne({ machineType, treatment });

                if (result.ops && result.ops.length > 0) {
                    console.log('Treatment saved to MongoDB:', result.ops[0]);
                    res.status(201).json(result.ops[0]); // Return the inserted document
                } else {
                    throw new Error('Failed to save treatment.'); // Handle case where result.ops[0] is undefined
                }
            } catch (err) {
                console.error('Error saving treatment:', err);
                res.status(500).json({ error: 'Failed to save treatment' });
            }
        });

        // Serve React app for all other routes
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

startServer();
