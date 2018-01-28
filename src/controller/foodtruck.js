import mongoose from 'mongoose';
import {Router} from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';
import {authenticate} from '../middleware/authMiddleware';

export default({ config, db})=> {
  let api = Router();

  // '/v1/foodtruck/add'- Create
  api.post('/add',authenticate, (req,res)=>{
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;


    newFoodTruck.save((err,foodtruck) => {
      if(err){
        res.send(err);
      }
      res.json({ message: 'FoodTruck saved successfully'});
    });
  });

  // 'v1/foodtruck/' - Retrieve All 
  api.get('/',(req,res)=>{
    FoodTruck.find({},(err,foodtrucks)=>{
      if(err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
  

  // 'v1/foodtruck/:id' - Retrieve one
  api.get('/:id',(req,res)=>{
    FoodTruck.findById(req.params.id,(err,foodtruck)=>{
      if(err){
        res.send(err);
      }else{
        res.json(foodtruck);
      }
      
    });
  });

  // 'v1/foodtruck/:id' - Update one  
  api.put('/:id',authenticate,(req,res)=>{
    FoodTruck.findById(req.params.id,(err,foodtruck)=>{
      if(err){
        res.send(err);
      }
      foodtruck.name = req.body.name;
      
      foodtruck.save(err=>{
        if(err){
          res.send(err);
        }
        res.json({message: 'User successfully updated'});
      });
    });
  });

    // 'v1/foodtruck/:id' - Delete one  

  api.delete('/:id',authenticate,(req,res)=>{
    FoodTruck.findByIdAndRemove(req.params.id,(err)=>{
      if(err){
        res.send(err);
      }
      res.json({message:'User has been deleted'});
    });
  });

  // add review for a specific foodtruck id 
  // '/v1/foodtruck/reviews/add/:id'

  api.post('/reviews/add/:id',authenticate,(req,res)=>{
    FoodTruck.findById(req.params.id,(err,foodtruck)=>{
      if(err){
        res.send(err);
      }

      let newReview = new Review();
      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;

      newReview.save(function(err){
        if(err){
          res.send(err);
        }
        foodtruck.reviews.push(newReview);
        foodtruck.save(err=>{
          if(err){
            res.send(err);
          }
          res.json({message:'FoodTruck review saved successfully'});
        });
      }); 
    });
  });

  // Retrieve all reviews for a specific foodtruck - '/v1/reviews/:id'
  api.get('/reviews/:id',(req,res)=>{
    Review.find(req.params.id,(err,reviews)=>{
      if(err){
        res.send(err);
      }
      res.json(reviews);
    });
  });

  // Retrieve all foodtrucks that serve a specific foodtype - '/v1/foodtruck/foodtype/:foodtype'
  api.get('/foodtype/:foodtype',(req,res)=>{
    FoodTruck.find({foodtype:req.params.foodtype},(err,foodtruck)=>{
      if(err){
        res.send(err);
      }
        res.send(foodtruck);   
    
    });
  });

  return api;

}
