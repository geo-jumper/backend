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
//Jeff - for sorting
const compare = (a, b) => {
  const scoreA = a.score;
  const scoreB = b.score;

  let comparison = 0;

  if(scoreA > scoreB){
    comparison = 1;
  }
  if(scoreA < scoreB){
    comparison = -1;
  }
  return comparison;
};
HighScore.create = function(newScore) {
  return new HighScore ({
    level: newScore.level,
    scores: [{username: newScore.username, score: newScore.score}],
  }).save();
};

HighScore.update = function(newScore) {
  if (isNaN(newScore.level)) {
    return;
  }
  let tempNewScore = newScore;
  console.log('newScore', newScore);
  const NUMSCORES = 20; //Jeff - Number of scores to save in db
  let options = { new: true, runValidators: true };
  return HighScore.find({'level': newScore.level})
    .then(scoreObj => {
      if(!scoreObj.length) {
        return HighScore.create(tempNewScore);
      } else {
        scoreObj[0].scores.sort(compare);//Jeff-sorts in descending order
        if(scoreObj[0].scores.length < NUMSCORES) {
          //Jeff - add the new score.  Not important to be sorted.  Will sort when extracting for GET request.
          scoreObj[0].scores.push({score:tempNewScore.score, username: tempNewScore.username});
          //Jeff - update the db
          HighScore.findOneAndUpdate({level: tempNewScore.level }, {scores: scoreObj[0].scores}, options, (error, data) => {
            if (error) {
              console.log(error);
            }
            console.log(data);
          });
        } else {
          //Jeff - compare to last score in array
          console.log('if tempNewScore.score', tempNewScore.score, '> scoreObj[0].scores[19].score', scoreObj[0].scores[NUMSCORES - 1].score);
          if(tempNewScore.score > scoreObj[0].scores[NUMSCORES - 1].score){
            //Jeff - if bigger, replace.  Not important to be sorted.  Will sort when extracting for GET request.
            console.log('update scores: old', scoreObj[0].scores);
            scoreObj[0].scores.splice(NUMSCORES - 1, 1, {
              score: tempNewScore.score,
              username: tempNewScore.username,
            });
            console.log('update scores: new ', scoreObj[0].scores);
            //Jeff - update the db
            HighScore.findOneAndUpdate({ level: tempNewScore.level }, { scores: scoreObj[0].scores }, options, (error, data) => {
              if(error) {
                console.log(error);
              }
              console.log(data);
            });
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