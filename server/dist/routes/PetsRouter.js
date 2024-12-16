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
const CarmineDB_1 = require("../database/CarmineDB");
CarmineDB_1.router.get('/getPets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CarmineDB_1.pool.query('SELECT * FROM pets');
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Error fetching pets' });
    }
}));
CarmineDB_1.router.put('/updatePet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pet_id, pet_currency, pet_progress_bar } = req.body;
    try {
        const result = yield CarmineDB_1.pool.query('UPDATE pets SET pet_currency = $1, pet_progress_bar = $2 WHERE pet_id = $3 RETURNING *', [pet_currency, pet_progress_bar, pet_id]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Error updating pet' });
    }
}));
exports.default = CarmineDB_1.router;
