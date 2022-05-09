//const express=require("express"); //import express because this is a thirty party
import dotenv from "dotenv";
import express from "express"; //"type="module",
import { MongoClient } from "mongodb";
import cors from "cors";
import bcrypt from "bcrypt";


dotenv.config();

console.log(process.env.MONGO_URL);
const app = express();
const PORT = process.env.PORT;


app.use(cors());
//connect node and mongo
//middle ware -> intercept -> converting body to json
app.use(express.json());

//const MONGO_URL = "mongodb://localhost";
const MONGO_URL = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}
const client = await createConnection();

app.get("/", function (request, response) {
  response.send("Hello world msg🎇🎇✨🎊");
});

//cursor-pagination->convert to Array(to Array)
app.get("/movies", async function (request, response) {
  const movies=await client
  .db("b30wd")
  .collection("movies")
  .find({})
  .toArray();
  response.send(movies);
});

app.get("/movies/:id", async function (request, response) {
  console.log(request.params);
  //filter or find
  //db.movies.findOne({id: "102"})
  const { id } = request.params;
  //const movie=movies.find((mv)=>mv.id===id);
  const movie = await client
    .db("b30wd")
    .collection("movies")
    .findOne({ id: id });

    //console.log(movie);
    movie
    ? response.send(movie)
    : response.status(404).send({message: "No such movie found"});
});

app.delete("/movies/:id", async function (request, response) {
  console.log(request.params);
  //filter or find
  //db.movies.deleteOne({id :"102"})
  const { id } = request.params;
  //const movie=movies.find((mv)=>mv.id===id);
  const result = await client
    .db("b30wd")
    .collection("movies")
    .deleteOne({ id: id });
  response.send(result);
});

app.put("/movies/:id", async function (request, response) {
  console.log(request.params);
  //filter or find
  //db.movies.updateOne({id :"102"}, {$set: updateData})
  const { id } = request.params;
  const updateData = request.body;
  //const movie=movies.find((mv)=>mv.id===id);
  const result = await client
    .db("b30wd")
    .collection("movies")
    .updateOne({ id: id }, {$set: updateData});
  response.send(result);
});


app.post("/movies", async function (request, response) {
  //db.movies.insertMany(data)
  const data = request.body;
  const result = await client.db("b30wd").collection("movies").insertMany(data);
  response.send(result);
});

app.listen(PORT, () => console.log(`server started in ${PORT}`));

async function genPassword(password){
  //bcrypt.getSalt(NoOfRounds)
  const salt= await bcrypt.genSalt(10); //4s
  const hashPassword= await bcrypt.hash(password, salt);
  console.log({ salt, hashPassword});
}

genPassword("password@123");
