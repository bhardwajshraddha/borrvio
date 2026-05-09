const express = require('express');
const router = express.Router();
const { addItem, getAllItems, getItemById, updateItem, deleteItem, toggleAvailability } = require('../controllers/itemController');
const protect = require('../middleware/protect');

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', protect, addItem);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);
router.patch('/:id/toggle', protect, toggleAvailability);

module.exports = router;