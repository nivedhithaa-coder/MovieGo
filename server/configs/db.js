import mongoose from'mongoose'


const connectDB=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log('DB connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/MovieGo`)
    }catch(error){
        console.log(error.message+"   "+`${process.env.MONGODB_URI}/MovieGo`);
    }
}

export default connectDB;