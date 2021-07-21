const router = require('express').Router();

const {
  getUsers, getUserById, getMyUserInfo, updateProfile, updateAvatar,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getMyUserInfo);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
