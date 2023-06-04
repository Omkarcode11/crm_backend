const { mockReq, mockRes } = require('./../interceptor')
const Ticket = require('./../../models/ticket.model')
const User = require('./../../models/user.model')
const { createTicket, updateTicket, getAllTickets, getOneTicket, assigneeEngineer } = require('./../../controllers/ticket.controller')


const ticketObject = {
    _id: '12345',
    title: "button not working",
    ticketPriority: 1,
    description: "Login Button not working ",
    status: "OPEN",
    reporter: "omkar",
    save: jest.fn().mockImplementation(() => Promise.resolve(updated)),

}

const user =
{
    ticketsAssigned: [], ticketsCreated: [], _id: '123456', userId: "Engineer_new",
    save: jest.fn().mockImplementation(() => Promise.resolve(updated)), userType: 'CUSTOMER'
}

const ticket = {
    _id: '12345'
}

const engineer = {
    id: 'jayesh'
}

const err = "Title is not passed"

const updated = 'ok'



describe('Create Ticket', () => {
    it('should create Ticket', async () => {
        let spyFindOne = jest.spyOn(User, "findOne").mockImplementation(() => Promise.resolve(user))


        let spyCreateTicket = jest.spyOn(Ticket, "create").mockImplementation(() => Promise.resolve(ticket))


        let req = mockReq()
        let res = mockRes()
        req.body = ticketObject
        req.userId = "engineer_omkar"

        await createTicket(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyCreateTicket).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith({ message: "Ticket Created Successfully", data: ticket })

    });

    it('should fail To create ticket', async () => {
        const spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))
        const spyCreate = jest.spyOn(Ticket, 'create').mockImplementation(() => Promise.reject(err))

        let req = mockReq()
        let res = mockRes()

        await createTicket(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyCreate).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            message: "internal Error",
            err
        })
    })


})


describe('update Ticket', () => {


    it('should update because of admin ', async () => {
        let ticketObj = {
            assignee : 'jayesh',
            reporter : "omkar",
            save : jest.fn().mockImplementation(()=>Promise.resolve(ticketObj))
        }
        let newUser = {
            userType : 'ADMIN'
        }
        let req = mockReq()
        let res = mockRes()
        req.params.id = "12345"
        req.userId = 'boss'


        
        
        let spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObj))
        
        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(newUser))
        
        await updateTicket(req,res)

        expect(spyFindById).toHaveBeenCalled()
        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(ticketObj)

    });







    it('should Update Ticket', async () => {
        let spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))


        let req = mockReq()
        let res = mockRes()
        req.userId = "omkar"

        await updateTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(updated)


    });
    it('should Update Ticket Fail Unauthorize user Updated', async () => {
        ticketObject.assignee = 'engineer_01'
        let spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        let spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        let req = mockReq()
        let res = mockRes()
        req.userId = "jayesh"


        await updateTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.send).toHaveBeenCalledWith({
            message: "Ticket can only be updated by the customer who created it"
        })
    });


    it('should Update Fail', async () => {
        let spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => { throw new Error(err) })
        let req = mockReq()
        let res = mockRes()

        req.params = '12345'

        await updateTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
            message: "internal Error"

        })

    })




})


describe('getAllTickets', () => {
    it('should give All tickets', async () => {
        user.userType = "ADMIN"
        const spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))
        const spyFind = jest.spyOn(Ticket, 'find').mockImplementation(() => Promise.resolve([ticketObject, ticketObject]))

        let req = mockReq()
        let res = mockRes()

        req.userId = 'omkar'

        await getAllTickets(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(spyFind).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith([ticketObject, ticketObject])
    });

    it('should give All tickets failed because of userType is not Correct', async () => {
        user.userType = "HACKER"
        const spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        let req = mockReq()
        let res = mockRes()

        req.userId = "yash"

        await getAllTickets(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Your User Type is Not Correct')

    })
    it('should give All tickets failed ', async () => {
        const spyFindOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.reject(err))

        let req = mockReq()
        let res = mockRes()

        req.userId = "yash"

        await getAllTickets(req, res)

        expect(spyFindOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('internal Err')

    })

});


