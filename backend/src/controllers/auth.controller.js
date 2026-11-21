

export const checkAuth =  (req, res) => {
    if(!req.user){
        return res.status(200).json({success: false, message: "Unauthorized"});
    }
    return res.status(200).json({success: true, message: "Authorized", data: req.user});
}

