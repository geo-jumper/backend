'use strict';

import mongoose, { Schema } from 'mongoose';

// Schema
const highScoreSchema = new Schema({
  level: {
    type: Number,
    required: true,
  },
  scores: [{
    username: String,
    score: Number, //Jeff - {'username': username, 'score': score}
  }],
});

// Model
const HighScore = (module.exports = mongoose.model('high-score', highScoreSchema));

HighScore.create = function(newScore) {
  return new HighScore ({
    level: newScore.level,
    scores: [{username: newScore.username, score: newScore.score}],
  }).save();
};

HighScore.update = function(newScore) {
  let tempNewScore = newScore;
  console.log('newScore', newScore);
  const NUMSCORES = 20; //Jeff - Number of scores to save in db
  let options = { new: true, runValidators: true };
  return HighScore.find({'level': newScore.level}).sort({'scores.score': 'desc'})
    .then(scoreObj => {
      console.log('scoreObj: ', scoreObj);
      if(!scoreObj.length) {
        return HighScore.create(tempNewScore);
      } else {
        if(scoreObj[0].scores.length < NUMSCORES) {
          console.log('score object length: ', scoreObj[0].scores.length);
          //Jeff - add the new score.  Not important to be sorted.  Will sort when extracting for GET request.
          scoreObj[0].scores.push({score:tempNewScore.score, username: tempNewScore.username});
          console.log('updated scoreObj[0].scores: ', scoreObj[0].scores);
          console.log('new score object length: ', scoreObj[0].scores.length );
          //Jeff - update the db
          console.log('tempNewScore.level: ', tempNewScore.level);
          HighScore.findOneAndUpdate({'level': tempNewScore.level }, {scores: scoreObj[0].scores}, options);
        } else {
          //Jeff - compare to last score in array
          if(tempNewScore.score > scoreObj.scores[NUMSCORES - 1]){
            //Jeff - if bigger, replace.  Not important to be sorted.  Will sort when extracting for GET request.
            scoreObj[0].scores.splice(NUMSCORES - 1, 1, {
              score: tempNewScore.score,
              username: tempNewScore.username,
            });
            //Jeff - update the db
            HighScore.findOneAndUpdate({ level: tempNewScore.level }, { scores: scoreObj[0].scores }, options);
          }
          //Jeff - else do nothing
        }
      }
    })
    .catch(err => console.log(err));
};

HighScore.fetch = function() {
  return HighScore.find({});
};