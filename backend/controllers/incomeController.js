const User = require('../models/User')
const Income = require('../models/Income')


// add income source
exports.addIncome = async (req, res ) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        // validation for missing fields
        if (!source || !amount || !date) {
            return res.status(400).json({ message: "Please fill in all" });
    }

    const newIncome = new Income({
        userId, 
        icon, 
        source,
        amount, 
        date: new Date(date)
    });
     
    await newIncome.save();
    res.status(200).json(newIncome);
    } catch (error) {
     res.status(500).json({ message: "Server error" });
    }
}

// get all income source
exports.getAllIncomes = async (req, res ) => {}


// delete income source
exports.deleteIncome = async (req, res ) => {}

// download excel
exports.downloadIncomeExcel = async (req, res ) => {}

