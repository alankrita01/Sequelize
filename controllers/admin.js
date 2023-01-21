//importing Product model from the models file
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
 
  //create creates a new element based on that model and immediately saves it to the database.
  //There also is Build which also creates a new object based on the model but only in javascript and then we need to save it manually.
  //so create basically does it in one go, while in build we get the object in javascript first before we then have to save it manually.

  Product.create({
    title: title,                                              //left side of':' refers to one of attributes, right side of ':' refers to constant
    price: price,
    imageUrl: imageUrl,
    description: description
  })
  .then(result => {
    //console.log(result);
    console.log('Created Product')
  })
  .catch(err => console.log(err));
    
};


//for editing we first of all need to load the product that gets edited => so looking for getEditProduct function in the admin.js controller.
//retrieve edit mode thing and the product Id , find a product by Id using promise instead of callback function

// this function for retriving edit product 
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then(product => {
      if (!product) {                                   //if we get no product, redirect to '/' shop page
        return res.redirect('/');
      }
      res.render('admin/edit-product', {                //otherwise render the view with loaded product
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};


//if we change something after clicking on edit button and save it, this does save to database correctly

//this function for saving edit product to database
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  console.log(prodId)

  Product.findByPk(prodId)
    .then(product =>{                                     //product needs to be updated
      product.title = updatedTitle;                       //work with all the attributes, product has per model definition and change them
      product.price = updatedPrice;                       //this will not directly chnage the data in the database
      product.imageUrl = updatedImageUrl;                 //it will only do localy in our app, in javascript app here for the moment.
      product.description = updatedDesc;
      return product.save();                              //save method takes the product as we edit and saves it back to the database
    })
    //we return the save() method beacuse we don't want to nested promise. So we return the promise which is return ny save() and simply add .then() block below

    .then(result => {                                      //this then() block will now handel any success response from this save promise.
      console.log('Updated Product');
      res.redirect('/admin/products');
    })                          
    .catch(err => console.log(err));                      //handel error for both then block
  
};



//Admin Page => to display my products
exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err));
};


//product which are retrive from getEditProduct are delete using PostDelete Product 
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;                        //get the product id which retrive
  Product.findByPk(prodId)
    .then(product =>{
      return product.destroy();
    })
    .then(result => {
      console.log('Product Deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
