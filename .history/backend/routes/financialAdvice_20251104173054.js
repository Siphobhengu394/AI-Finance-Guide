const express = require("express");
const router = express.Router();
const { getFinancialAdvice } = require("../controllers/financialAdviceController");

router.post("/", getFinancialAdvice);

module.exports = router;
