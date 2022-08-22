var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

/* 위에 있는 코드가 DB를 만들어 쓰겠다는 거임 그래서 node 파일명.js하면 database.sqlite문서가 생김 */

const Comments = sequelize.define('Comments', {
  // Model attributes are defined here
  content: {
    type: DataTypes.STRING,
    allowNull: false /* 어떠한 값이 비어도돼? 꼭 써야 하는 것일때 false */
  }
}, {
  // Other model options go here
});

(async () => {
  await Comments.sync();
})();
  
/* async: 오래걸리는 것을 뭘 하겠다. await 오래걸리는 것을 기다려 주겠다. */

// `sequelize.define` also returns the model
// true냐 아니냐 확인하는 것

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function(req, res) { 
const commetns = await Comments.findAll();

  res.render('index', { comments: commetns}); /* comments의(comments:) 무엇을 넣겠다?(왼쪽 commetns) 그런뜻임 */
});

app.post('/create', async function(req, res) { /* async function 안에 await을 쓸 수 있다. */
  console.log(req.body);

  const { content } = req.body

// Create a new user
  await Comments.create({ content: content });

  res.redirect('/');
});

app.post('/update/:id', async function(req, res) { /* async function 안에 await을 쓸 수 있다. */
  console.log(req.params);
  console.log(req.body);

  const { content } = req.body
  const { id } = req.params

  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });

  res.redirect('/');
});

app.post('/delete/:id', async function(req, res) { /* async function 안에 await을 쓸 수 있다. */
  console.log(req.params);

  const { id } = req.params

  await Comments.destroy({
    where: {
      id: id
    }
  });

  res.redirect('/');
});

app.listen(8080);
console.log('Server is listening on port 8080');