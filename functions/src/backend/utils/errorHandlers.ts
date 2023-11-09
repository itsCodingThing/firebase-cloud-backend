import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validator";
import mongoose from "mongoose";

export class CustomException extends Error {
    name: string;
    status: number;
    message: string;
    error?: ValidationError[];

    constructor(name: string, status: number, message: string, error?: ValidationError[]) {
        super(message);
        this.status = status;
        this.message = message;
        this.name = name;
        this.error = error;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
    if (error instanceof mongoose.Error) {
        return res.status(500).json({ msg: error.name });
    }

    if (error instanceof CustomException) {
        if (error.name === "ERR_CLIENT_REQUEST_BODY") {
            return res.status(error.status).json({ msg: error.message, errors: error.error });
        }
    }

    return res.status(500).json({ msg: "Something broke!" });
}
