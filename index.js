const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// user:
// pass : 3RMUZsYTwXUOhI9w

const uri = "mongodb+srv://firstDBUser:3RMUZsYTwXUOhI9w@cluster0.hzu9wpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
  
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db('userDB').collection('users')
    
    // Get Method
    app.get("/users", async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.findOne(query);
      res.send(result);
  })

    // Create Post method
    app.post('/users', async(req, res) => {
      const newUsers = req.body;
      const result = await userCollection.insertOne(newUsers);
      res.send(result)
    })

    // put method
    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;

      const updatedDoc = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const options = { upsert: true };

      console.log(user);
      const result = await userCollection.updateOne(filter, updatedDoc, options);
      res.send(result)
    })

    // DElete Method 
    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
      console.log('to be deleted', id);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Crud server is running');

})


app.listen(port, () => {
    console.log(`This project running form ${port}`);
})