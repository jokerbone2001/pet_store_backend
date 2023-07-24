var express = require('express');
const { createHash } = require('crypto');
var router = express.Router();
//var NFT = require('../models/NFT');
var Order = require('../models/Order');
var Product = require('../models/Product');
var User = require('../models/User');

/* GET home page. */
// router.get('/', function(req, res, next) {

//   NFT.find({})
//   .then(nfts => {
//     res.render('index', {nfts: nfts });
//   })
//   .catch(err => {
//     console.log(err);
//   });

// });
// get order json file
router.get('/order_json',(req,res,next)=>{
  Order.find({})
  .then(orders => {
    //console.log(nfts);
    res.json(orders);
  })
  .catch(err => {
    console.log(err);
  });
});

// get product json file
router.get('/product_json',(req,res,next)=>{
  Product.find({})
  .then(products => {
    //console.log(nfts);
    res.json(products);
  })
  .catch(err => {
    console.log(err);
  });
});
router.get('/product_json/:id', (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId)
    .then(product => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Product not found');
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err.message);
    });
});

// get user json file
router.get('/user_json',(req,res,next)=>{
  User.find()
  .then(users => {
    //console.log(nfts);
    res.json(users);
  })
  .catch(err => {
    console.log(err);
  });
});





// // get nft json file
// router.get('/nft_json',(req,res,next)=>{
//   NFT.find({})
//   .then(nfts => {
//     //console.log(nfts);
//     res.json(nfts);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// });


// router.get('/nft/:id', function(req, res, next) {
//   NFT.findById(req.params.id)
//     .then(nfts => {
//       res.render('nft', {nft: nfts });    })
//     .catch(err => {
//       console.log(err);
//     });
// });

// router.get('/create', function(req, res, next) {
//   res.render('create', { title: 'Create NFT' });
// });

// router.post('/create', function(req, res, next) {
//   const nft = new NFT(req.body);
//   nft.save()
//     .then(() => {
//       res.redirect('/');
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// });

// router.post('/nft/:id/mint', function(req, res, next) {
//   NFT.findById(req.params.id)
//     .then(nft => {
//       if(nft.volume > 0)
//       {
//         nft.owner.push(req.body.owner);
//         nft.volume-=1;
//         return nft.save();
//       }
//       else
//       {
//         res.send("it is sold out");
//         res.end();
//       }
      
//     })
//     .then(() => {
//       res.redirect(`/nft/${req.params.id}`);
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// });

// router.post(`/nft/:id/delete`,function(req, res, next) {
//   NFT.findByIdAndRemove(req.params.id)
//     .then(nft => {
//       res.redirect(`/`);
//     })
//     .catch(err => {
//       console.log(err);
//       next(err);
//     });
// });

// user sign up and login
// var user = {};

// function hash(string) {
//   return createHash('sha256').update(string).digest('hex');
// }
// function generateSalt(length) {
//   var result = '';
//   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// } 
// router.post('/user/sign_up',(req, res, next)=>{
//   const {email_address, password} = req.body;
//   const salt =  generateSalt(Math.floor(Math.random() * 10 + 1)); 
//   const user = new User({
//     email_address,
//     salt,
//     password:hash(password+salt)
//   }
//   );
//   user.save()
//   res.send(`successfully sign up, ${user.salt} ${user.password}`);
  
// });

// router.post('/user/log_in',(req, res, next)=>{

//   const {email_address, password} = req.body;
//   User.findOne({email_address})
//   .then(user => {
//     res.send(hash(password+user.salt) === user.password ? "Congratulations!!!, successfully log in" : "Sad!!!, password not correct");
//   })
//   .catch(err => {
//     console.log(err);
//     res.send("No such a user");
//   });
// });

module.exports = router;