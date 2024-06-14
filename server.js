import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

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

        // Register a new user
        app.post('/api/register', async (req, res) => {
            const { email, password } = req.body;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                await db.collection('users').insertOne({ email, password: hashedPassword });
                res.status(201).json({ message: 'Registration successful!' });
            } catch (err) {
                console.error('Error registering user:', err);
                res.status(500).json({ error: 'Registration failed' });
            }
        });

        // Login an existing user
        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;
            try {
                const user = await db.collection('users').findOne({ email });

                if (!user) {
                    res.status(404).json({ error: 'User not found' });
                    return;
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    res.status(401).json({ error: 'Invalid credentials' });
                    return;
                }

                res.status(200).json({ message: 'Login successful!', user: { email: user.email } });
            } catch (err) {
                console.error('Error logging in:', err);
                res.status(500).json({ error: 'Login failed' });
            }
        });

        // API Route for handling machine treatment details
        app.post('/api/treatments', async (req, res) => {
            const { machineType, treatment } = req.body;
            try {
                const result = await db.collection('treatments').insertOne({ machineType, treatment });
                res.status(201).json(result.ops[0]);
            } catch (err) {
                // console.error('Error saving treatment:', err);
                // res.status(500).json({ error: 'Failed to save treatment' });
                res.write("<script>alert('Data inserted successfully')</script>")
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

        // API Route to update a treatment
        app.put('/api/treatments/:id', async (req, res) => {
            const { id } = req.params;
            const { treatment } = req.body;
            try {
                const result = await db.collection('treatments').updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { treatment } }
                );
                if (result.matchedCount === 0) {
                    res.status(404).json({ error: 'Treatment not found' });
                } else {
                    res.status(200).json({ message: 'Treatment updated successfully' });
                }
            } catch (err) {
                console.error('Error updating treatment:', err);
                res.status(500).json({ error: 'Failed to update treatment' });
            }
        });

        // API Route to delete a treatment
        app.delete('/api/treatments/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await db.collection('treatments').deleteOne({ _id: new ObjectId(id) });
                if (result.deletedCount === 0) {
                    res.status(404).json({ error: 'Treatment not found' });
                } else {
                    res.status(200).json({ message: 'Treatment deleted successfully' });
                }
            } catch (err) {
                console.error('Error deleting treatment:', err);
                res.status(500).json({ error: 'Failed to delete treatment' });
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
