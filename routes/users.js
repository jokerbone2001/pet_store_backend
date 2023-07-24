var express = require('express');
const passport = require('passport');

var router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');  // make sure you've installed jsonwebtoken
const Order = require('../models/Order');
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({ email_address: "reid"})
    .then(docs =>{
      res.send(docs);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.headers.authorization)
  if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(' ')[1],
          decoded;
          console.log(authorization)
      try {
          decoded = jwt.verify(authorization, 'abc');
          //console.log(decoded);
      } catch (e) {
          return res.status(401).send('unauthorized');
      }
      var user_email_address = decoded.email_address;
      //console.log(user_email_address);

      // Fetch the user by id 
      User.findOne({email_address: user_email_address}).then(function(user){     
          res.json(user); // it will send back the user's document found in the database
      }).catch(function(err){
          res.status(500).send('Error occurred while fetching user');
      });
  } else {
      return res.status(500).send('Could not find authorization token');
  }
  // res.send('You have accessed a protected route!');
});
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(' ')[1], decoded;
      //console.log(authorization);
      try {
          decoded = jwt.verify(authorization, 'abc');
      } catch (e) {
          return res.status(401).send('unauthorized');
      }
      console.log(decoded);
      var user_email_address = decoded.email_address;
      console.log(user_email_address);
      // Find the user and update it with request data
      User.findOneAndUpdate(
          { email_address: user_email_address }, // find by email address
          { $set: req.body }, // update the user's data
          { new: true, useFindAndModify: false } // options
      )
      .then(updatedUser => {
          if (!updatedUser) {
              return res.status(404).send('User not found.');
          }
          res.json({ message: 'User updated successfully', user: updatedUser });
      })
      .catch(err => {
          console.error(err);
          res.status(500).send('Error occurred while updating user');
      });
      
  } else {
      return res.status(500).send('Could not find authorization token');
  }
});
// create product.js and order.js
router.post('/order/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  //console.log("enter /order/add");

  const {user_id,order_time,product,total_price} = req.body;
  if (req.headers && req.headers.authorization) {
      let authorization = req.headers.authorization.split(' ')[1], decoded;
      try {
          decoded = jwt.verify(authorization, 'abc');
      } catch (e) {
          return res.status(401).send('unauthorized');
      }
      let id = decoded.user_id;
      // console.log(req.body);
      // console.log(product[0]);
      Product.findOne({_id:product[0].product_id})
      .then(isProduct=>{
        if (!isProduct) {
          return res.status(404).send('Product not found.');
        }
       
        instock = isProduct.amount - product[0].amount;
        console.log(instock);
        if (instock < 0) {
          return res.json({ message: "Order failed due to insufficient stock." });
        }
        else if(instock >= 0)
        {
          isProduct.amount = instock;
          Order.findOne({user_id})
          .then(order => {
              // each products : Product.findOne({product[i]})
              // .then (product) =>{ if(product.amount - quantity) < 0 , break and message： sell out 
              // else 将product存入数据库.save，并且message：'Order processed successfully'}
            
              if (order) {
                //console.log(order);
                  // If an order with this user_id already exists
                  // Add the new product(s) to the products array of the existing order

                  
                  order.products = order.products.concat(req.body.product);
                  order.total_price += total_price;
                  order.order_time = new Date(); // Update the order time
                  order.status = req.body.status || order.status; // Update the status if provided, otherwise keep the current one
              } else {
                
                  order = new Order({
                      user_id,
                      order_time,
                      product,
                      total_price,
                      status: req.body.status || 'unpaid'  // 默认状态是 'unpaid'
                  });
              }
              
              return order.save();
          })
          .then(order => {
            res.json({ message: "Successfully added", order });
          })
          .catch(err => {
              console.error(err);
              res.status(500).send('Error occurred while processing the order');
          });
        }
        return isProduct.save(); 
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error occurred while processing find Product');
    });
     
} else {
return res.status(500).send('Could not find authorization token');
}
});

module.exports = router;
