const { authJwt, verifyTicketReqBody } = require("../middlewares");

const ticketController = require("./../controllers/ticket.controller");

module.exports = function (app) {
  app.post(
    "/crm/api/v1/tickets",
    [authJwt.verifyToken],
    ticketController.createTicket
  );
  app.put(
    "/crm/api/v1/tickets/:id",
    [authJwt.verifyToken],
    ticketController.updateTicket
  );
  app.get(
    "/crm/api/v1/tickets/",
    [authJwt.verifyToken],
    ticketController.getAllTickets
  );
  app.get(
    "/crm/api/v1/tickets/:id",
    [authJwt.verifyToken],
    ticketController.getOneTicket
  );
  app.put(
    "/crm/api/v1/tickets/assignee/engineer",
    [authJwt.verifyToken, authJwt.isAdmin],
    ticketController.assigneeEngineer
  );
};
