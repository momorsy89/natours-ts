import express from 'express';
import { IUser } from "./IUser";
export interface IModifiedRequest extends express.Request {
    user: IUser;
  }