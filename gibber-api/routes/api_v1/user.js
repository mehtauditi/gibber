const router = require('express').Router();
const User = require('../../models/User');
const auth = require('../auth');
const {ErrorHandler} = require('../../config/error');
const {getNotNullFields, translateText, welcomeMessage} = require('../../utils');
const {upload, getImageName} = require('../../config/storage');
const s3 = require('../../config/s3');
const qr = require('qrcode');
const Conversation = require('../../models/Conversation');
const Message = require('../../models/Message');


const profileFields = {contacts: 0, blocked: 0, blockedFrom: 0, password: 0};

const create = async (req, res, next) => {
  try {
    const {name, phone, email, password, language} = req.body;
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!password) missingFields.push('Password');
    if (!language || language === "") missingFields.push('Language');

    if (missingFields.length > 0)
      return new ErrorHandler(400, "Missing fields: " + missingFields.toString(), missingFields, res);

    const alreadyExists = await User.findOne({
     $or: [
            { email },
            { phone }
          ]
   });
    if (alreadyExists)
      return new ErrorHandler(409, `Either Email or Phone already exist. Please enter a different email address or phone number.`, [], res);

    const user = {email, phone, name, password, language};
    const finalUser = new User(user);
    finalUser.setPassword(user.password);
    finalUser.save(async (err, newUser) => {
      if (err)
        return new ErrorHandler(400, "An error occurred during user creation, please try again later.", [], res);
      const userWithToken = { ...newUser.toJSON() };
      delete userWithToken['password'];
      userWithToken.token = finalUser.generateJWT();
      const adminUser = await User.findOne({ email: 'darpan.patel@gibber.chat' });
      const newConversation = new Conversation({
        users: [adminUser._id, newUser._id]
      });
      // creating coversation with Team account
      await newConversation.save( async (err, newConv) => {
        if (err)
          return new ErrorHandler(404, "Failed to create conversation with team account", [], res);
        await User.updateOne({ _id: adminUser._id }, { $addToSet: { contacts: newUser._id } });
        await User.updateOne({ _id: newUser._id }, { $addToSet: { contacts: adminUser._id } }); 

        // creating reply from Team account
        const translated = await translateText(welcomeMessage, 'en', newUser.language);
        let textArr;
        if(newUser.language === 'en'){
          textArr = [{language: newUser.language, text: translated}];
        }else {
          textArr = [{language: newUser.language, text: translated}, {language: 'en', text: welcomeMessage}];
        }
        const reply = new Message({conversationId: newConv._id, user: adminUser._id, createdAt: new Date(), originalLang: 'en', text: textArr, originalText: welcomeMessage });
        reply.save(async function (err, reply) {
          if (err) return new ErrorHandler(404, "Failed to create message from team account", [], res);
          else {
            const msg = await Message.populate(reply, {path:"user", select: 'name , avatar'});
            res.status(200).json(userWithToken);
          }
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const {email, phone, password} = req.body;
    if ((phone || email) && password) {
      const query = email ? {email} : {phone};
      const user = await User.findOne(query);
      if (!user || !user.validatePassword(password)) return new ErrorHandler(400, (email ? 'email':'phone') + " or password is invalid", [], res);
      const finalData = {token: await user.generateJWT(), ...user.toJSON()};
      delete finalData['password'];
      res.status(200).json(finalData);
    } else
      new ErrorHandler(404, "Missing required fields", [], res);
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const {q} = req.query;
    if (!q) return res.status(404).send("query is required");
    const user = await User.findOne({_id: req.payload.id}, {blocked: 1, blockedFrom: 1});
    const query = {$regex: q, $options: 'i'};
    const data = await User.find(
      {$or: [{name: query}, {phone: query}, {email: query}],
        _id: {$nin: [...user.blocked, ...user.blockedFrom, req.payload.id]}},
      profileFields
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const data = await User.findOne({_id: req.params.id}, profileFields);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const data = await User.findOne({_id: req.payload.id}, {password: 0})
      .populate({path: 'contacts', select: 'name , avatar , phone , email'})
      .populate({path: 'blocked', select: 'name , avatar'})
      .populate({path: 'blockedFrom', select: 'name , avatar'});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const {name, phone, email} = req.body;
    const data = await User.findOneAndUpdate(
      {_id: req.payload.id},
      {$set: {...getNotNullFields({name, phone, email})}},
      {new: true},
    ).select({password: 0});
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const uploaded = await s3.upload(req.file, 'user', getImageName(req.file, req.payload.id));
    await User.updateOne({_id: req.payload.id}, {$set: {avatar: uploaded.key}});
    res.status(200).json({path: uploaded.key});
  } catch (e) {
    next(e);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { userOldPassword, userNewPassword } = req.body;
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
    if (!user || !user.validatePassword(userOldPassword)) {
      new ErrorHandler(400, ('Invalid password or passwords do not match'), [], res);
      return;
    }
    user.setPassword(userNewPassword);
    await user.save();
    res.json(user)
  } catch (e) {
    next(e);
  }
}

const block = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.params.user}, {$addToSet: {blockedFrom: req.payload.id}, $pull: {contacts: req.payload.id}});
    await User.updateOne({_id: req.payload.id}, {$addToSet: {blocked: req.params.user}, $pull: {contacts: req.params.user}});
    res.status(200).json({updated: true});
  } catch (e) {
    next(e);
  }
};

const unblock = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.params.user}, {$pull: {blockedFrom: req.payload.id}});
    await User.updateOne({_id: req.payload.id}, {$pull: {blocked: req.params.user}});
    res.status(200).json({updated: true});
  } catch (e) {
    next(e);
  }
};

const generateQr = async (req, res, next) => {
  try {
    qr.toDataURL(req.body.secret, (err, src) => {
      res.status(200).json({src});
    });
  } catch (e) {
    next(e);
  }
};

const addDevice = async (req, res, next) => {
  try {
    await User.updateOne({_id: req.payload.id}, {$push: {devices: req.body.device}});
    res.send('ok')
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await User.deleteOne({_id: req.payload.id});
    res.json({ok: 1});
  } catch (e) {
    next(e);
  }
};

router.post("/", create);
router.post("/login", login);
router.post("/qr", generateQr);
router.put("/device", auth.required, addDevice);
router.get("/", auth.required, getProfile);
router.get("/search", auth.required, search);
router.get("/:id", auth.required, get);
router.put("/", auth.required, update);
router.put("/avatar", [auth.required, upload.single('avatar')], updateAvatar);
router.put("/password/:id", auth.required, updatePassword);
router.put("/block/:user", auth.required, block);
router.put("/unblock/:user", auth.required, unblock);
router.delete("/:id", auth.required, remove);

module.exports = router;
