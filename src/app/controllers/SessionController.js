import jwt from 'jsonwebtoken';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController{
  async store(req, res){

    // Data from user request
    const {email, password} = req.body;
    const user = await User.findOne({ where: { email }});

    // Verify if user exists
    if(!user){
      return res.status(401).json({ error: 'User not found.' });
    }

    // Verify user password
    if(!(await user.checkPassword(password))){
      return res.status(401).json({ error: 'Password does not match.' });
    }

    // Select user data
    const { id, name } = user;

    // Return user information
    return res.json({
      user:{
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret,{
        expiresIn: authConfig.expiresIn,
      }),
    });

  }
}

export default new SessionController();
