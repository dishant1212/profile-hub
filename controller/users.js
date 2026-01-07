const crypto = require('crypto');
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
  const { emailId, password, userName } = req.body;

  if ((!emailId && !userName) || !password) {
    return res.status(400).json({
      sucess: false,
      message:
        'Please enter a valid email ID or username, along with your password.',
    });
  }

  const user = await Users.findOne({
    $or: [{ emailId }, { userName }],
  });

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

  const authToken = setUser(user);

  res.cookie('uid', authToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      userName: user?.userName,
      emailId: user.emailId,
      userId: user.userId,
    },
  });
};

const handleCsrfGetToken = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString('hex');

  res.status(200).json({ token: csrfToken });
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
      userId: userProfile.userId,
      userName: userProfile.userName,
      emailId: userProfile.emailId,
      profileImg: '',
      phoneNumber: 0,
      address: '',
      city: '',
      country: '',
    },
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User id is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required',
      });
    }

    const { userName, emailId, phoneNumber, address, city, country } = req.body;

    const updateData = {
      userName,
      emailId,
      phoneNumber,
      address,
      city,
      country,
      profileImg: req.file.path,
    };

    const updatedUser = await Users.findOneAndUpdate(
      { userId: id },
      updateData,
      { new: true }
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
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  handleUserSignin,
  handleUserSignup,
  getUserProfile,
  updateUserProfile,
  handleCsrfGetToken,
};
