const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      unique: true,
      trim: true,
      minlength: [10, "A tour name should be greater than or equals to 10"],
      maxlength: [40, "A tour name should be smaller than or equals to 40"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message:
          "The difficulty of tour must be either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
      min: [1, "The price of tour must be greater than 1"],
    },
    discount: {
      type: Number,
      default: 0,
      //custom validator
      validate: {
        //validator always should return boolean value
        validator: function (val) {
          //here "this" only works for New doc creation, it does not work for updation.
          return val < this.price;
        },
        message: "A discount price {VALUE} must be smaller than regular price.",
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have summary"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A tour must have desc"],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have image cover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startDates: {
      type: [Date],
      required: [true, "A tour must have start date"],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//virtual properties are not part of db, so we cant query them directly on DB
tourSchema.virtual("durationOfWeeks").get(function () {
  return this.duration / 7;
});

//document middleware
//this runs before save or create, and does not runs for findOne or findMany, update etc.
//for example when we are creating new tour then automatically this attribute will get created and saved.
tourSchema.pre("save", function () {
  // console.log(this, "pre")
  this.slug = slugify(this.name, { lower: true });
});

//below middleware will get called after save or create
// tourSchema.post("save", function (){
//   console.log(this,"post")
// })

//Query Middleware:
//this query middleware will run after creating final query and before executing query.
//the query type which we are passing here must match with the final query type which we are checking/creating in controller file.
//for example if we are passing "find", then this middleware will just work for find and not for findOne, findMany, findIdAndUpdate etc.
//to resolve this above issue we pass regular expression.

// tourSchema.pre("find", function () {
tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
});

// tourSchema.post(/^find/, function () {
//   console.log(`Query took ${Date.now() - this.start} milliseconds to execute`);
// });

//aggregate middleware

tourSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
