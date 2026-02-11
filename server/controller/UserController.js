import Thumbnail from "../models/Thumbnail.js";

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
