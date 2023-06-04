const db = require('../db')
const User = require('../../models/user.model')
const { mockReq, mockRes } = require('./../interceptor')
const { findAll, findById, updateUser } = require('./../../controllers/user.controller'
)



describe("FindAll User", () => {
    it("should pass and Return User", async () => {
        const users = ['user1', 'user2', 'user3']
        const spyFindAll = jest.spyOn(User, "find").mockReturnValue(users)
        const req = mockReq()
        const res = mockRes()

        await findAll(req, res)
        expect(spyFindAll).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(users)


    })

    it("should fail", async () => {
        const spyFindAll = jest.spyOn(User, "find").mockImplementation(() => { throw new Error(null) })
        const req = mockReq()
        const res = mockRes()

        await findAll(req, res)
        expect(spyFindAll).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("Internal Error")

    })
})
describe("Find By Id User", () => {
    let user = { name: "omkar" }

    it("should pass and return the user", async () => {
        const spyFindOne = jest.spyOn(User, 'findOne').mockReturnValue(user)
        const req = mockReq()
        const res = mockRes()

        await findById(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(user)

    })

    it("should user not Found ", async () => {
        const spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(null)
        const req = mockReq()
        const res = mockRes()

        await findById(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            msg: "User not found"
        })





    })



})
describe("Update User", () => {
    it("should pass and return the update user", async () => {
        const users = ['user1', 'user2']
        let spyFindByOneAndUpdate = jest.spyOn(User, "findOneAndUpdate").mockReturnValue(users)
        let req = mockReq()
        let res = mockRes()
        req.params.userId = "1234"
        req.body = { name: "omkar", email: "omkaor@gmail.com" }

        await updateUser(req, res)

        expect(spyFindByOneAndUpdate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith("user updated successfully")


    })

    it("should not found user", async () => {
        const spyFindByOneAndUpdate = jest.spyOn(User, 'findOneAndUpdate').mockReturnValue([])
        let req = mockReq()
        let res = mockRes()
        req.params.userId = "123"
        req.body = { name: 'omkar', email: "omkar@gmail.com" }

        await updateUser(req, res)

        expect(spyFindByOneAndUpdate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('user not Found')
    })

    it("should fail to Update ", async () => {
        let spyFindByOneAndUpdate = jest.spyOn(User, "findOneAndUpdate").mockImplementation(() => { throw new Error(err) })
        let req = mockReq()
        let res = mockRes()
        req.params.userId = "123"
        req.body = { name: 'omkar', email: "omkar@gmail.com" }
        const err = 'internal Error'


        await updateUser(req, res)

        expect(spyFindByOneAndUpdate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith(err)

    })





})