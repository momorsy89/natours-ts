import {Review} from '../Models/Review';
import express from 'express';
import * as Factory from './handlerFactory';
import {IModifiedRequest} from '../Interfaces/IModifiedRequest';

//fill tour & user in req body
export const fillTourAndUser:any=(
      req: IModifiedRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
    //nested tour routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };

export const getAllReviews: express.RequestHandler =Factory.getAll(Review);

export const getReview: express.RequestHandler =Factory.getOne(Review);

export const updateReview: express.RequestHandler  = Factory.updateOne(Review);

export const deleteReview: express.RequestHandler =Factory.deleteOne(Review);

export const createReview: express.RequestHandler =Factory.createOne(Review);



