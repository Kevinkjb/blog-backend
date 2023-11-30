import express from 'express';
import {db, connectToDb} from './db.js'


const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res)=>{
  const { name } = req.params;
  const article = await db.collection('article').findOne({name})
  if(article){
    res.json(article)
  }else{
    res.sendStatus(404)
  }
})

app.put('/api/articles/:name/upvote', async (req, res)=>{
  const {name} = req.params;
  await db.collection('article').updateOne({name}, {$inc: {upvotes: 1}})
   const article = await db.collection('article').findOne({name})
  if(article){
    res.send(`The name ${name} article now has ${article.upvotes} upvotes!!`)
  }else{
    res.send('That article doesn\'t exist')
  }

})

app.post('/api/articles/:name/comments', async(req, res)=>{
  const {name} = req.params;
  const {postedBy, text} = req.body;

  await db.collection('article').updateOne({name}, {$push: {comments:{postedBy, text}}})
  const article = await db.collection('article').findOne({name})
  if(article){
    res.send(article.comments);
  }else{
    res.send('That article doesn\'t exist');
  }
})


// To Connect the db file
connectToDb(()=>{
  console.log("Successfully connect to the database")
  app.listen(3000, ()=>{
    console.log("Listening in port 3000")
  })
})
