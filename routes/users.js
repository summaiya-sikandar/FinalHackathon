const mongoose = require('mongoose')
const plm= require('passport-local-mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/hackathonApp')

const userSchema= new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      projects:[{
            type:{
                  projectName: String,
                  projectLink: String,
                  username: String,
                  image: String,
                  dateOfUpload: String,  
            },
            default:[]
      }]
})
userSchema.plugin(plm)

module.exports= mongoose.model('User',userSchema)
