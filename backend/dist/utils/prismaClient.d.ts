import { PrismaClient } from "@prisma/client/edge";
import { Request, Response } from "express";
export declare const prismaClient: (req: Request, res: Response) => PrismaClient<{
    datasourceUrl: string | undefined;
}, never, import("@prisma/client/runtime/library").DefaultArgs> | undefined;
