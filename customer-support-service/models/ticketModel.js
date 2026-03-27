const { v4: uuidv4 } = require('uuid');

let tickets = [
  {
    id: uuidv4(),
    customerId: 'CUST-001',
    orderId: 'ORD-001',
    subject: 'Item arrived damaged',
    description: 'The wireless headphones I received had a broken headband. I need a replacement.',
    status: 'open',
    priority: 'high',
    category: 'damaged_item',
    agentId: null,
    resolution: null,
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    customerId: 'CUST-002',
    orderId: 'ORD-002',
    subject: 'Wrong size delivered',
    description: 'I ordered size 42 running shoes but received size 44.',
    status: 'in_progress',
    priority: 'medium',
    category: 'wrong_item',
    agentId: 'AGENT-003',
    resolution: null,
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const TICKET_STATUSES = ['open', 'in_progress', 'awaiting_customer', 'resolved', 'closed'];
const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'];
const TICKET_CATEGORIES = ['damaged_item', 'wrong_item', 'missing_item', 'refund_request', 'delivery_issue', 'general_inquiry', 'other'];

const TicketModel = {
  findAll: () => tickets,

  findById: (id) => tickets.find((t) => t.id === id),

  findByCustomer: (customerId) => tickets.filter((t) => t.customerId === customerId),

  findByAgent: (agentId) => tickets.filter((t) => t.agentId === agentId),

  create: (data) => {
    const ticket = {
      id: uuidv4(),
      customerId: data.customerId,
      orderId: data.orderId || null,
      subject: data.subject,
      description: data.description,
      status: data.status || 'open',
      priority: data.priority || 'medium',
      category: data.category || 'general_inquiry',
      agentId: data.agentId || null,
      resolution: data.resolution || null,
      attachments: data.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.push(ticket);
    return ticket;
  },

  update: (id, data) => {
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tickets[index] = { ...tickets[index], ...data, id, updatedAt: new Date().toISOString() };
    return tickets[index];
  },

  delete: (id) => {
    const index = tickets.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const [deleted] = tickets.splice(index, 1);
    return deleted;
  },

  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CATEGORIES,
};

module.exports = TicketModel;
