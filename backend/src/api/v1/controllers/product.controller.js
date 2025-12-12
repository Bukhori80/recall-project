import Product from '../../../models/Product.js';

// 1. GET ALL PRODUCTS
// Bisa filter by category: GET /products?category=ROAMING
export const getAllProducts = async (req, res) => {
  try {
    const { category, active } = req.query;
    let query = {};

    if (category) query.category = category;
    if (active) query.isActive = active === 'true';

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. CREATE PRODUCT (Admin Only)
export const createProduct = async (req, res) => {
  try {
    // Cek apakah ml_label sudah ada?
    const existing = await Product.findOne({ ml_label: req.body.ml_label });
    if (existing) {
      return res.status(400).json({ message: `Label ML '${req.body.ml_label}' sudah digunakan oleh produk lain.` });
    }

    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Produk berhasil dibuat',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// 4. UPDATE PRODUCT (Admin Only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return data terbaru
      runValidators: true
    });

    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json({
      status: 'success',
      message: 'Produk berhasil diupdate',
      data: product
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// 5. DELETE PRODUCT (Admin Only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.status(200).json({ status: 'success', message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};