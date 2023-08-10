let getbranchList = async (req, res) => {
    try {

        let  search = '';
        if(req.query.search){
            search = req.query.search
        }

        let page = parseInt(req.query.page) || 1 ;
        const limit = parseInt(req.query.limit) || 3
        const skip = (page - 1) * limit
        const total = await BranchModel.countDocuments()
        const pages = Math.ceil(total / limit)

        if (page > pages) {
            return res.status(404).json({
              status: "fail",
              message: "No page found",
            });
          }
        }
}

// news feed

const relevantPosts = await PostModel.find({
    $or: [
      { access: 'public' },
      { $and: [
        { user: { $in: friends } },
        { access: 'friends' }
      ] },
      {access:'private', user: userId },
      {access:'following', user: { $in: followings } }
    ]
  }).sort({ createdAt: -1 });
  