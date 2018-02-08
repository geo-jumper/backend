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
          //add the new score and update the db
        } else {
          //compare to last score in array
          //if bigger, replace and update the db
        }
      }
    });
};