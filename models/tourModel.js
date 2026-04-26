const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      unique: true,
      trim: true,
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
    },
    discount: {
      type: Number,
      default: 0,
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

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
