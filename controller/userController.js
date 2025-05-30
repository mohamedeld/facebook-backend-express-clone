const ApiError = require("../config/apiError");
const asyncHandler = require("../config/asyncHandler");
const { sendVerificationEmail } = require("../helpers/mailer");
const { validateEmail, validateLength, validateUsername } = require("../helpers/validations");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs")


const register = asyncHandler(async (req,res,next)=>{
    const {firstName,lastName,username,email,password,bYear,bMonth,bDay,gender} = req.body;

    const validatedEmail = validateEmail(email);
    if(!validatedEmail){
        return next(new ApiError("Invalid email address",400))
    }

    if(!validateLength(firstName,3,30)){
        return next(new ApiError("firstName must be between 3 and 30 characters",400));
    }
    if(!validateLength(lastName,3,30)){
        return next(new ApiError("lastName must be between 3 and 30 characters",400));
    }

    if(!validateLength(password,6,40)){
        return next(new ApiError("password must be at least 6 characters",400));
    }
    let newUsername = await validateUsername(username);
    const findUser = await User.findOne({email});
    if(findUser){
        return next(new ApiError("user is already found",400));
    }
    
    const user =await new User({
        firstName,lastName,username:newUsername,email,password,bYear,bMonth,bDay,gender
    }).save()
    const token = user?.createJWT();
    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendVerificationEmail(user?.email,user?.firstName,url);
    res.status(201).json({
        id:user?._id,
        username:user?.username,
        firstName:user?.firstName,
        lastName:user?.lastName,
        picture:user?.picture,
        token
    });
})
const protect = asyncHandler(async (request,response,next)=>{
  
  
    let token;
    if(request.headers.authorization && request.headers.authorization.startsWith('Bearer')){
      token = request.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new Error("access denied")
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const currentUser = await User.findById(decoded.userId);
    if(!currentUser){
      throw new Error(
        "the user that belong to this token does no longer exist"
      );
    }
    request.user = currentUser;
    next();
  
});

const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new ApiError("User email not found",400))
    }
    const hashedPassword = await bcrypt.compare(password,user?.password);
    if(!hashedPassword){
        return next(new ApiError("password is not correct",400))
    }
    const newUser = await User.findByIdAndUpdate(user?.id,{verified:true},{new:true});
    const token = newUser?.createJWT();
    res.status(200).json({user:newUser,token});
})

module.exports = {
    register,
    protect,
    login
}