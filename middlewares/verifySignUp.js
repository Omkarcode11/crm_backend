const User = require("../models/user.model")
const constants = require("../utils/constants")

validateSignUpRequest = async (req, res, next) => {
    //Implement logic for validating the request

    //1.validate the name
    if (!req.body.name) {
        return res.status(400).send({
            message: "Failed! Name is not provided"
        })

    }

    //2. validate the userId
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed! UserId is not provided"
        })

    }

    //3. validate if the userId already exists
    const user = await User.findOne({ name: req.body.name });
    if (user != null) {
        return res.status(400).send({
            message: "Failed! UserId already exists"
        })

    }

    //4. validate email
    if (req.body.email && !req.body.email.length >= 5 ||!req.body.email.includes('@') || !req.body.email.includes('.')){
        return res.status(400).send({message:'Enter Valid Email'})
    }
        //Need to be implemented

        //5. validate if the emailId already exists
        const email = await User.findOne({ email: req.body.email });
    if (email != null) {
        return res.status(400).send({
            message: "Failed! Email already exists"
        })

    }

    //6. Validate the userType
    const userType = req.body.userType;
    const validUserTypes = [constants.userTypes.customer, constants.userTypes.admin, constants.userTypes.engineer]
    if (userType && !validUserTypes.includes(userType)) {
        res.status(400).send({
            message: "UserType provided is invalid"
        })
        return;
    }

    next();
}

const verifySignUp = {
    validateSignUpRequest: validateSignUpRequest
};

module.exports = verifySignUp