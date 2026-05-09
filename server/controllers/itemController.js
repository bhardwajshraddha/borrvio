const Item = require('../models/Item');

/*Add Item
const addItem = async (req, res) => {
  try {
    const { name, category, description, pricePerDay, securityDeposit, city, area } = req.body;

    const item = await Item.create({
      owner: req.user._id,
      name,
      category,
      description,
      pricePerDay,
      securityDeposit,
      city,
      area,
      images: []
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/
const addItem = async (req, res) => {
  try {
    const { name, category, description, pricePerDay, securityDeposit, city, area, address, images } = req.body;

    const item = await Item.create({
      owner: req.user._id,
      name,
      category,
      description,
      pricePerDay,
      securityDeposit,
      city,
      area,
      address,
      images: images || []
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get All Items
const getAllItems = async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, search } = req.query;

    let filter = { isAvailable: true };

    if (category) filter.category = category;
    if (city) filter.city = city;
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
    }

    const items = await Item.find(filter).populate('owner', 'name city averageRating trustScore');

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Item
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name city averageRating trustScore phone email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Item
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Availability
const toggleAvailability = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({ 
      message: `Item ${item.isAvailable ? 'activated' : 'deactivated'} successfully`,
      isAvailable: item.isAvailable 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { addItem, getAllItems, getItemById, updateItem, deleteItem, toggleAvailability };