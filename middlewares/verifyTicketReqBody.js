const constants = require("./../utils/constants");

validateTicketRequestBody = (req, res, next) => {
  //validate title of tickets
  if (!req.body.title) {
    return res.status(400).send({
      msg: "Title is not Provided",
    });
  }

  // validate description of tickets
  if (!req.body.description) {
    return req.status(400).send({
      msg: "Failed ! description is not provided",
    });
  }

  next();
};

validateTicketStatus = (req, res, next) => {
  const status = req.body.status;

  const statusTypes = [
    constants.ticketStatus.blocked,
    constants.ticketStatus.closed,
    constants.ticketStatus.inProgress,
    constants.ticketStatus.open,
  ];

  if (status && !statusTypes.includes(status)) {
    return res.status(400).send({
      message: "Failed ! Status provided is invalid ",
    });
  }

  next();
};

const verifyTicketReqBody = {
  validateTicketRequestBody: validateTicketRequestBody,
  validateTicketStatus: validateTicketStatus,
};
