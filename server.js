import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri = 'mongodb+srv://sudhubalu04:XjoJOCPTdGCg7q8N@cluster0.zmvn1bl.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }

  console.log('Connected to MongoDB');
  const db = client.db('machineDB');
  const treatmentsCollection = db.collection('treatments');

  // Endpoint to add a treatment
  app.post('/api/treatments', async (req, res) => {
    const treatment = req.body;
    if (!treatment.machineType || !treatment.treatment) {
      return res.status(400).json({ error: 'Machine type and treatment are required' });
    }
    try {
      const result = await treatmentsCollection.insertOne(treatment);
      res.status(201).json(result);
    } catch (err) {
      console.error('Error inserting treatment', err);
      res.status(500).json({ error: 'An error occurred while inserting treatment' });
    }
  });

  // Endpoint to get all treatments
  app.get('/api/treatments', async (req, res) => {
    try {
      const treatments = await treatmentsCollection.find().toArray();
      res.status(200).json(treatments);
    } catch (err) {
      console.error('Error fetching treatments', err);
      res.status(500).json({ error: 'An error occurred while fetching treatments' });
    }
  });

  // Endpoint to get treatments by machine type
  app.get('/api/treatments/:machineType', async (req, res) => {
    const { machineType } = req.params;
    try {
      const treatments = await treatmentsCollection.find({ machineType }).toArray();
      res.status(200).json(treatments);
    } catch (err) {
      console.error(`Error fetching treatments for machine type ${machineType}`, err);
      res.status(500).json({ error: `An error occurred while fetching treatments for machine type ${machineType}` });
    }
  });

  // Root endpoint to confirm API is running
  app.get('/', (req, res) => {
    res.send('Backend server is running. API endpoints are available at /api/treatments');
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
 });


