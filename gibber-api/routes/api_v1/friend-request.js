const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../auth');
const {ErrorHandler} = require('../../config/error');
const FriendRequest = require('../../models/FriendRequest');

// POST createRequest call
const create = async (req, res, next) => {
  try {
    const request = new FriendRequest({sender: req.body.sender, receiver: req.body.receiver});
    request.save(async function (err, reply) {
        if (err) return new ErrorHandler(400, "Request could not be created", [], res);
        else {
            // request created
            res.status(200).json({message: {...msg.toJSON()}, name: msg.user.name});
        }
      });
  } catch (e) {
    next(e);
  }
};

// POST acceptRequest call
const accept = async (req, res, next) => {
  try {
    const accepted = await FriendRequest.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            status: "accepted"
        }
    });
    // add receiver to sender's 'friends' array
    await User.updateOne({ _id: accepted.sender }, { $addToSet: { friends: accepted.receiver } });
    // add sender to receiver's 'friends' array
    await User.updateOne({ _id: accepted.receiver }, { $addToSet: { friends: accepted.sender } });

    res.json(accepted);
  } catch (e) {
    next(e);
  }
};

// POST declineRequest call
const decline = async (req, res, next) => {
  try {
    const declined = await FriendRequest.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            status: "declined"
        }
    });
    res.json(declined);
  } catch (e) {
    next(e);
  }
};

// GET getSentRequests call
const getSent = async (req, res, next) => {
  try {
    const data = await FriendRequest.find({sender: req.params.id});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

// GET getReceivedRequests call
const getReceived = async (req, res, next) => {
    try {
      const data = await FriendRequest.find({receiver: req.params.id});
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

// DELETE removeRequest call
const remove = async (req, res, next) => {
  try {
    const data = await FriendRequest.deleteOne({_id: req.params.id});
    res.json(data);
  } catch (e) {
    next(e);
  }
}

router.post("/", auth.required, create);
router.post("/accept/:id", auth.required, accept);
router.post("/decline/:id", auth.required, decline);
router.get("sent/:id", auth.required, getSent);
router.get("received/:id", auth.required, getReceived);
router.delete("/:id", auth.required, remove);

module.exports = router;
