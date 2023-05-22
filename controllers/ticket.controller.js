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

    if (ticket && ticket.reporter == req.userId) {
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
    let tickets = await User.findOne({ userId: req.userId })
      .populate("ticketsCreated")
      .exec();
    if (tickets.length) {
      return res.status(200).send(tickets);
    } else {
      return res.status(200).send("No tickets found");
    }
  } catch (err) {
    return res.status(500).send("internal Err");
  }
};

exports.getOneTicket = async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      if (ticket.reporter == req.userId) return res.status(200).send(ticket);
      else
        return res.status(200).send("your not authorize to access this ticket");
    } else {
      return res.status(200).send("ticket not found");
    }
  } catch (err) {
    return res.status(500).send("internal err ");
  }
};
