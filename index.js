//Declaring Dependency Variables.......
const express = require('express')
const cors = require ('cors')
const bodyParser = require('body-parser')
const app = express()
const PORT = 5000
app.use(bodyParser.urlencoded({ extended: false }))
const ObjectId = require('mongodb').ObjectId;
app.use(express.json())
app.use(cors())
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkyg0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const services = client.db(process.env.DB_NAME).collection("services");
  const technicians = client.db(process.env.DB_NAME).collection("technicians");
  const admins = client.db(process.env.DB_NAME).collection("admins");
  const bookings = client.db(process.env.DB_NAME).collection("bookings");
  const reviews = client.db(process.env.DB_NAME).collection("reviews");
  console.log('DB COnnected');

  //adding services to database.....
  app.post("/addServices", (req, res) => {
      const newService = req.body;
      services.insertOne(newService)
      .then(result => {
          console.log('inserted count', result.insertedCount);
          res.send(result.insertedCount>0)
      })
      console.log(newService);
  })

  //adding technicians....
  app.post('/addTechnicians', (req, res) =>{
      const newTechnician = req.body;
      technicians.insertOne(newTechnician)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount>0)
      })

  })

  //adding admins....
  app.post('/addAdmin', (req, res) =>{
    const newAdmin = req.body;
    admins.insertOne(newAdmin)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount>0)
    })

  })

  //adding bookings....

  app.post('/bookService', (req, res) => {
    const newBooking =  req.body;
    bookings.insertOne(newBooking)
    .then(result => {
      console.log(result.insertedCount);
      res.send(insertedCount>0)
    })
  
  })

  app.post('/postReview',(req,res) => {
    const newReview = req.body;
    reviews.insertOne(newReview)
    .then(res =>{
      console.log(res.insertedCount);
      res.send(insertedCount>0);
    })
  })



  //all get requests.....
  //all services
  app.get('/services', (req, res) => {
    services.find()
    .toArray((err, pd) =>{
      res.send(pd)
    })
  })

  //all technicians
  app.get('/technicians', (req, res)=>{
    technicians.find()
    .toArray((err, docs) =>{
      res.send(docs)
    })
   
  })

  app.get('/admins', (req, res) =>{
    admins.find()
    .toArray((err, docs) => {
      res.send(docs)
    })
  })

  //getting single service

  app.get('/service/:serviceID', (req, res) =>{
    services.find({_id:ObjectId(req.params.serviceID)})
    .toArray((err, docs) => {
      res.send(docs)
    })
  })
  app.get('/editService/:_id', (req, res) =>{
    bookings.find({_id:ObjectId(req.params._id)})
    .toArray((err, docs) => {
      res.send(docs)
    })
  })

  app.get('/allReviews', (req, res) => {
    reviews.find()
    .toArray((err, docs) =>{
      res.send(docs)
    })
  })

  app.patch('/update/:id',(req, res) => {
    bookings.updateOne({_id:ObjectId(req.params.id)},
    {
      $set:{setState:req.body.setState}
    })
    .then(result => {
      console.log(result);
    })

  })

  app.get('/allBookings',(req, res) => {
    bookings.find()
    .toArray((err, docs) => {
      res.send(docs)
    })
  })

  




});


app.get('/', (req, res) => {
    res.send('Welcome to plumStars Database');
})


app.listen(process.env.PORT || PORT, console.log('listening to port 5000'));