class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly originalError?: Error;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        originalError?: Error
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.originalError = originalError;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
