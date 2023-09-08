const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose')
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const port = 3001
const app = express();

const corsOptions ={
  origin:'http://localhost:3001', 
  credentials:true,           
  optionSuccessStatus:200
}

mongoose.connect('mongodb+srv://cluster0.pts3xm2.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: 'mrgames7700',
  pass: 'reem123123'
})
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})
.catch(error => {
  console.error("Error connecting to MongoDB:", error);
});

app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors(corsOptions));
  
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
