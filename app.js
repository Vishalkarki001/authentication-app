

const express=(require('express'));
const app=express();
const path=require('path')
const Usermodel=require('./models/user');

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser');



//form handling
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//set static fiel
app.use(express.static(path.join(__dirname,'public')));

//set view engine 
app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render('index')
})
app.post('/create', (req,res)=>{
    let{name,email,password,image}=req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let user= await Usermodel.create({
                name,
                email,
                image,
                password:hash
            })
            let token=jwt.sign({email},"shhhhhh");
            res.cookie("token",token);
           res.redirect('profile');
            
            
        
         
        })
    })
 
   
})
app.get('/index',(req,res)=>{
    res.render('index')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.get('/msg',(req,res)=>{
    res.render('msg')
})

app.post('/login',async (req,res)=>{

    let user=await Usermodel.findOne({email: req.body.email});
    if(!user) return res.render('msg')

       

        bcrypt.compare(req.body.password,user.password,(err,result)=>{
            if (!result) res.render('msg')
                else return res.redirect("profile")
          

        })

})



app.get('/profile',async (req,res)=>{
  const users= await Usermodel.find()
    res.render("profile",{users})
})


app.get('/edit/:userid',async (req,res)=>{
let user=await Usermodel.findOne({_id:req.params.userid})
res.render('edit',{user})
})

app.post('/update/:userid',async (req,res)=>{
    let{name,email,image}=req.body; 
    let user=await Usermodel.findOneAndUpdate({_id:req.params.userid},{name,email,image},{new:true})
    res.redirect('/profile')
    })
    app.get('/delete/:userid',async (req,res)=>{
      let user=await  Usermodel.findOneAndDelete({_id:req.params.userid});
      res.cookie("token","")
      res.redirect('/profile')
  
        
    })


app.listen(3000)