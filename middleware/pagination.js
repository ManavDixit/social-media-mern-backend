export default (model) => {
  console.log('paginate')
  return async (req, res, next) => {
    console.log('paginate 2');
    const options=req.options;
    try {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex - 1 + limit;
    
        console.log(startIndex);
        console.log(endIndex);
    
        // let data = await model.find().sort({
        //   createdAt:-1
        //   }).skip(startIndex).limit(limit);
        
        let  data = await model.find(options).sort({
          createdAt:-1
          }).skip(startIndex).limit(limit)
        
        let isPrevAvialble = startIndex > 0;
        let isNextAvailable = endIndex < (await model.countDocuments(options)) - 1;
        req.paginatedData = data;
        req.isPrevAvialble = isPrevAvialble;
        req.isNextAvailable = isNextAvailable;
        next();
    } catch (error) {
        console.log(error);
    }
  };
};
