const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("life moment");
});
//
//

const uri =
  `mongodb+srv://LifeCareUser:jNBQ2MwxNlFK9KIA@cluster0.dbebnio.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("lifecare").collection("services");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
      
    });
    app.get("/services/:id", async (req, res) => {
        const id=req.params.id;
        const query={_id:ObjectId(id)}
         const service =await serviceCollection.findOne(query);
         res.send(service)
       });
       const userCollection = client.db("lifecare").collection("users");

      //  app.get('/users',async(req,res)=>{
      //   const query={};
      //   const cursor=userCollection.find(query)
      //   const users=await cursor.toArray()
      //   res.send(user)
      //  })

      app.post('/users',async(req,res)=>{
        const user=req.body;
        const result=await userCollection.insertOne(user)
        res.send(result)
      })

      
  } finally {
  }
}
run().catch((err) => console.log(err));

app.listen(port, () => {
  console.log("lifeemonent server running ", port);
});
