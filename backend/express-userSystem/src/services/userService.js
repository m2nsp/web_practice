import userRepository from "../repositories/userRepository";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function hashingPassword(password){
  return bcrypt.hash(password, 10);
}

async function createUser(user) {
  const existedUser = await userRepository.findByEmail(user.Email);

  if(existedUser){
    const error = new Error('User already exists');
    error.code = 422;
    error.data = { email: user.email};
    throw error;
  }

  const hashedPassword = await hashingPassword(user.password);      //비밀번호 해싱과정
  const createdUser = await userRepository.save({...user, password: hashedPassword});
  return filterSensitiveUserData(createdUser);
}


function filterSensitiveUserData(user){                   // 비밀번호, refresh 토큰은 안보이게 하기
  const { password, refreshToken, ...rest } = user;
  return rest;
}


async function getUser(email, password) {                 //user 조회하기
  const user = await userRepository.findByEmail(email);
  if(!user){
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
  await verifyPassword(password, user.password);
  return filterSensitiveUserData(user);
}

async function verifyPassword(inputPassword, savedpassword){         //비밀번호가 일치하는지 확인하는 로직
  const isValid = await bcrypt.compare(inputPassword, savedpassword);
  if(!isValid){
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
}

async function updateUser(id, data){                        //마지막으로 발급한 refreshToken을 데이터베이스에 저장하고, accessToken 재발급 시 데이터베이스에 저장되어있는 refreshToken으로만 accessToken 발급 받을 수 있게
  return await userRepository.update(id, date);
}

async function createToken(user, type){
  const payload = { userId: user.id };
  const options = { 
    expiresIn: type === 'refresh'? '2w' : '1h',                   // expiresIn 옵션 : 유효기간 설정
  };                                                              // refresh 토큰일 경우 - 유효기간 2주로 설정
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

async function refreshToken(userId, refreshToken){
  const user = await userRepository.findById(userId);
  if(!user || user.refreshToken !== refreshToken){
    const error = new Error('Unauthorized');
    error.code = 401;
    throw error;
  }
  const accessToken = createToken(user);
  const newRefreshToken = createToken(user, 'refresh');
  return { accessToken, newRefreshToken };
}


//id로 유저 가져오기
async function getUserById(id){
  const user = await userRepository.findById(id);

  if(!user){
    const error = new Error('Not Found');
    error.code = 404;
    throw error;
  }
  return filterSensitiveUserData(user);
}


export default {
  createUser,
  getUser,
  getUserById,
};
