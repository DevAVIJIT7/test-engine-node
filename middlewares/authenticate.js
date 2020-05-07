const User = require("./../models/User");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("authorization").split(' ')[1]
    
    User.findByToken(token).then((user) => {
      if (!user) {
        return Promise.reject();
      }
  
      req.user = user;
      req.token = token;
      next();
    }).catch((e) => {
      res.status(401).send({
        message: "You are unauthorize!"
      });
    }); 
  } catch (error) {
    console.log(error)
    res.status(500).json({message: error.message});
  }
};

module.exports = authenticate;
