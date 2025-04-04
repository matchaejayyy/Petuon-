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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CarmineDB_1 = require("../database/CarmineDB");
const AuthMiddleware_1 = __importDefault(require("../middleware/AuthMiddleware"));
// Fetch all notes
CarmineDB_1.router.get("/getNotes", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        const userId = req.user.user_id;
        const result = yield CarmineDB_1.pool.query("SELECT * FROM notes WHERE user_id = $1", [userId]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Error fetching notes" });
    }
}));
// Insert a new note
CarmineDB_1.router.post("/insertNote", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        const { note_id, title, content, color, created_date, created_time } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Check for missing fields
        if (!title || !content || !color || !created_date || !created_time || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const query = `
      INSERT INTO notes (note_id, title, content, color, created_date, created_time, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
        const result = yield CarmineDB_1.pool.query(query, [
            note_id,
            title,
            content,
            color,
            created_date,
            created_time,
            userId,
        ]);
        console.log("Inserted note:", result.rows[0]); // Log the inserted note
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error inserting note:", error);
        if (error) {
            console.error("Database error code:", error);
        }
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Delete a note
CarmineDB_1.router.delete("/deleteNote/:note_id", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        const { note_id } = req.params; // Make sure we use "id" here as per the table definition
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        if (!note_id) {
            return res.status(400).json({ message: "Missing note_id" });
        }
        // Use the correct column name ("id") in the SQL query
        const result = yield CarmineDB_1.pool.query("DELETE FROM notes WHERE note_id = $1 AND user_id = $2 RETURNING *;", [note_id, userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Note not found" });
        }
        res
            .status(200)
            .json({ message: "Note deleted", deletedNote: result.rows[0] });
    }
    catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Update a note
CarmineDB_1.router.patch("/updateNote/:note_id", AuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: No user information' });
        }
        const { note_id } = req.params;
        const { title, content, updatedAt } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
        // Validate input
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required." });
        }
        const query = `
          UPDATE notes 
          SET title = $1, content = $2, updated_at = $3
          WHERE note_id = $4 AND user_id = $5
          RETURNING *;
        `;
        const values = [title, content, updatedAt || new Date().toISOString(), note_id, userId];
        const result = yield CarmineDB_1.pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Note not found." });
        }
        return res
            .status(200)
            .json({ message: "Note updated successfully.", note: result.rows[0] });
    }
    catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}));
exports.default = CarmineDB_1.router;
