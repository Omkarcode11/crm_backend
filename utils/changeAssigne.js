const User = require('./../models/user.model')
const Ticket = require('./../models/ticket.model')



exports.changeAssignee = async (oldAssigneeId, ticketId, newAssigneeId) => {
    try {

        let oldAssignee = await User.findOne({ userId: oldAssigneeId })
        let newAssignee = await User.findOne({ userId: newAssigneeId })

        if (oldAssignee && newAssignee) {
            let index = oldAssignee.ticketsAssigned.findIndex((x) => x == ticketId)
            oldAssignee.ticketsAssigned.splice(index, 1)
            newAssignee.ticketsAssigned.push(ticketId)

            await oldAssignee.save()
            await newAssignee.save()

            return true

        } else {
            return false

        }
    } catch (err) {
        console.log(err)
        return err
    }
}
