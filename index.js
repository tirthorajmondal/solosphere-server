const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://solophere-server.vercel.app/'],
    Credential: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@solosphere.cv7tx.mongodb.net/?retryWrites=true&w=majority&appName=solosphere`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const jobCollection = client.db('jobDB').collection('jobCollection');
        const bidCollection = client.db('jobDB').collection('bidCollection');

        app.get("/all-jobs", async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)
        })
        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result);
        })
        app.get("/my-posted-jobs/:email", async (req, res) => {
            const myEmail = req.params.email
            const filter = { 'buyer.email': myEmail }
            const result = await jobCollection.find(filter).toArray()
            res.send(result)
        })

        app.post('/all-jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job);
            res.send(result);
        })

        app.delete('/job/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.deleteOne(query);
            res.send(result);
        })
        app.put('/job/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const jobData = req.body;
            const options = { upsert: true }
            const updatedJob = {
                $set: {
                    ...jobData,
                }
            }
            const result = await jobCollection.updateOne(filter, updatedJob, options);
            res.send(result);
        })

        //bid data
        app.get('/bids', async (req, res) => {
            const result = await bidCollection.find().toArray()
            res.send(result)
        })
        app.get('/bid/', async (req, res) => {
            const result = await bidCollection.findOne(query);
            res.send(result)
        })
        app.post('/bids', async (req, res) => {
            const bidData = req.body;
            const { bidEmail, jobId } = bidData;
            const existingBid = await bidCollection.findOne({ bidEmail, jobId });
            if (existingBid) {
                return res.send({ message: 'already exist' });
            }
            return
            const result = await bidCollection.insertOne(req.body)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to Solo Sphere')
})

app.listen(port, console.log(`server is running on PORT ${port}`))