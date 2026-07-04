import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});
const uploadOnCloudinary = async (localfilepath) => {
    try{
        if(!localfilepath) return null;
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"image"
        });
        console.log("file is uploaded ",response.url);
        fs.unlinkSync(localfilepath);
        return response;
    }
    catch(error){
        if(localfilepath && fs.existsSync(localfilepath)){
            console.log(1);
        fs.unlinkSync(localfilepath);
        }
    console.log(error);
    return null;
    }
};
export {uploadOnCloudinary}
