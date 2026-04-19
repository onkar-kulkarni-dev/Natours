class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    //1A: Filtering
    const queryObj = { ...this.queryString };
    const excludedParams = ["sort", "page", "fields", "limit"];
    excludedParams.forEach((param) => delete queryObj[param]);

    //1B: Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    //below way is risky here because we need dynamic filtering.
    // const query = Tour.find().where('duration').equals(queryObj.duration).where('difficulty').equals(queryObj.difficulty)
  }
  sort() {
    if (this.queryString.sort) {
      //this is for if there are matching records then we will use this, lets say we are doing sort by rice and 2 records has same price then we will pass ",averageRatings" so that then it will check for it and then send the response.
      const sortBy = this.queryString.sort.replace(/,/g, " ");
      this.query = this.query.sort(sortBy);
    } else {
      //default sorting by createdAt and in desc order(for desc order we use "-")
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replace(/,/g, " ");
      this.query = this.query.select(fields);
    } else {
      //default case if we want to remove some fields, we use "-" to remove fields
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (page) {
    //   const totalDocs = await Tour.countDocuments();
    //   if (skip >= totalDocs) throw new Error("This page doesn't exists");
    // }

    return this;
  }
}

module.exports = APIFeatures;
