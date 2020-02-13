import * as Yup from 'yup';
import User from '../models/User';

class UserController{
  // CREATE USER
  async store(req, res){
    // Create schema validator for store
    const schema = Yup.object()
    .shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'});
    }

    // Check if email exists
    const userExist = await User.findOne({where: { email: req.body.email}});
    if(userExist){
      return res.status(400).json({error: 'User already exists.'});
    }

    // Sign up user
    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  // UPDATE USER
  async update(req, res){
    // Create schema validator for update
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation fails.'});
    }

    // Select data from user
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // If change email, verify if that already exists
    if(email && email != user.email){
      const userExist = await User.findOne({ where: { email: email } });
      if(userExist){
        return res.status(400).json({error: 'User already exists.'});
      }
    }

    // If change password, verify if old password match
    if(oldPassword && !(await user.checkPassword(oldPassword))){
      return res.status(401).json({ message: 'Password does not match.'});
    }

    // Update user info
    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
    });
  }
}

export default new UserController();
