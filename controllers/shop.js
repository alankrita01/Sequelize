const Product = require('../models/product');
const Cart = require('../models/cart');

//for Product page
//retriving all products
exports.getProducts = (req, res, next) => {

  Product
  .findAll()                                                 // let's assume we get a products list array to our function that get executed here
  .then(products => {                                        //render page once we got the products and simply pass the product
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));

};

//Retriving single product when click on details 
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findAll({where: {id:prodId}})                        //looking for all products where the id === prodId (using where condition)
  .then(products => {                                           //findAll() always give us multiple items even if it's an array with only 1 element.
    res.render('shop/product-detail', {                 
      product: products[0],                                     //Hence we want only 1 product details from array that's way use product[0]
      pageTitle: products[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};



//Shop page => retriving all products on Shop page
//in getIndex, we will get our all products

exports.getIndex = (req, res, next) => {                         //findAll to get all the records for this model and we could pass options in findAll 
  Product                                                        
  .findAll()
  .then(products => {                                            //let's assume we get a products list array to our function that get executed here
    res.render('shop/index', {                                   //render page once we got the products and simply pass the product
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => console.log(err));
};



exports.getCart = (req, res, next) => {
 //console.log(req.user.cart);
req.user
.getCart()
.then(cart => {
  //console.log(cart)
  return cart.
  getProducts()
  .then(products => {
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    });
  })
  .catch(err => console.log(err));
})
.catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  let newQantity = 1;
  req.user
  .getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts({where: {id:prodId}});
  })
  .then(products => {
    let product;
    if(products.length>0){
      product = products[0];
    }
    
    if(product){
      const oldQuantity = product.cartItem.quantity;
      newQantity = oldQuantity +1;
     return product;
    }
    return Product.findById(prodId)
  })
  .then(data => {
    return fetchCart.addProduct(product,{through: {quantity: newQantity}})
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
  .getCart()
  .then(cart => {
    return cart.getProduct({where: {id: prodId}})
  })
  .then(products => {
    const product = products[0];
    product.cartItem.destroy();
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
