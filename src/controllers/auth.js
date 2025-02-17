import { PrismaClient } from "@prisma/client";
import bcrypt, { compare } from "bcrypt";
import validator from "validator";


const prisma = new PrismaClient();


export async function create_user(req,res){
    const {email, phone, name, password} = req.body;

    if(!email || !phone || !name || !password){
        return res.status(400).json({error: "All fields are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid email"});
    }
    if(!validator.isMobilePhone(phone)){
        return res.status(400).json({error: "Invalid phone number"})
    }
    if(password.length < 6){
        return res.status(400).json({error: "Password must be at least 6 characters"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    try{
        const user = await prisma.user.create({
            data: {
                email,
                phone,
                name,
                password: hashedPassword
            }
        })
        console.log(user);
        return res.status(201).json({message: "User created successfully", user});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

export async function login_user(req,res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "All fields are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid email"});
    }
    try{
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({error: "Invalid password"});
        }
        return res.status(200).json({message: "Login successful", user});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
};

export async function create_admin(req,res){
    const {email, phone, name, password} = req.body;

    if(!email || !phone || !name || !password){
        return res.status(400).json({error: "All fields are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid email"});
    }
    if(!validator.isMobilePhone(phone)){
        return res.status(400).json({error: "Invalid phone number"})
    }
    if(password.length < 6){
        return res.status(400).json({error: "Password must be at least 6 characters"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    try{
        const admin = await prisma.admin.create({
            data: {
                email,
                phone,
                name,
                password: hashedPassword
            }
        })
        console.log(admin);
        return res.status(201).json({message: "Admin created successfully", admin});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
}

export async function login_admin(req,res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "All fields are required"});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({error: "Invalid email"});
    }
    try{
        const admin = await prisma.admin.findUnique({
            where: {
                email
            }
        })
        if(!admin){
            return res.status(404).json({error: "Admin not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if(!isPasswordValid){
            return res.status(400).json({error: "Invalid password"});
        }
        return res.status(200).json({message: "Login successful", admin});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: "Internal server error"});
    }
}

export async function logout(req, res) {
    // Clear the cookie
    res.clearCookie('token');
  
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  export async function display_user(req, res) {
   const { id } = req.params; // Getting the userId from the route parameters   
    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }       
    try {
      // Find the user by its ID
      const user = await prisma.user.findUnique({
        where: { id: id },
      });       
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }       
      return res.status(200).json({
        message: 'User details fetched successfully',
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }   
};