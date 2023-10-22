//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose"; 
import _ from "lodash";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs'); 

try {
  await mongoose.connect("mongodb+srv://ankurkushwaha7408:Kushwaha123@cluster0.8onnf8w.mongodb.net/composeDB"); 
} catch (error) {
  handleError(error);
}

const listSchema = new mongoose.Schema({
  title: String, 
  content: String
});

const List = mongoose.model('List', listSchema);

app.get("/", (req,res) => {
  List.find({}).then((items) => {
    // console.log("Successful"); 
    res.render("home.ejs", {objects: items});
  })
  .catch((err) => console.log(err));
})


app.get("/about", (req,res) => {
  res.render("about.ejs");
})

app.get("/contact", (req,res) => {
  res.render("contact.ejs");
})

app.get("/:compose", (req,res) => {
  res.render("compose.ejs");
})

app.get("/post/:postId", (req,res) => {
  const Id = req.params.postId;
  // console.log(typeof(Id)); 
  // console.log(Id);  
  List.findOne({_id: Id}).then((item) => {
    // console.log(item);   
    res.render("post.ejs", {item});
  })
  .catch((err) => console.log(err));
})

app.post("/post", (req,res) => {
  const title = req.body.title;
  const content = req.body.textarea;
  const list = new List({
    title: req.body.title,
    content: req.body.textarea
  })
  list.save();
  res.redirect("/");
})

app.post("/delete", (req,res) => {
  const id = req.body.id;
  List.findByIdAndRemove(id).then(() => console.log("deleted successfully"))
  .catch((err) => console.log(err));
  res.redirect("/");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
