const { validateSignUpRequest } = require("../../middlewares/verifySignUp")
const userModel = require("../../models/user.model")
const User = require("../../models/user.model")
const { mockReq, mockRes, mockNext } = require("../interceptor")

const user = {
    name: "omkar",
    userId: 'om',
    email: "omkar@gmail.com",
    userType: "CUSTOMER"
}

describe('validate Signup request', () => {

    it('should validate signup', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body = user

        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(null))

        await validateSignUpRequest(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })
    it('should fail Not passing name', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.name = ""
        req.body = user

        await validateSignUpRequest(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Failed! Name is not provided"
        });

    });
    it('should fail Not passing userId', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.name = "omkar"
        user.userId = ""
        req.body = user

        await validateSignUpRequest(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            message: "Failed! UserId is not provided"
        });
    });
    it('should fail userId already exist', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.userId = "om"
        req.body = user
        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve({ name: user.name }))

        await validateSignUpRequest(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({

            message: "Failed! UserId already exists"
        })
    });
    it('should fail Not passing email', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.email = "thereIsNoEmail"

        req.body = user

        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(null))


        await validateSignUpRequest(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Enter Valid Email' });
    });
    it('should fail Email already exist', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.email = "omkar@gmail.com"
        req.body = user
        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementationOnce(() => Promise.resolve(null))
        let spyFindOneEmail = jest.spyOn(User, 'findOne').mockImplementationOnce(() => Promise.resolve({ email: "omkar@gmail.com" }))

        await validateSignUpRequest(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyFindOneEmail).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            message: "Failed! Email already exists"
        })



    });
    it('should fail userType is invalid', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        user.email = "omkar@gmail.com"
        user.userType = "HACKER"
        req.body = user

        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(null))

        await validateSignUpRequest(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            message: "UserType provided is invalid"
        })
    });

})