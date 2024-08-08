import express from 'express';
import userService from '../services/userService.js';
import passport from '../config/passport.js';

const userController = express.Router();

//유저 생성
userController.post('/users', async(req, res, next) => {
    try{
        const user = await userService.createUser(req.body);
        return res.status(201).json(user);
    }catch(error){
        next(error);
    }
});

//로그인
userController.post('/login', async(req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await userService.getUser(email, password);
        return res.json(user);
    }catch(error){
        next(error);
    }
});


//세션 로그인 구현 코드
userController.post('/session-login', async(req, res, next) => {
    const {email, password}=req.body
    
    try{
        const user = await userService.getUser(email, password);
        req.session.userId = user.id;
        return res.json(user);
    }catch(error){
        next(error);
    }
});


//JWT 로그인 구현 코드
userController.post('/JWT-login', async(req, res, next) => {
    const { email, password } = req.body;
    try{
        const user = await userService.getUser(email, password);
        const accessToken = userService.createToken(user);
        const refreshToken = userService.createToken(user, 'refresh');
        await userService.updateUser(user.id, { refreshToken });
        res.cookie('refreshToken', refreshToken, {     
            httpOnly: true,                                   //브라우저에서 토큰에 접근하는 것 제한
            sameSite: 'none',
            secure: true
        });
        return res.json({accessToken});
    }catch(error){
        next(error);
    }
});

userController.post('/token/refresh', auth.verifyRefreshToken, async(req, res, next) => {
    try{
        const { refreshToken } = req.cookies;
        const { userId } = req.auth;
        const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken);
        await userService.updateUser(userId, {refreshToken: newRefreshToken});
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        return res.json({accessToken});
    }catch(error){
        return next(error);
    }
});


//Passport를 이용한 세션로그인 구현
userController.post('/session-login', passport.authenticate('local', async(req, res, next) => {
    const user = req.user;
    return res.json(user);
}))

export default userController;
