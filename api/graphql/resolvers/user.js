/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server-express');

const User = require('../../models/user');
const { SECRET_KEY, SECRET_KEY_REFRESH } = require('../../config');
const validateInput = require('../../utils/validateInput');
const checkAuth = require('../../utils/checkAuth');
const { ContactsOutlined } = require('@material-ui/icons');

const generateTokens = async (user, secret, refreshSecret) => {
  const generateToken = jwt.sign(
    { email: user.email },
    secret,
    // eslint-disable-next-line comma-dangle
    { expiresIn: '40s' }
  );

const generateRefreshToken =  jwt.sign(
    { email: user.email },
    refreshSecret,
    // eslint-disable-next-line comma-dangle
    { expiresIn: '1y' }
  );

  return Promise.all([generateToken, generateRefreshToken])
}

const refreshTokens = async (refreshToken, SECRET, SECRET_2) => {
  let email = -1;
  try {
    email = jwt.decode(refreshToken).email;
  } catch (err) {
    return {};
  }

  if (!email) {
    return {};
  }


  let user = await User.findOne({ email });

  if (!user) {
    return {};
  }


  const refreshSecret = SECRET_2 + user.password;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await generateTokens(user, SECRET, refreshSecret);
  
  return {
    user,
    token: newToken,
    refreshToken: newRefreshToken,
  };
};

const setResTokenCookies = (res, token, refreshToken) => {
  const cookieFlags = {maxAge: 157784630,  httpOnly: true }
  res.cookie('slimytick-jwt', `Bearer ${token}`, cookieFlags);
  res.cookie('slimytick-refresh-jwt', `Bearer ${refreshToken}`, cookieFlags);
}

module.exports = {
  Query: {
    async userInfo(_, _2, context) {
      try {
        const { email } = checkAuth(context);

        const user = await User.findOne({ email });

        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async login(_, { email, password }, context) {
      const { errors, valid } = validateInput(email, password, false);
      const user = await User.findOne({ email });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const [token, refreshToken] = await generateTokens(user, SECRET_KEY, SECRET_KEY_REFRESH + user.password)
      const { res } = context;
      
      setResTokenCookies(res, token, refreshToken)

      return {
        ...user._doc,
        token,
      };
    },
    async refreshLogin(_, __, {req, res}) {
      const token = req.cookies['slimytick-jwt'];
      let user
      
      if (token) {
        try {
          const { email } = checkAuth(token); 
          user = await User.findOne({ email });
        } catch (err) {
          const refreshToken = req.cookies['slimytick-refresh-jwt'];
          const newTokens = await refreshTokens(refreshToken.split('Bearer ')[1], SECRET_KEY, SECRET_KEY_REFRESH)
          if (newTokens.token && newTokens.refreshToken) {
            setResTokenCookies(res, newTokens.token, newTokens.refreshToken)
            user = newTokens.user
          }
        }
      }
        
        return user;
    },
    async register(_, { email, password, confirmPassword }, {res}) {
      // Validate user data

      const { valid, errors } = validateInput(email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      // task Make sure user doesn't already exist

      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is taken',
          },
        });
      }

      // task hash pasword and create an authentication token
      const hashedPassword = await bcrypt.hash(password, 12);

      const inboxGroup = {
        name: "Inbox",
        tasks: [],
        created: new Date().toISOString(),
      };

      let newUser = new User({
        email,
        password: hashedPassword,
        created: new Date().toISOString(),
        groups: [inboxGroup],
      });

      newUser = await newUser.save();

      const [token, refreshToken] = await generateTokens(newUser, SECRET_KEY, SECRET_KEY_REFRESH + newUser.password)

      setResTokenCookies(res, token, refreshToken)  

      return newUser
    },
  },
};
