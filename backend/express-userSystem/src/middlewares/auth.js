//유저 인증과 관련된 미들웨어
import userRepository from "../repositories/userRepository.js";
import reviewRepository from '../repositories/reviewRepository.js';
import { expressjwt } from 'express-jwt';

function throwUnauthorizedError(){
    //인증되지 않은 경우 401 에러를 발생시키는 함수
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
}

async function verifySessionLogin(req, res, next){
    //세션에서 사용자 정보를 읽어옴
    try{
        const { userId } = req.session;

        if(!userId){
        //로그인 되어있지 않으면 인증 실패
        throwUnauthorizedError();
        }
        const user = await userRepository.findById(req.session.userId);

        if(!user){      //세션에 로그인정보가 있지만 데이터베이스에서 해당 사용자를 찾을 수 없는 경우
            throwUnauthorizedError();
        }
        
        //이후 편리성을 위한 유저 정보 전달
        req.user = {
            id: req.session.userId,
            email: user.email,
            name: user.name,
            provider: user.provider,
            providerId: user.providerId,
        }
        //사용자가 로그인되어 있다면 다음 미들웨어 처리
        next();
    }catch(error){
        next(error);
    }
}

const verifyAccessToken = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    //requestProperty: 'auth'    -- jwt의 payload 를 객체로 만들어 requestProperty 옵션에서 지정한 이름으로 리퀘스트 객체에 지정
});


//본인의 리뷰만 수정 및 삭제할 수 있게 하기 위한 인가 과정
async function verifyReviewAuth(req, res, next){
    const {id: reviewId} = req.params;
    try{
        const review = await reviewRepository.getById(reviewId);

        if(!review){
            const error = new Error('Review not found');
            error.code = 404;
            throw error;
        }

        if(review.authorId !== req.auth.userId){
            const error = new Error('Forbidden');
            error.code = 403;                                       //403 에러 : 웹페이지를 볼 수 있는 권한이 없습니다
            throw error;
        }
        return next();
    }catch(error){
        return next(error);     
    }
}

//refreshToken 검증
const verifyRefreshToken = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.refreshToken,        //refreshToken을 쿠키에 저장하였으므로, 쿠키에서 토큰 찾아옴
});


// Passport를 사용해서 세션 기반 로그인의 인가 적용
function passportAuthenticateSession(req, res, next){
    if(!req.isAuthenticated()){                                     //Passport를 이용하면 req.isAuthenticated() 메소드를 사용하여 인증 여부를 확인할 수 있음
        return res.status(401).json({message: 'Unauthorized'});
    }
    return next();
}


export default{
    verifySessionLogin,
    verifyAccessToken,
    verifyReviewAuth,
    passportAuthenticateSession,
}