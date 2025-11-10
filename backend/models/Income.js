const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    source: { type: String, required: true}, // Example: salary, freelance etc
    amount: { type: Number, required: true }, // Amount of income
    date: { type: Date, default: Date.now }, // Date of income
}, { timestamps: true });


module.exports = mongoose.model('Income', IncomeSchema);