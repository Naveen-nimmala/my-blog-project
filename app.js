const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose');
const { countBy } = require("lodash");


const homeStartingContent = "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

mongoose.connect('mongodb://localhost/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog =  mongoose.model("Blog", blogSchema)

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



app.set('view engine', 'ejs');

app.use(express.static("public"));

var posts = [];



app.get('/', function (req, res){
  Blog.find({}, function(err, fountItems){
    if (fountItems.length === 0){
        const defaultBlog = new Blog ({
          title: "Hello",
          content: "world"
        });
       Blog.insertMany(defaultBlog, function(err){
       })  
    }
    res.render("home", {
      startContent: homeStartingContent,
      posts: fountItems   
    });
  })  
})

app.get("/about", function (req, res){
  res.render("about", {aboutMe: aboutContent});
})


app.get("/contact", function (req, res){
  res.render("contact", {contactMe: contactContent})
});

app.get("/compose", function (req, res){
  res.render("compose")
})


app.post("/compose", function (req, res){
  const newPost = {
    title: req.body.postTitle,
    content: req.body.postData
  };
  Blog.insertMany(newPost, function(err){
  }) 
  // posts.push(post);
  res.redirect("/");
});


app.get("/posts/:postId", function(req, res){

  console.log(req.params.postId)
  Blog.findById(req.params.postId, function(err, existsID){
    res.render("post", {
      title: existsID.title,
      content: existsID.content
    })
  });

})



var today = new Date();

var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

var dateTime = date+' '+time;

console.log(dateTime)
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
