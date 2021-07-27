interface reqBody {
    [index: string]: string|boolean|number;
  }

  export let filterBody:(body:reqBody,allwoedFileds:string[])=>reqBody;
filterBody=(body:reqBody,allwoedFileds:string[])=>{
    let newObj:reqBody={};
    Object.keys(body).forEach(el=>{
        if(allwoedFileds.includes(el)){
            newObj[el]=body[el];
        }
    });
    return newObj;
}


