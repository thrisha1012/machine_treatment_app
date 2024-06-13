import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
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
        app.use(bodyParser.json());

        // Serve static files from the React app's build directory
        app.use(express.static(path.join(__dirname, 'frontend/build')));

        // API Route for handling machine treatment details
        app.post('/api/treatments', async (req, res) => {
            const { machineType, treatment } = req.body;
            try {
                const result = await db.collection('treatments').insertOne({ machineType, treatment });
                res.status(201).json(result.ops[0]);
            } catch (err) {
                // console.error('Error saving treatment:', err);
                // res.status(500).json({ error: 'Failed to save treatment' });
                res.send('<script>alert("Hello from the server!");</script>');
                // window.location.href = '/';

            }
        });

        app.get('/api/treatments/:machineType', async (req, res) => {
            const { machineType } = req.params;
            try {
                const treatments = await db.collection('treatments').find({ machineType }).toArray();
                res.json(treatments);
            } catch (err) {
                console.error('Error fetching treatments:', err);
                res.status(500).json({ error: 'Failed to fetch treatments' });
                
            }
        });

        // Serve the React app for all other routes
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
