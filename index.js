const express = require("express")
const cors = require("cors")
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()

const corsOptions = {
    origin: ['http://localhost:5173', 'https://solophere-server.vercel.app/'],
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

        app.get("/all-jobs", async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)
        })
        app.get('/job/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            // return
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result);
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

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to Solo Sphere')
})

app.listen(port, console.log(`server is running on PORT ${port}`))