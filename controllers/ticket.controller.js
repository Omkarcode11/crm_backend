const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");
const constants = require("../utils/constants");

exports.createTicket = async (req, res) => {
  const ticketObject = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
    status: req.body.status,
    reporter: req.userId,
  };

  // assign an engineer to the ticket which is ni approved state

  const engineer = await User.findOne({
    userType: constants.userTypes.engineer,
    userStatus: constants.userStatus.approved,
  });

  ticketObject.assignee = engineer.userId;

  try {
    const ticket = await Ticket.create(ticketObject);

    if (ticket) {
      const user = await User.findOne({ userId: req.userId });

      user.ticketsCreated.push(ticket._id);
      await user.save();
      if (engineer) {
        engineer.ticketsAssigned.push(ticket._id);
        await engineer.save();
      }
    }

    

    return res
      .status(200)
      .send({ message: "Ticket Created Successfully", data: ticket });
  } catch (err) {
    return res.status(500).json({ message: "internal Error ", err });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (
      (ticket && ticket.reporter == req.userId) ||
      ticket.assignee == req.userId
    ) {
      (ticket.title =
        req.body.title != undefined ? req.body.title : ticket.title),
        (ticket.description =
          req.body.description != undefined
            ? req.body.description
            : ticket.description),
        ticket.ticketPriority != undefined
          ? req.body.ticketPriority
          : ticket.ticketPriority,
        (ticket.status =
          req.body.status != undefined ? req.body.status : ticket.status);

      var updatedTicket = await ticket.save();

      return res.status(200).send(updatedTicket);
    }

    let userInfo = await User.findOne({ userId: req.userId });

    if (userInfo.userType == constants.userTypes.admin) {
      (ticket.title =
        req.body.title != undefined ? req.body.title : ticket.title),
        (ticket.description =
          req.body.description != undefined
            ? req.body.description
            : ticket.description),
        ticket.ticketPriority != undefined
          ? req.body.ticketPriority
          : ticket.ticketPriority,
        (ticket.status =
          req.body.status != undefined ? req.body.status : ticket.status);

      var updatedTicket = await ticket.save();

      return res.status(200).send(updatedTicket);
    } else {
      return res.status(401).send({
        message: "Ticket can only be updated by the customer who created it ",
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "internal Error",
      err,
    });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    let user = await User.findOne({ userId: req.userId });
    let tickets;

    if (user.userType === constants.userTypes.customer)
      tickets = await Ticket.find({ _id: { $in: user.ticketsCreated } });
    else if (user.userType === constants.userTypes.engineer)
      tickets = await Ticket.find({ _id: { $in: user.ticketsAssigned } });
    else if (user.userType === constants.userTypes.admin)
      tickets = await Ticket.find({});
    else return res.status(200).send("Your User Type is Not Correct");

    if (tickets.length) return res.status(200).send(tickets);
    else return res.status(200).send("No tickets found");
  } catch (err) {
    return res.status(500).send("internal Err");
  }
};

exports.getOneTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      if (ticket.assignee == req.userId) return res.status(200).send(ticket);
      if (ticket.reporter == req.userId) return res.status(200).send(ticket);
      let user = await User.findOne({ userId: req.userId });
      if (user.userType === constants.userTypes.admin) {
        return res.status(200).send(ticket);
      } else
        return res.status(200).send("your not authorize to access this ticket");
    } else {
      return res.status(200).send("ticket not found");
    }
  } catch (err) {
    return res.status(500).send("internal err ");
  }
};

exports.assigneeEngineer = async (req, res) => {
  let ticketId = req.body.ticketId;
  let engineerId = req.body.engineerId;

  try {
    let ticket = await Ticket.findById(ticketId);
    let engineer = await User.findById(engineerId);

    if (
      ticket &&
      ticket.assignee.length == 0 &&
      engineer &&
      engineer.userStatus === constants.userStatus.approved
    ) {
      ticket.assignee = engineerId;
      engineer.ticketsAssigned.push(ticketId);
      await ticket.save();
      await engineer.save();
      return res
        .status(200)
        .send(
          `ticket (Id ${ticketId}) assigned to engineer (id ${engineerId})`
        );
    } else if (!ticket) return res.status(200).send("ticket id is Incorrect");
    else if (ticket.assignee.length)
      return res.status(200).send("Already Assign Engineer");
    else if (engineer.userStatus != constants.userStatus.approved)
      return res.status(200).send("engineer is not Approved");
    else return res.status(200).send("engineer Id is Incorrect");
  } catch (err) {
    res.status(500).send(err);
  }
};
