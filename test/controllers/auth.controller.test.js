const db = require("../db");
const { mockReq, mockRes } = require("../interceptor");
const User = require("./../../models/user.model");
const { signin, signup } = require("../../controllers/auth.controller");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDB());
afterAll(async () => await db.closeDB());

const testPayload = {
  userId: "1",
  name: "Test",
  password: "12345678",
  userType: "CUSTOMER",
  email: "test@gmail.com",
  userStatus: "PENDING",
  ticketsCreated: [],
  ticketsAssigned: []
}

describe("SignUp", () => {

  it('Should pass and create the user', async () => {
    const req = mockReq();
    const res = mockRes();
    req.body = testPayload

    await signup(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@gmail.com",
        name: "Test",
        userId: "1",
        userStatus: "APPROVED",
        userType: "CUSTOMER"
      })
    )
  })

  it('Should return error while user creation', async () => {
    const spy = jest.spyOn(User, 'create').mockImplementation(() => { throw new Error("Error") })
    const req = mockReq()
    const res = mockRes()

    testPayload.userType = 'ENGINEER'
    req.body = testPayload

    await signup(req, res)

    expect(spy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith({
      message: "Some internal error occured while creating the user"
    })
  })

})


describe("SignIn", () => {

  it('Should fail due to password mismatch', async () => {
    testPayload.userStatus = "APPROVED"
    const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(testPayload))
    const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false)
    const req = mockReq();
    const res = mockRes()
    req.body = testPayload

    await signin(req, res)

    expect(userSpy).toHaveBeenCalled()
    expect(bcryptSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.send).toHaveBeenCalledWith({
      message: "Password provided is invalid"
    })
  })

  it('Should fail as userStatus is PENDING', async () => {
    testPayload.userStatus = "PENDING"
    const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(testPayload))
    const req = mockReq()
    const res = mockRes()
    req.body = testPayload

    await signin(req, res)

    expect(userSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.send).toHaveBeenCalledWith({
      message: "Can't allow user to login as the status is " + testPayload.userStatus
    })
  })

  it('Should fail as userId notaSDL;ASJal;s', async () => {
    const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(null))
    const req = mockReq()
    const res = mockRes()
    const payload = {
      userId: "omkar",
      password: "omkar"
    }
    req.body = payload

    await signin(req, res)

    expect(userSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith({
      message: "Failed! UserId doesn't exist"
    })

  })

  it('Should pass and signIn the user', async () => {
    testPayload.userStatus = "APPROVED"
    const userSpy = jest.spyOn(User, "findOne").mockReturnValue(Promise.resolve(testPayload))
    const bcryptSpy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true)
    const jwtSpy = jest.spyOn(jwt, "sign").mockReturnValue("token")
    const req = mockReq()
    const res = mockRes()

    await signin(req, res)

    expect(userSpy).toHaveBeenCalled()
    expect(bcryptSpy).toHaveBeenCalled()
    expect(jwtSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({

      accessToken: "token",
    email: "test@gmail.com",
        name: "Test",
     userId: "1",
      userStatus: "APPROVED",
      userTypes: "ENGINEER",

    })


  })
})





