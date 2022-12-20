class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          type: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // console.log(keyword);
    this.query = this.query.find({ ...keyword });
    return this;
  }
  // filter() {
  //   const queryCopy = { ...this.queryStr };
  //   // console.log(queryCopy);
  //   //Removing some fields for category ------
  //   const removeFields = ["user"];

  //   removeFields.forEach((key) => delete queryCopy[key]);

  //   // Filter for Price and Rating
  //   // console.log(queryCopy);
  //   let queryStr = JSON.stringify(queryCopy);
  //   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

  //   // console.log(queryStr);
  //   this.query = this.query.find(JSON.parse(queryStr)); // product.find()  is  this.query
  //   return this;
  // }
  // pagination(resultPerPage) {
  //   const currentPage = Number(this.queryStr.page) || 1;

  //   const skip = resultPerPage * (currentPage - 1);

  //   this.query = this.query.limit(resultPerPage).skip(skip);
  //   return this;
  // }
}

module.exports = ApiFeatures;
