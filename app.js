const mongoose = require('mongoose')
const express = require("express");
const lodash = require('lodash');

mongoose.connect('mongodb://127.0.0.1:27017/blogDb')

const postsSchema = new mongoose.Schema({
  title: String,
  description: String,
})

const Post = mongoose.model('posts', postsSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true}))
app.use(express.static("public"));

app.get('/', async function(req, res) {
  try {
    const posts = await Post.find({})
    res.render('home', {homeStartingContent: homeStartingContent, posts: posts})
  } catch (err) {
    console.log(err)
  }
})

app.get('/sobre', function(req, res) {
  res.render('about', {aboutContent: aboutContent})
})

app.get('/contato', function(req, res) {
  res.render('contact', {contactContent: contactContent})
})

app.get('/publicar', function(req, res){
  res.render('publish', {error: null})
})

app.post('/publicar', async (req, res) => {
  const title = req.body.postTitle
  const description = req.body.postBody

  if(title && description){
    try {
      const post = new Post({
        title: title,
        description: description
      })
      await post.save()
      res.redirect('/')
    } catch (err) {
      console.log(err)
      res.status(500).send('Erro ao publicar post')
    }
  } else {
    res.render('publicar', {error: 'Por favor, preencha todos os campos'})
  }

})

app.get('/post/:postName', async function(req, res) {
  const requestedTitle = req.params.postName

  try {
    const post = await Post.findOne({title: { $regex: new RegExp(`^${requestedTitle}$`, 'i')}})

    if(post) {
      res.render('post', {title: post.title, description: post.description})
    } else {
      res.redirect('/')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Post não encontrado')
  }
})

app.listen(4000, function() {
  console.log("Server started on port 4000");
});