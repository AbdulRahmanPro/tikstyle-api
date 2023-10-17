const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');
const adminRouter = require('./routes/admin');
const bodyParser = require('body-parser');
const { Automatic_update_URL } = require('./services/Admin_Services');

const port = 3001;
const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

// تكوين الجلسة
app.use(
  session({
    secret: 'your_secret_key', // تغييره إلى مفتاح سري فعلي ومعقد
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // تعيينه على true في الإنتاج باستخدام HTTPS
      maxAge: 3600000 * 24, // مدة صلاحية الجلسة بالميلي ثانية (هنا هي ساعة واحدة)
    },
  })
);

// اتصال بقاعدة البيانات
mongoose
  .connect('mongodb+srv://cluster0.pts3xm2.mongodb.net/Users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: 'mrgames7700',
    pass: 'reem123123',
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// تحديث الURL تلقائيًا
Automatic_update_URL();

// استخدام body-parser لمعالجة البيانات بشكل مفصل
app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);

// تعيين محرك العرض ومجلد العرض
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors(corsOptions));

// تحديد مسارات التوجيه
app.get('/', (req, res) => {
  res.send('Server is running now');
});
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

// التعامل مع الأخطاء 404
app.use(function (req, res, next) {
  next(createError(404));
});

// التعامل مع الأخطاء العامة
app.use(function (err, req, res, next) {
  // تعيين رسالة الخطأ والمعلومات في الوسيطات المحلية للصفحة
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // عرض صفحة الخطأ أو إرسال استجابة JSON بناءً على احتياجاتك
  res.status(err.status || 500);

  // إذا كنت ترغب في عرض صفحة HTML للخطأ:
  res.render('error'); // يجب التأكد من وجود ملف "error.ejs" في مجلد العرض

  // إذا كنت ترغب في إرسال استجابة JSON للخطأ:
  // res.json({ error: err.message });
});

module.exports = app;
