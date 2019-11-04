class APIFeatures {
  constructor(query, safe_query_params, query_params) {
    this.query = query;
    this.safe_query_params = safe_query_params;
    this.query_params = query_params;
    this.req_query_params = { ...this.query_params };
  }

  filter() {
    for (let p in this.req_query_params) {
      if (!this.safe_query_params.includes(p)) {
        delete this.req_query_params[p];
      }
    }

    let query_string = JSON.stringify(this.req_query_params);
    query_string = query_string.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );

    this.query = this.query.find(JSON.parse(query_string));
    return this;
  }

  sort() {
    if (this.query_params.sort) {
      const sortBy = this.query_params.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }

  narrow() {
    if (this.query_params.fields) {
      const fields = this.query_params.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.query_params.page * 1 || 1;
    const limit = this.query_params.limit * 1 || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
