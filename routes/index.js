var express = require('express');
var router = express.Router();
//var NFT = require('../models/NFT');
var Order = require('../models/Order');
var Product = require('../models/Product');
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {

  NFT.find({})
  .then(nfts => {
    res.render('index', {nfts: nfts });
  })
  .catch(err => {
    console.log(err);
  });

});
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

// get nft json file
router.get('/nft_json',(req,res,next)=>{
  NFT.find({})
  .then(nfts => {
    //console.log(nfts);
    res.json(nfts);
  })
  .catch(err => {
    console.log(err);
  });

});


router.get('/nft/:id', function(req, res, next) {
  NFT.findById(req.params.id)
    .then(nfts => {
      res.render('nft', {nft: nfts });    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create NFT' });
});

router.post('/create', function(req, res, next) {
  const nft = new NFT(req.body);
  nft.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post('/nft/:id/mint', function(req, res, next) {
  NFT.findById(req.params.id)
    .then(nft => {
      if(nft.volume > 0)
      {
        nft.owner.push(req.body.owner);
        nft.volume-=1;
        return nft.save();
      }
      else
      {
        res.send("it is sold out");
        res.end();
      }
      
    })
    .then(() => {
      res.redirect(`/nft/${req.params.id}`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.post(`/nft/:id/delete`,function(req, res, next) {
  NFT.findByIdAndRemove(req.params.id)
    .then(nft => {
      res.redirect(`/`);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
});

module.exports = router;