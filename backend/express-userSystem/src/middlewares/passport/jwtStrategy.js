//passport-jwt 전략이 필요
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import userService from '../../services/userService.js';

//  accessToken은 Authorization 헤더의 Bearer ${token}을 통해 전달받음
const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

// refreshToken은 쿠키의 refreshToken 속성을 통해 전달받음 
const cookieExtractor = function(req){
    var token = null;
    if(req && req.cookies){
        token = req.cookies['refreshToken'];
    }
    return token;
}
const refreshTokenOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET,
};

//두번째 아규먼트 : 콜백함수
async function jwtVerify(payload, done){
    try{
        const user = await userService.getUserById(payload.userId);
        if(!user){
            return done(null, false);
        }
        return done(null, user);
    }catch(error){
        return done(error);
    }
}

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);
const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

export default{
    accessTokenStrategy,
    refreshTokenStrategy,
};


/*
JwtStrategy를 초기화 할 때는 2가지 아규먼트가 필요함
1. 전략옵션      2. 콜백(토큰 검증, 유저 객체를 리퀘스트 객체에 지정하기 위함)

jwtFromRequest : JWT를 찾는 추출함수 (반드시 작성 필요)
*/