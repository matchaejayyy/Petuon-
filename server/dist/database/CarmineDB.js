"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.router = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
exports.router = express_1.default.Router();
exports.pool = new pg_1.Pool({
    host: process.env.PG_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
    port: parseInt(process.env.PG_PORT || "6543"),
    database: process.env.PG_DATABASE || "postgres",
    user: process.env.PG_USER || "postgres.oizvoxoctozusoahxjos",
    password: process.env.PG_PASSWORD || "Carmine_123456789!!!",
});
