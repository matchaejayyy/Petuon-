"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateRegister = void 0;
const CarmineDB_1 = require("../database/CarmineDB");
const ValidateRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_email, user_name, user_password } = req.body;
        if (!user_email || !user_name || !user_password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }
        if (user_password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }
        const emailCheck = yield CarmineDB_1.pool.query(`SELECT * FROM users WHERE user_email = $1`, [user_email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        next();
    }
    catch (error) {
        console.error('Error checking for tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.ValidateRegister = ValidateRegister;
