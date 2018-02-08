'use strict';

import mongoose, { Schema } from 'mongoose';

// Schema
const highScoreSchema = new Schema({
  level: {
    type: Number,
    required: true,
  },
  scores: {
    type: [Object],
  },
});

// Model
const HighScore = (module.exports = mongoose.model('high-score', highScoreSchema));

HighScore.create = function(request) {
  return new HighScore ({
    level: request.highScore.level,
    scores: request.highScore.scores,
  })
    .save()
    .then(highScore => {
      return request.highScore.save().then(() => highScore);
    });
};

HighScore.update = function(request) {
  let tempRequest = request;
  // let options = { new: true, runValidators: true };
  return HighScore.find({'level': request.highScore.level}).sort({'scores.score': 'desc'})
    .then(scoreObj => {
      if(!scoreObj) {
        return HighScore.create(tempRequest);
      } else {
        if(scoreObj.scores.length < 5) {
          //Jeff - add the new score.  Not important to be sorted.  Will sort when extracting for GET request.
          scoreObj.scores.push(tempRequest.highScore.score);
          //Jeff - update the db
          HighScore.findOneAndUpdate({'level': tempRequest.highScore.level }, scoreObj);
        } else {
          //Jeff - compare to last score in array
          if(tempRequest.highScore.score > scoreObj.scores[4]){
            //Jeff - if bigger, replace.  Not important to be sorted.  Will sort when extracting for GET request.
            scoreObj.scores.splice(4, 1, tempRequest.highScore);
            //Jeff - update the db
            HighScore.findOneAndUpdate({ 'level': tempRequest.highScore.level }, scoreObj);
          }
          //Jeff - else do nothing
        }
      }
    })
    .catch(err => console.log(err));
};