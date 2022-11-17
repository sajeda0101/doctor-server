const express = require("express");
const app = express();
require("dotenv").config();
const jwt=require('jsonwebtoken');
const cors = require("cors");
const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("life care");
});
//
//

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dbebnio.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("lifecare").collection("services");
    const userCollection = client.db("lifecare").collection("users");

    
    // services read
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
      
    });
    // limit data for homepage
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services.reverse());
      
    });

    // services read by id
    app.get("/services/:id", async (req, res) => {
        const id=req.params.id;
        const query={_id:ObjectId(id)}
         const service =await serviceCollection.findOne(query);
         res.send(service)
       });

    
   
    //  data create for add service
    app.post('/services',async(req,res)=>{
      const user=req.body;
      const addService=await serviceCollection.insertOne(user);
      res.send(addService)
    })

    // data get for my reviews
    app.get('/users',async(req,res)=>{
     let query={};
     if(req.query.email){
      query={
        email:req.query.email
      }
     }
     if(req.query.service_id){
      query={
        service_id:req.query.service_id
      }
     }
      const cursor=userCollection.find(query);
      const reviews=await cursor.toArray();
      res.send(reviews);
    })

 
    // delete data
    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result=await userCollection.deleteOne(query)
        res.send(result)

    })
   
    // jwt token access
    app.post('/jwt',(req,res)=>{
      const user=req.body;
      const token=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'7d'})
      res.send({token})
    
    })

    //  create user
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
  console.log("lifecare server running ", port);
});
