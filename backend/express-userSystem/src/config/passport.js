import passport from 'passport';
import localStrategy from '../middlewares/passport/localStrategy.js';
import userRepository from '../repositories/userRepository.js';
import { accessTokenStrategy } from '../middlewares/passport/jwtStrategy.js';

import googleStrategy from '../middlewares/passport/googleStrategy.js';

passport.use(localStrategy);

//serializeUser : 세션에 어떤 데이터를 저장할지를 정의 -- 로그인 성공 시 세션에 저장할 데이터, 유저의 id 넘겨줌
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//desrializeUser : 세션에 저장된 데이터를 가지고 데이터베이스에서 실제 데이터를 어떻게 가져올지를 정의
passport.deserializeUser(async(id, done) => {
    try{
        //id를 이용해 사용자 정보를 조회
        const user = await userRepository.findById(id);
        done(null, user);
    }catch(error){
        done(error);
    }
});


//JWT 전략 Passport에서 사용할 수 있도록 등록
passport.use('access-token', accessTokenStrategy);


passport.use(googleStrategy);         //구글 로그인 위함

export default passport;