"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    status;
    isOpertional;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'faild' : 'error';
        this.isOpertional = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
;
//# sourceMappingURL=AppError.js.map