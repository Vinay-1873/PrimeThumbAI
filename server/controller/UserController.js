import Thumbnail from "../models/Thumbnail.js";
import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";

// update user profile image
export const updateProfileImage = async (req, res) => {
    try {
        const { userId } = req.session;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        // Upload to Cloudinary using stream authentication
        // Since we use memoryStorage, we accept a buffer. 
        // We'll use a Promise wrapper for the stream upload
        const uploadStream = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "primethumb_users",
                        resource_type: "image"
                    }, 
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(file.buffer);
            });
        };

        const result = await uploadStream();
        
        // Update user in DB
        const user = await User.findByIdAndUpdate(
            userId, 
            { profileImage: result.secure_url },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Profile image updated", 
            user 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// constroller to get all user Thumbnails
export const getUserThumbnails = async (req,res)=>{
      try {
        const {userId} = req.session;

        const thumbnail = await Thumbnail.find({userId}).sort({createAt:-1})
        res.json({thumbnail})
      } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message})
      }
}

// controller to get single Thumbnail of a user
export const getThumbnailbyId = async (req,res)=>{
    try{
        const {userId} = req.session;
        const {id}  = req.params;
        const thumbnail = await Thumbnail.findOne({userId, _id: id});
        res.json({thumbnail})
    }catch (error){
          console.log(error);
          res.status(500).json({message:error.message})
    }
}
