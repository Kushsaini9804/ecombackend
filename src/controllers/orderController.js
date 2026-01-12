// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// // buy now 

// const buyNow = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { productId, qty = 1, payment_type = 'COD', address } = req.body;
    
//     if (!productId)
//       return res.status(400).json({ message: 'Product ID required' });

//     if (!address?.name || !address?.phone || !address?.street || !address?.city || !address?.state || !address?.zip) {
//       return res.status(400).json({ message: 'Complete address is required' });
//     }
    
//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
    
//     const safeQty = Math.max(Number(qty), 1);
    
//     const order = await Order.create({
//       userId,
//       items: [
//         {
//           productId: product._id,
//           title: product.title,
//           image: product.image,
//           qty: safeQty,
//           price: product.price,
//         },
//       ],
//       total: product.price * safeQty,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
//     });
    
//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (err) {
//     console.error('BUY NOW ERROR:', err);
//     res.status(500).json({ message: 'Buy now failed' });
//   }
// };

// const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const orders = await Order.find({ userId })
//       .populate('items.productId', 'title price image')
//       .sort({ createdAt: -1 });


//     const formattedOrders = orders.map(order => ({
//       orderId: order._id.toString(),
//       total: Number(order.total) || 0,
//       items: order.items.map(i => ({
//         productId: i.productId?._id,
//         title: i.productId?.title,
//         price: Number(i.productId?.price ?? 0),
//         qty: Number(i.qty ?? 1),

//         // ✅ ALWAYS FULL IMAGE URL
//         image: i.productId?.image
//           ? `${process.env.BASE_URL}${
//               i.productId.image.startsWith('/')
//                 ? i.productId.image
//                 : '/' + i.productId.image
//             }`
//           : null,
//       })),
//       status: order.status || 'Pending',

//     // FIXED: ensure numbers instead of strings
//     const formattedOrders = orders.map(order => ({
//       orderId: order._id.toString(),
//       total: Number(order.total) || 0,  
//       items: order.items.map(i => ({
//         productId: i.productId?._id,
//         title: i.productId?.title,
//         price: Number(i.productId?.price ?? 0),  
//         qty: Number(i.qty ?? 1),                 
//         image: i.productId?.image,
//       })),
//       status: order.status || 'Approved',
// // >>>>>>> 587ecf5 (Initial Backnd)
//       payment_type: order.payment_type || 'COD',
//       address: order.address,
//       createdAt: order.createdAt,
//     }));


//     res.json({
//       success: true,
//       orders: formattedOrders,
//     });
//   } catch (err) {
//     console.error(err);
//   }
//    catch (error) {
//     console.error('Get orders error:', error);
//     res.status(500).json({ message: 'Failed to fetch orders' });
//   }
// };


// // create order
// const placeOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { payment_type = 'COD', address } = req.body;

//     if (!address)
//       return res.status(400).json({ message: 'Delivery address required' });
    
//     const cart = await Cart.findOne({ userId }).populate('items.productId');

//     if (!cart || cart.items.length === 0)
//       return res.status(400).json({ message: 'Your cart is empty' });

//     const items = cart.items.map(i => ({
//       productId: i.productId._id,
//       title: i.productId.title,
//       image: i.productId.image,
//       qty: i.qty,
//       price: i.productId.price,
//     }));
    
//     const total = cart.items.reduce(
//       (sum, i) => sum + i.qty * i.productId.price,
//       0
//     );

//     const order = await Order.create({
//       userId,
//       items,
//       total,
//       address,
//       payment_type,
//       status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
//     });
    
//     cart.items = [];
//     await cart.save();

//     res.status(201).json({
//       success: true,
//       message: 'Order placed successfully',
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.error('Order error:', error);
//     res.status(500).json({ message: 'Order failed' });
//   }
// };

// module.exports = { placeOrder, getMyOrders, buyNow };


const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/* =========================
   BUY NOW
========================= */
const buyNow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, qty = 1, payment_type = 'COD', address } = req.body;

    if (!productId)
      return res.status(400).json({ message: 'Product ID required' });

    if (
      !address?.name ||
      !address?.phone ||
      !address?.street ||
      !address?.city ||
      !address?.state ||
      !address?.zip
    ) {
      return res.status(400).json({ message: 'Complete address is required' });
    }

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: 'Product not found' });

    const safeQty = Math.max(Number(qty), 1);

    const order = await Order.create({
      userId,
      items: [
        {
          productId: product._id,
          title: product.title,
          image: product.image,
          qty: safeQty,
          price: product.price,
        },
      ],
      total: product.price * safeQty,
      address,
      payment_type,
      status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (error) {
    console.error('BUY NOW ERROR:', error);
    res.status(500).json({ message: 'Buy now failed' });
  }
};

/* =========================
   GET MY ORDERS
========================= */
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'title price image')
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
      orderId: order._id.toString(),
      total: Number(order.total) || 0,
      status: order.status || 'Pending',
      payment_type: order.payment_type || 'COD',
      address: order.address,
      createdAt: order.createdAt,

      items: order.items.map(item => ({
        productId: item.productId?._id,
        title: item.productId?.title,
        price: Number(item.productId?.price ?? 0),
        qty: Number(item.qty ?? 1),
        image: item.productId?.image
          ? `${process.env.BASE_URL}${item.productId.image.startsWith('/') ? '' : '/'}${item.productId.image}`
          : null,
      })),
    }));

    res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

/* =========================
   PLACE ORDER (FROM CART)
========================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment_type = 'COD', address } = req.body;

    if (!address)
      return res.status(400).json({ message: 'Delivery address required' });

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Your cart is empty' });

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      title: item.productId.title,
      image: item.productId.image,
      qty: item.qty,
      price: item.productId.price,
    }));

    const total = cart.items.reduce(
      (sum, item) => sum + item.qty * item.productId.price,
      0
    );

    const order = await Order.create({
      userId,
      items,
      total,
      address,
      payment_type,
      status: payment_type === 'Online' ? 'Confirmed' : 'Pending',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      orderId: order._id,
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Order failed' });
  }
};

module.exports = {
  buyNow,
  getMyOrders,
  placeOrder,
};
