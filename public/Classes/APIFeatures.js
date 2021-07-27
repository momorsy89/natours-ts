"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFeatures = void 0;
class ApiFeatures {
    query;
    queryString;
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    //filtering
    //basic filtering
    filter = () => {
        const queryObj = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        //Advanced filttering
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.query.find(JSON.parse(queryStr));
        return this;
    };
    sort = () => {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort;
            sortBy = sortBy.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        return this;
    };
    limitFields = () => {
        if (this.queryString.fields) {
            let fields = this.queryString.fields;
            fields = fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this;
    };
    paginate = () => {
        let page = this.queryString.page || 1;
        let limitStr = this.queryString.limit;
        let limit = parseInt(limitStr) || 100;
        let skipped = (page - 1) * limit;
        this.query = this.query.skip(skipped).limit(limit);
        return this;
    };
}
exports.ApiFeatures = ApiFeatures;
//# sourceMappingURL=APIFeatures.js.map