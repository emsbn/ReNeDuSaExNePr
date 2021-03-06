const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(
  cors({
    // origin: '*',
    origin: 'http://localhost:8181',
    // origin: 'http://localhost:3061',
    credentials: true, // cookie 전달 허용
  }),
);
app.use(express.json()); // json
app.use(express.urlencoded({ extended: true })); // form
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});
app.use('/user', userRouter);

// error middleware
app.use((err, req, res, next) => {
  // console.error(err);
});

app.listen(8182, () => {
  console.log('server listening 8182...');
});
