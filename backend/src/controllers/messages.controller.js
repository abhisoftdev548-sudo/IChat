import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../configs/imagekit.config.js";
import { getReceiverSocketIds, io } from "../configs/socket.config.js";
export const getUsers = async (req, res) => {
  try {
    console.log("working")
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");
console.log(filteredUsers)
    res.status(200).json({ success: true, data: filteredUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const conversations = await Message.aggregate([
      // Keep only the messages I sent or received.
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      // Collapse them intto one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // Put the most recent conversation at the top.
      { $sort: { lastMessageAt: -1 } },
      // Look up each partner's user profile (comes back as an array).
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      // Put that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      // Hide the private clerkId field from the result.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getMessages = async (req, res) => {
    try{
        const {id: userToChatId} = req.params;
        const loggedInUserId = req.user._id;
        const messages = await Message.find({
            $or: [{senderId: loggedInUserId, receiverId: userToChatId}, {senderId: userToChatId, receiverId: loggedInUserId}]
        }).sort({createdAt: 1});
        res.status(200).json({success: true, data: messages});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}


export const sendMessage = async (req, res) => {
    try{
        const {text} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl = "", videoUrl = "";
        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({success: false, message: "Media upload is not configured"});
            }
            const url = await uploadChatMedia(req.file);
            if(req.file.mimetype.startsWith("video/")) videoUrl = url;
            else imageUrl = url;
        }
        const message = await new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            video: videoUrl
        })

        await message.save();
         const receiverSocketIds = getReceiverSocketIds(receiverId);
         receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit("newMessage", message);
         });
        res.status(201).json({success: true, data: message});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}
