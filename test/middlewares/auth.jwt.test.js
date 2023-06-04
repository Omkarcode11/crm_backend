const jwt = require("jsonwebtoken");
const { mockRes, mockReq, mockNext } = require("../interceptor");
const { verifyToken, isAdmin, validateUpdating } = require("../../middlewares/auth.jwt");
const User = require("../../models/user.model");


let user = {
    name: 'omkar',
    userType: 'ADMIN'
}


describe('VerifyToken', () => {

    it('Should Verify Token', async () => {
        let decoded = { id: "omkar" }
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.headers = { 'x-access-token': 'token' }
        let spyJwt = jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.resolve(decoded))

        await verifyToken(req, res, next)

        expect(spyJwt).toHaveBeenCalled()
        expect(req.userId).toBe("omkar")
    });

    it('Should not get Token', async () => {

        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.headers = { 'x-access-token': "" }

        await verifyToken(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({
            msg: "Not Auth Not token Provided"
        })

    })
    it('should get err when verify', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.headers = { 'x-access-token': 'inValidToken' }

        let spyJwtVerify = jest.spyOn(jwt, 'verify').mockImplementation(() => Promise.resolve(null))

        await verifyToken(req, res, next)

        expect(spyJwtVerify).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({
            msg: "Request cannot be authenticated . Token is invalid"
        })

    })


})

describe('isAdmin', () => {
    it('should Pass Admin', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.userId = 'omkar'
        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        await isAdmin(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()


    });
    it('should fail only of Admin', async () => {
        user.userType = "CUSTOMER"
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.userId = 'jayesh'

        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        await isAdmin(req, res, next)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith({
            message: "only admin are allowed this operation"
        })

    })
})

describe('validating Update', () => {
    
    it('should Validate Update', async () => {
         
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
      req.body = {
        name : 'omkar',
        email : "omkar@gmail.com",
        userType : 'CUSTOMER',
        userStatus : "APPROVED"
      }

      await validateUpdating(req,res,next)

      expect(next).toHaveBeenCalled()

    });
    it('should Validate not Update', async () => {
         
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
      req.body = {
        name : 'omkar',
        email : "omkar@gmail.com",
        userType : 'CUSTOMER',
        userStatus : "APPROVED",
        password : "omkar1234"
        
      }

      await validateUpdating(req,res,next)

      expect(res.status).toHaveBeenCalledWith(402)
      expect(res.send).toHaveBeenCalledWith('you cannot update password')

    });


 })