describe('getOneTicket', () => {

    it('should get Ticket as a assignee', async () => {
        ticketObject.assignee = 'jayesh'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'jayesh'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(ticketObject)
    });
    it('should get Ticket as a reporter', async () => {
        ticketObject.reporter = 'jayesh'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'jayesh'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(ticketObject)
    });
    it('should get Ticket as a Admin', async () => {
        ticketObject.reporter = 'jayesh'
        user.userType = 'ADMIN'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))
        const spyFineONe = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'admin'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(ticketObject)
    });
    it('should fail Ticket as a unauthorized ', async () => {
        ticketObject.reporter = 'jayesh'
        user.userType = 'HACKER'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))
        const spyFineOne = jest.spyOn(User, 'findOne').mockImplementation(() => Promise.resolve(user))

        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'hacker'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(spyFineOne).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith("your not authorize to access this ticket")
    });
    it('should fail Ticket not found ', async () => {
        ticketObject.reporter = 'omkar'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(null)


        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'omkar'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith("ticket not found")
    });
    it('should fail Ticket internal Error ', async () => {
        ticketObject.reporter = 'omkar'

        const spyFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => { throw new Error('internal err') })


        let req = mockReq()
        let res = mockRes()
        req.params.id = ticketObject._id
        req.userId = 'omkar'

        await getOneTicket(req, res)

        expect(spyFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith("internal err")
    });

})


describe('assigneeEngineer', () => {
    it('should assignee Engineer ', async () => {
        let req = mockReq()
        let res = mockRes()

        req.body = { ticketId: ticket._id, engineerId: engineer.id }

        ticketObject.assignee = ''
        user.userStatus = 'APPROVED'

        const spyTicketFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))
        const spyUserFindById = jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(user))



        await assigneeEngineer(req, res)


        expect(spyTicketFindById).toHaveBeenCalled()
        expect(spyUserFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(`ticket (Id ${ticket._id}) assigned to engineer (id ${engineer.id})`)



    });

    it('should fail due to not getting ticket', async () => {
        let req = mockReq()
        let res = mockRes()

        req.body = {
            ticketId: '1234',
            engineerId: "jayesh"
        }


        const spyUserFindById = jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(user))
        const spyTicketFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(null))

        await assigneeEngineer(req, res)

        expect(spyUserFindById).toHaveBeenCalled()
        expect(spyTicketFindById).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('ticket id is Incorrect')

    })
    it('should fail due to ticket already assignee', async () => {
        let req = mockReq()
        let res = mockRes()

        req.body = {
            ticketId: '1234',
            engineerId: "jayesh"
        }
        ticketObject.assignee = "jayesh"

        const spyUserFindById = jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(user))
        const spyTicketFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        await assigneeEngineer(req, res)

        expect(spyUserFindById).toHaveBeenCalled()
        expect(spyTicketFindById).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('Already Assign Engineer')

    })
    it('should fail due to engineer not Approved', async () => {
        let req = mockReq()
        let res = mockRes()

        req.body = {
            ticketId: '1234',
            engineerId: "jayesh"
        }
        ticketObject.assignee = ''
        user.userStatus = "PENDING"

        const spyUserFindById = jest.spyOn(User, 'findById').mockImplementation(() => Promise.resolve(user))
        const spyTicketFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        await assigneeEngineer(req, res)

        expect(spyUserFindById).toHaveBeenCalled()
        expect(spyTicketFindById).toHaveBeenCalled()

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith('engineer is not Approved')

    })
    it('should fail due to engineer not Approved', async () => {
        let req = mockReq()
        let res = mockRes()

        req.body = {
            ticketId: '1234',
            engineerId: "jayesh"
        }

        const spyUserFindById = jest.spyOn(User, 'findById').mockImplementation(() => { throw Error('internal Error') })
        const spyTicketFindById = jest.spyOn(Ticket, 'findById').mockImplementation(() => Promise.resolve(ticketObject))

        await assigneeEngineer(req, res)

        expect(spyUserFindById).toHaveBeenCalled()
        expect(spyTicketFindById).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.send).toHaveBeenCalledWith('internal Error')

    })
})