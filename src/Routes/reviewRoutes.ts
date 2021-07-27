import express from 'express';
import * as reviewController from '../Controllers/reviewController';
import * as authController from '../Controllers/authController';


const router =express.Router({mergeParams:true});

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews);

router.route('/:id').get(reviewController.getReview);

router.route('/:id').patch(reviewController.updateReview);

router.route('/:id').delete(reviewController.deleteReview);

router.route('/').post(reviewController.fillTourAndUser,reviewController.createReview);

export default router;