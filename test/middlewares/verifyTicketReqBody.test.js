const { mockReq, mockRes, mockNext } = require("../interceptor");

const { validateTicketRequestBody, validateTicketStatus } = require('../../middlewares/verifyTicketReqBody')


let ticket = {
    title: 'Button is not working',
    description: "When i click login button not Working"
}


describe('Validate Ticket Request', () => {

    it('validate Ticket Request', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()

        req.body = ticket

        await validateTicketRequestBody(req, res, next)

        expect(next).toHaveBeenCalledWith();
    });

    it('should not validate Ticket not provide title', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        await validateTicketRequestBody(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            msg: "Title is not Provided",
        });
    })
    it('should not validate Ticket not provide description', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body = { title: 'button not working' }
        await validateTicketRequestBody(req, res, next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            msg: "Failed ! description is not provided",
        });
    })


})

describe('validate Ticket Status', () => { 
    it('should ', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body.status = "OPEN"

        await validateTicketStatus(req,res,next)

        expect(next).toHaveBeenCalled()
    });
    it('should ', async () => {
        let req = mockReq()
        let res = mockRes()
        let next = mockNext()
        req.body.status = "NOT_AVAILABLE"

        await validateTicketStatus(req,res,next)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.send).toHaveBeenCalledWith({
            message: "Failed ! Status provided is invalid", 
        })
    });
    it('should ', async () => {});
 })