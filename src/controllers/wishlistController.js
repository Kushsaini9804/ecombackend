const Wishlist = require('../models/Wishlist');

/* ADD / REMOVE */
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const exists = await Wishlist.findOne({ userId, productId });

    if (exists) {
      await Wishlist.deleteOne({ _id: exists._id });
      return res.json({ wished: false });
    }

    // 🔴 FETCH PRODUCT
    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 🔴 SAVE SNAPSHOT
    await Wishlist.create({
      userId,
      productId,
      title: product.title,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      discount: product.discount,
      rating: product.rating,
    });

    res.json({ wished: true });
  } catch (err) {
    res.status(500).json({ message: 'Wishlist error' });
  }
};
/* GET USER WISHLIST */
// const getWishlist = async (req, res) => {
//   try {
//     const list = await Wishlist.find({ userId: req.user._id })
//       .populate('productId');

//     res.json({ success: true, wishlist: list });
//   } catch (err) {
//     res.status(500).json({ message: 'Fetch failed' });
//   }
// };
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id });
    res.json({
        success: true,
        data: wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { toggleWishlist, getWishlist };
