// custom class to handle the queries
class AppFeatures {

    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // filter the doc results
    filter() {

        const queryObj = {...this.queryString};

        // excluding fileds related to other feature methods
        const excludeFields = ['sort', 'fields', 'limit', 'page'];
        excludeFields.forEach(elm => delete queryObj[elm]);

        // process the query to the express format
        let queryObjString = JSON.stringify(queryObj);
        queryObjString = queryObjString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // find the filtered result
        this.query = this.query.find(JSON.parse(queryObjString));

        return this;
    }

    // sort the doc results
    sort() {

        // if sort params present then format the query for mongoose and sort
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }

        // if no sort params by default display res sorted by createdAt (dec)
        else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    // limit the fields from the doc results
    limitFields() {

        // if limit fields present then format query for mongoose and hide
        if(this.queryString.fields) {
            const displayFields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(displayFields);
        }

        // by default hide the __v fields
        else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    // show the doc result of the given page
    paginate() {

        // initialize page, limit, and skip w/ given or default values
        const page = (this.queryString.page * 1) || 1;
        const limit = (this.queryString.limit * 1) || 10;
        const skip = (page - 1) * limit;

        // find the desired page output
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = AppFeatures;