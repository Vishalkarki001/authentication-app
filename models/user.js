const mongoose=require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/userdata`);
const UserSchema=mongoose.Schema({
    name:String,
    email:String,
    image:String,
    password:String,
    
})
module.exports=mongoose.model('user',UserSchema);