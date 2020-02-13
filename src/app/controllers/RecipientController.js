import Recipient from '../models/Recipient';
import * as Yup from 'yup';

class RecipientController{

  async store(req, res){

    // Schema validaton for recipient data
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
    const userExist = await Recipient.findOne({ where: { name: req.body.name }});
    if(userExist){
      return res.status(400).json({error: 'User already exists.'});
    }

    // Verify if is a new address
    const addressExist = await Recipient.findOne({ where: { street: req.body.street, zip: req.body.zip, number: req.body.number, complement: req.body.complement } });
    if(addressExist){
      return res.status(400).json({error: 'Address already exists.'});
    }

    // Create recipient
    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  async update(req, res){
    // Schema validaton for recipient data
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

    // Find recipient by ID
    const recipient = await Recipient.findByPk(req.params.id);

    // Update recipient
    const newRecipient = await recipient.update(req.body);

    return res.json(newRecipient);
  }

}

export default new RecipientController();
