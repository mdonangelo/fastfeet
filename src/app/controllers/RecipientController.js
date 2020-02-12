import Recipient from '../models/Recipient';
import * as Yup from 'yup';

class RecipientController{

  async store(req, res){

    // Schema validator for recipient data
    const schema = Yup.object()
                      .shape(
                        {
                          name: Yup.string().required(),
                          street: Yup.string().required(),
                          number: Yup.number().required(),
                          state: Yup.string().required(),
                          city: Yup.string().required(),
                          zip: Yup.number().required(),
                        }
                      );

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Validation error.'});
    }

    // User validation
    const userExist = Recipient.findOne({ where: {name: req.body.name}});
    if(userExist){
      return res.status(400).json({error: 'User already exists.'});
    }

    // Create recipient
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

}

export default new RecipientController();
