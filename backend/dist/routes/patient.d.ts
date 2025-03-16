export declare const patientRouter: import("express-serve-static-core").Router;
export declare const makeAppointment: (appointmentDetails: any) => Promise<{
    patientId: string;
    appointmentId: string;
    bookedDateTime: Date;
    appointmentDateTime: Date;
    doctorId: string;
    reasonForAppointment: string | null;
    timeSlot: import("@prisma/client/runtime/library").JsonValue;
    visited: boolean;
}>;
