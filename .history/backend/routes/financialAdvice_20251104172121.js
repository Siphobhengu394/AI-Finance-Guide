import express from 'express';
import { getFinancialAdvice } from '../controllers/financialAdviceController.js';

const router = express.Router();

router.post('/', getFinancialAdvice);

export default router;
