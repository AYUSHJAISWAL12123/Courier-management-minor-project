const express = require('express');
const router = express.Router();
const db = require('../db');

// Login route (User or Admin)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await db.query('SELECT * FROM users WHERE email=$1 AND password=$2', [email, password]);
  if (result.rows.length > 0) {
    res.json({ success: true, user: result.rows[0] });  // includes is_admin
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Place order (User)
router.post('/order', async (req, res) => {
  const { user_id, package_id, destination } = req.body;
  await db.query(
    'INSERT INTO orders(user_id, package_id, destination, status) VALUES($1, $2, $3, $4)',
    [user_id, package_id, destination, 'Pending']
  );
  res.json({ success: true, message: 'Order placed' });
});

// Fetch user-specific orders
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
  const result = await db.query('SELECT * FROM orders WHERE user_id=$1', [userId]);
  res.json(result.rows);
});

// Fetch all orders (Admin only)
router.get('/all-orders', async (req, res) => {
  const { admin_id } = req.query;

  // Verify admin
  const result = await db.query('SELECT * FROM users WHERE id=$1', [admin_id]);
  if (result.rows.length === 0 || !result.rows[0].is_admin) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const orders = await db.query('SELECT * FROM orders');
  res.json(orders.rows);
});

// Admin updates order status
router.put('/order-status/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { status, admin_id } = req.body;

  // Verify admin
  const result = await db.query('SELECT * FROM users WHERE id=$1', [admin_id]);
  if (result.rows.length === 0 || !result.rows[0].is_admin) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  await db.query('UPDATE orders SET status=$1 WHERE id=$2', [status, orderId]);
  res.json({ success: true, message: 'Order status updated' });
});

module.exports = router;
