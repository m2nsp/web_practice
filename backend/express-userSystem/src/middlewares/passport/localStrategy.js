// 세션 기반 로그인은 주로 passport-local 세션 기반 인증에 사용됨
import { Strategy as LocaStrategy } from 'passport-local';

const localStrategy = new LocaStrategy(
    {
        usernameField: 'email',
    },
    async (email, password, done) => {
        try{
            const user = await userService.getUser(email, password);
            if(!user){
                return done(null, false);
            }
            return done(null, user);
        }catch(error){
            return done(error);
        }
    }
);

export default localStrategy;