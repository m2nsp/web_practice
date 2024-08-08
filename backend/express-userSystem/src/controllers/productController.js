import express from 'express';

import productService from '../services/productService.js';
import auth from '../middleware/auth.js';

const productController = express.Router();

/* 직접 구현한 인증-인가 방식
productController.post('/', auth.verifySessionLogin, async (req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});
*/

//Passport 사용한 방식
productController.post('/', passportAuthenticateSession, async(req, res, next) => {
  const createdProduct = await productService.create(req.body);
  return res.json(createdProduct);
});

productController.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await productService.getById(id);
  return res.json(product);
});

export default productController;
