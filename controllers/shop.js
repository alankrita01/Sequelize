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
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
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
