const express = require("express");

const tourController = require("../controller/tourController");

const router = express.Router();

//param validation for id
// router.param('id', tourController.checkId)

router
  .route("/top-5-cheap-tours")
  .get(tourController.aliasTop5CheapTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
