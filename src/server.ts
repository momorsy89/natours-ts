import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

//connection to Atlas DB
dotenv.config({ path: "./config.env" });
mongoose
  .connect(process.env.DATABASE!,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection online"))
  .catch((e) => console.log("DB connection faild " + e));

//handling of unhandeld rejections
process.on('unhandledRejection',(err:any)=>{
  console.log('unhandeledRejection   shutting down.....');
  console.log(err.name,err.message);
  server.close()
});

//handling of uncaught exceptions
process.on('uncaughtException',(err:any)=>{
  console.log('uncaughtException   shutting down.....');
  console.log(err.name,err.message);
  server.close()
})
  
//to change eviroment
//process.env.NODE_ENV = 'production';
console.log(process.env.NODE_ENV);

  const server = app.listen(3000,()=>{
      console.log('listening to port 3000.....');
  })