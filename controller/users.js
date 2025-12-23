const Users = require('../modules/users');
const { setUser } = require('../utils/auth');

const handleUserSignup = async (req, res) => {
  const { userName, emailId, password } = req.body;

  if (!userName || !emailId || !password) {
    return res.status(400).json({
      sucess: false,
      message: 'userName, emailId and password are required',
    });
  }

  const users = await Users.find();

  const existingUser = await Users.findOne({ emailId });

  if (existingUser) {
    return res.status(409).json({
      sucess: false,
      message: 'User already exists with this email',
    });
  }

  const resp = await Users.create({
    userName: userName,
    emailId: emailId,
    password: password,
    userId: users.length + 1,
  });

  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      userName: resp.userName,
      emailId: resp.emailId,
      id: resp.userId,
    },
  });
};

const handleUserSignin = async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    return res.status(400).json({
      sucess: false,
      message: 'emailId, password are required',
    });
  }

  const user = await Users.findOne({ emailId });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const isPasswordMatch = user.password === password;

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const token = setUser(user);
  res.cookie('uid', token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { userName: user?.userName, emailId: user.emailId },
  });
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  const userProfile = await Users.findOne({ userId: id });

  if (!userProfile) {
    return res.status(404).json({
      message: 'No Data Found',
    });
  }

  return res.status(200).json({
    data: {
      id: userProfile.userId,
      name: userProfile.userName,
      emailAddress: userProfile.emailId,
      profileImgUrl: userProfile.profileImg,
    },
  });
};

const updateUserProfile = async (req, res) => {
  const { id } = req.params;

  const { filename } = req.file;
  const { userName, emailId } = req.body;

  if (!id) {
    return res.status(400).json({
      sucess: false,
      message: 'User id is required',
    });
  }

  const updatedUser = await Users.findOneAndUpdate(
    { userId: id },
    {
      userName: userName,
      emailId: emailId,
      profileImg: filename,
    }
  );

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
};

module.exports = {
  handleUserSignin,
  handleUserSignup,
  getUserProfile,
  updateUserProfile,
};
