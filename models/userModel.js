const {Schema,models,model} = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"],
        trim:true
    },
    lastName:{
        type:String,
        required:[true,"Last name is required"],
        trim:true
    },
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    picture:{
        type:String,
        default:"https://www.flaticon.com/free-icons/user"
    },
    cover:{
        type:String,
        trim:true
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        required:[true,"gender is required"]
    },
    bYear:{
        type:Number,
        required:[true,"Birth year is required"],
    },
    bMonth:{
        type:Number,
        required:[true,"Birth month is required"],
    },
    bDay:{
        type:Number,
        required:[true,"Birth day is required"],
    },
    verified:{
        type:Boolean,
        default:false
    },
    friends:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
    requests:{
        type:Array,
        default:[]
    },
    search:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ],
    details:{
        bio:String,
        otherName:String,
        job:String,
        workplace:String,
        highSchool:String,
        college:String,
        currentCity:String,
        homeTown:String,
        relations:{
            type:String,
            enum:["Single","In a relationship","Engaged","Married","It's complicated"],
        },
        instagram:String
    },
    savedPosts:[
        {
            posts:{
                type:Schema.Types.ObjectId,
                ref:"Post"
            },
            savedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}


const User = models?.User || model("User",userSchema)
module.exports = User;