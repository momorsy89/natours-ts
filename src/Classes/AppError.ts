export class AppError extends Error{
    statusCode:number;
    status:string;
    isOpertional:boolean;
        constructor(message:string, statusCode:number){
            super(message);
            this.statusCode=statusCode;
            this.status=`${statusCode}`.startsWith('4')?'faild':'error';
            this.isOpertional=true;
            Error.captureStackTrace(this,this.constructor);
        }
    };
