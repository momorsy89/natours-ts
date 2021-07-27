import mongoose, { Query } from "mongoose";
import ITour from "../Interfaces/ITour";
import qs from 'qs';
import { IReview } from "../Interfaces/IReview";
import { IUser } from "../Interfaces/IUser";

export class ApiFeatures {
  query: Query<
    ((ITour | IUser | IReview) & mongoose.Document<any, any, (ITour | IUser | IReview)>)[],
    (ITour | IUser | IReview) & mongoose.Document<any, any, (ITour | IUser | IReview)>
  > ;
  queryString: qs.ParsedQs;
  constructor(
    query: Query<
    ((ITour | IUser | IReview) & mongoose.Document<any, any, (ITour | IUser | IReview)>)[] ,
    (ITour | IUser | IReview) & mongoose.Document<any, any, (ITour | IUser | IReview)> 
    >,
    queryString: qs.ParsedQs
  ) {
    this.query = query;
    this.queryString = queryString;
  }

  //filtering
  //basic filtering
  filter: Function = () => {
    const queryObj: qs.ParsedQs = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr: string = JSON.stringify(queryObj);
    //Advanced filttering
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match: string) => `$${match}`
    );
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort: Function = () => {
    if(this.queryString.sort){
      let sortBy:string =this.queryString.sort as string;
      sortBy=sortBy.split(',').join(' ');
      this.query=this.query.sort(sortBy);
    }
    return this;
  }

limitFields: Function = () => {
  if(this.queryString.fields){
    let fields:string =this.queryString.fields as string;
    fields=fields.split(',').join(' ');
    this.query=this.query.select(fields);
  }
  return this;
}
paginate: Function = () => {
  let page:number =this.queryString.page as unknown as number || 1 ;
  let limitStr:string=this.queryString.limit as unknown as string;
  let limit:number=parseInt(limitStr) || 100;
  let skipped:number=(page-1)*limit;
  this.query=this.query.skip(skipped).limit(limit);
  return this;
}
}

