import { Prisma } from "@prisma/client";
export declare const paymentRouter: import("express-serve-static-core").Router;
export declare const fetchuser: (email: string) => Promise<any>;
export declare const fetchuserByUsername: (userId: string) => Promise<any>;
export declare const fetchpayments: (userId: string) => Promise<{
    paymentId: string;
    paymentDateTime: Date;
    customerId: string;
    toId: string;
    amount: Prisma.Decimal;
    done: boolean;
}[] | undefined>;
