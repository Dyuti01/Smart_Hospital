"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const edge_1 = require("@prisma/client/edge");
const prismaClient = (req, res) => {
    try {
        const prisma = new edge_1.PrismaClient({
            datasourceUrl: process.env.DATABASE_URL,
        });
        return prisma;
    }
    catch (err) {
        const message = err.message;
        res.status(400).json({ error: message });
    }
};
exports.prismaClient = prismaClient;
