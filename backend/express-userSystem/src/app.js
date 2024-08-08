import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { expressjwt, ExpressJwtRequest } from "express-jwt";
import passport from './config/passport.js';

import userController from './controllers/userController.js';

import productController from './controllers/productController.js';
import reviewController from './controllers/reviewController.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use('', userController);
app.use('/products', productController);
app.use('/reviews', reviewController);

app.use(errorHandler);

//세션로그인
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);


//토큰기반 인가 - express-jwt 사용
app.get("/protected", jwt({ secret: "shhhhhhared-secret", algorithms: ["HS256"]}),
  function(req, res){
    if(!req.auth.admin)
      return res.sendStatus(401);
    res.sendStatus(200);
  }
);


const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
