'use strict';

import mongoose, { Schema } from 'mongoose';
import httpError from 'http-errors' ;
import { pagerCreate } from '../lib/util';

const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  wins: {
    type: Number,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const Profile = mongoose.model('profile', profileSchema);

Profile.create = function(request) {
  return new Profile({
    account: request.account._id,
    name: request.account.username,
    wins: 0,
  })
    .save()
    .then(profile => {
      return request.account.save()
        .then(() => profile);
    });
};

Profile.fetch = pagerCreate(Profile);

Profile.fetchOne = function(request) {
  return Profile.findById(request.params.id)
    .then(profile => {
      if (!profile) {
        throw new httpError(404, '__ERROR__ Profile not found');
      }
      return profile;
    });
};

Profile.update = function(request) {
  let options = { new: true, runValidators: true };
  return Profile.findByIdAndUpdate(request.params.id, { wins: request.body.wins }, options);
};

export default Profile;
