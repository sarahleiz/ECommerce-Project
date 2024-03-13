import Customer from '../models/Customer.js';
import Product from '../models/Product.js';


//renders home page
export const home = async (req, res) => {
  let customer = await Customer.findById(req.user._id);
  if (!customer.cart) {
    customer.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
  }
  if (!customer.purchases) {
    customer.purchases = { items: [], totalQuantity: 0, totalPrice: 0 };
  } 
  customer.save();
  
  const products = await Product.find();
  res.render('index', { products });
};



//gets 6 products for each page (pagination)
export const getProducts = async (req, res) => {
  const { name, page = 1, pageSize = 6 } = req.body; // Default pageSize to 6

  let query = {};

  if (name) {
    query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
  }

  try {
    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    const products = await Product.find(query)
      .sort({ price: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send(error);
  }
};



//adds products to cart from index.ejs, then runs flash message on cart.ejs page
export const addToCart = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    quantity = parseInt(quantity);
    const product = await Product.findById(productId);

    if (!product) {
        req.flash('error', 'Product not found!');
        return res.redirect('/');
    }

    const price = product.price;

    const userId = req.user._id;
    let customer = await Customer.findOne({ _id: userId });

    const itemIndex = customer.cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
        customer.cart.items[itemIndex].quantity += quantity;
        customer.cart.items[itemIndex].price = price;
    } else {
        customer.cart.items.push({ productId, quantity, price });
    }

    customer.cart.totalQuantity += quantity;
    customer.cart.totalPrice += price * quantity;

    await customer.save();
    const populatedCustomer = await Customer.findOne({ _id: userId }).populate('cart.items.productId');
  
    //flash code that isn't working...
    req.flash('success', `${product.name} was added to your cart!`);

    res.redirect('/showCart');
  } catch (error) {
    console.error(error);

    // If there's an error, flash an error message
    req.flash('error', 'Error processing request');
    res.redirect('/');
  }
};



//gets cart for each registered user
export const showCart = async (req, res) => {
  try {
    const populatedCustomer = await Customer.findOne({ _id: req.user }).populate('cart.items.productId');
    res.render('cart', { user: populatedCustomer, flashMessages: req.flash() });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};



//clears cart for corresponding user
export const clearCart = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user });
    customer.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
    customer.save();
    res.redirect('/showCart');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}



//purchases all items in cart, moves purchased items to customer's order history, takes user to /thankYou.ejs page
export const purchase = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user }).populate('cart.items.productId');

    if (!customer) {
      console.error('Customer not found.');
      return res.status(404).send('Customer not found.');
    }

    const cartItems = customer.cart.items;

    console.log('Cart Items:', cartItems);

    // Iterate over the items in the cart and add them to the purchases
    cartItems.forEach(cartItem => {
      const { productId, quantity, price } = cartItem;

      // Find the index of the item in purchases
      const itemIndex = customer.purchases.items.findIndex(purchaseItem => purchaseItem.productId.toString() === productId.toString());

      if (itemIndex > -1) {
        // If the item already exists in purchases, update the quantity and price
        customer.purchases.items[itemIndex].quantity += quantity;
        customer.purchases.items[itemIndex].price = price || 0; // Set a default value if price is null
      } else {
        // If the item doesn't exist in purchases, add it
        customer.purchases.items.push({ productId, quantity, price: price || 0 }); // Set a default value if price is null
      }
    });

    // Update totalQuantity and totalPrice in purchases
    customer.purchases.totalQuantity += customer.cart.totalQuantity;
    customer.purchases.totalPrice += customer.cart.totalPrice;

    // Clear the cart after items are added to purchases
    customer.cart = { items: [], totalQuantity: 0, totalPrice: 0 };

    await customer.save();

    console.log('Customer after purchase:', customer);

    res.redirect('/thankYou');
  } catch (error) {
    console.error('Error during purchase:', error);
    res.status(500).send('An error occurred during purchase.');
  }
};



//gets purchase history for user currently logged in
export const customer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.user }).populate('purchases.items.productId');

    res.render('customer', {user: customer}); 
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}



//takes user to /thankYou.ejs page after purchase
export const thankYou = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.user }).populate('purchases.items.productId');
        res.render('thankYou', { user: customer }); // Pass the user variable to the EJS file
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};