module.exports.index=(req,res)=>{
    return res.json(200,{
        message:'Collection of posts',
        post:[]
    })
}