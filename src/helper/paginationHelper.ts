type TOption={
        limit?:number,
        page?:number,
        sortBy?:string,
        sortOrder?:string
}
type TOptionResult={
        limit:number,
        page:number,
        skip:number,
        sortBy:string,
        sortOrder:string      
}

const paginationHelper=(option:TOption):TOptionResult=>{
        const page=Number(option.page)||1
        const limit=Number(option.limit)||10
        const skip=(Number(page)-1)*limit
        const sortBy=option.sortBy ||'createdAt'
        const sortOrder=option.sortOrder ||'desc'
      
        return{
          page,
          limit,
          skip,
          sortBy,
          sortOrder
        }
      }
export default paginationHelper