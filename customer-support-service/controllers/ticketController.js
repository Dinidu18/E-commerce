const TicketModel = require('../models/ticketModel');

// GET /api/tickets
const getAllTickets = (req, res) => {
  try {
    const { status, priority, category, agentId, customerId } = req.query;
    let tickets = TicketModel.findAll();

    if (status) tickets = tickets.filter((t) => t.status === status);
    if (priority) tickets = tickets.filter((t) => t.priority === priority);
    if (category) tickets = tickets.filter((t) => t.category === category);
    if (agentId) tickets = tickets.filter((t) => t.agentId === agentId);
    if (customerId) tickets = tickets.filter((t) => t.customerId === customerId);

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/tickets/:id
const getTicketById = (req, res) => {
  try {
    const ticket = TicketModel.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tickets
const createTicket = (req, res) => {
  try {
    const { customerId, subject, description } = req.body;
    if (!customerId || !subject || !description) {
      return res.status(400).json({ success: false, message: '"customerId", "subject", and "description" are required.' });
    }
    if (req.body.priority && !TicketModel.TICKET_PRIORITIES.includes(req.body.priority)) {
      return res.status(400).json({ success: false, message: `Invalid priority. Allowed: ${TicketModel.TICKET_PRIORITIES.join(', ')}` });
    }
    const ticket = TicketModel.create(req.body);
    res.status(201).json({ success: true, message: 'Support ticket created successfully.', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tickets/:id
const updateTicket = (req, res) => {
  try {
    if (req.body.status && !TicketModel.TICKET_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${TicketModel.TICKET_STATUSES.join(', ')}` });
    }
    const ticket = TicketModel.update(req.params.id, req.body);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, message: 'Ticket updated successfully.', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/tickets/:id
const deleteTicket = (req, res) => {
  try {
    const ticket = TicketModel.delete(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, message: 'Ticket deleted successfully.', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Health Check Controller
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    service: 'Customer Support Service',
    timestamp: new Date().toISOString(),
  });
};

module.exports = { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket, getHealth };
