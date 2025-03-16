import z from 'zod';
export declare const signUpInput: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    firstName: z.ZodString;
    lastName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email?: string | undefined;
    password?: string | undefined;
    phone?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email?: string | undefined;
    password?: string | undefined;
    phone?: string | undefined;
}>;
export declare const signInInput: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    password?: string | undefined;
    phone?: string | undefined;
}, {
    email?: string | undefined;
    password?: string | undefined;
    phone?: string | undefined;
}>;
export declare const postInput: z.ZodObject<{
    content: z.ZodString;
    title: z.ZodString;
}, "strip", z.ZodTypeAny, {
    content: string;
    title: string;
}, {
    content: string;
    title: string;
}>;
export declare const updatePostInput: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    published: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content?: string | undefined;
    title?: string | undefined;
    published?: boolean | undefined;
}, {
    content?: string | undefined;
    title?: string | undefined;
    published?: boolean | undefined;
}>;
export type SignUpInputParams = z.infer<typeof signUpInput>;
export type SignInInputParams = z.infer<typeof signInInput>;
export type postInputParams = z.infer<typeof postInput>;
