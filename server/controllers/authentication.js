const crypt = require('../middlewares/crypt');
const email = require('../middlewares/email');
const jwt = require('../middlewares/token');
const q = require('q');
const userRepository = require('../repositories/user');
const userValidation = require('../validations/user');
const url = require('url');

// Check if it's a real user
// Validate token
// Send status 200
function checkReset(req, res, next) {
    const userEmail = req.params.email;

    function validateToken(userFound) {
        return jwt.validateToken(req, userFound.password);
    }

    userRepository.findByEmail(userEmail)
      .then(userValidation.validateToLogin)
      .then(validateToken)
      .then(() => {
          res.status(200).end();
      })
      .catch(next);
}

// Validate required field
// Find user, if it's not found will just end request for security reasons
// Create recovery account token
// send email assync, will not wait
function forgot(req, res, next) {
    const user = {
        email: req.body.email
    };

    if (!user.email) {
        next({ status: 400, content: 'Você precisa informar o e-mail' });
        return;
    }

    userRepository.findOne(user).then((userFound) => {
        if (!userFound) {
            return;
        }

        const token = jwt.createToken({ email: userFound.email }, 86400, userFound.password);

        const recoveryUrl = url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: `reset/${userFound.email}/${token}`,
        });

        const emailConfig = {
            to: user.email,
            subject: '[bestMovies] - Recuperar senha'
        };

        const emailData = {
            recoveryUrl,
        };

        email.sendMail(emailConfig, emailData, 'email-reset.html');
    }).catch(next);

    res.end();
}

function login(req, res, next) {
    const user = {
        email: req.body.email,
        password: req.body.password
    };

    function comparePassword(userFound) {
        return crypt.compare(user.password, userFound.password);
    }

    userValidation.validateRequired(user)
      .then(userRepository.findByEmail)
      .then(userValidation.validateToLogin)
      .then(comparePassword)
      .then(() => {
          res.header('authorization', jwt.createToken({ email: user.email }));
          res.end();
      })
      .catch(next);
}

// Validate fields
// Validate if user do not already exists
// Create password hash
// Insert user
// send response with token
// send welcome email
function register(req, res, next) {
    const user = req.body;

    function hashPassword() {
        return crypt.hash(user.password);
    }

    function setHashedPassword(hash) {
        user.password = hash;
        return q.resolve(user);
    }

    function sendWelcome() {
        const name = user.name || user.email;

        if (user.email) {
            const emailConfig = {
                to: user.email,
                subject: `[bestMovies] - Bem-vindo ${name}`
            };

            const emailData = { name };

            email.sendMail(emailConfig, emailData, 'welcome.html');
        }
    }

    userValidation.validateRequired(user)
      .then(userRepository.findByEmail)
      .then(userValidation.validateToInsert)
      .then(hashPassword)
      .then(setHashedPassword)
      .then(userRepository.insert)
      .then(() => {
          res.header('authorization', jwt.createToken({ email: user.email }));
          res.status(201).end();
          sendWelcome();
      })
      .catch(next);
}

// validate required fields
// check if it's a real user
// validate token
// hash new password
// update user
// send response
function reset(req, res, next) {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    function validateToken(userFound) {
        return jwt.validateToken(req, userFound.password);
    }

    function hashPassword() {
        return crypt.hash(user.password);
    }

    function updateUser(hashResult) {
        return userRepository.update({ email: user.email }, { password: hashResult });
    }

    userValidation.validateRequired(user)
      .then(userRepository.findByEmail)
      .then(userValidation.validateToLogin)
      .then(validateToken)
      .then(hashPassword)
      .then(updateUser)
      .then(() => {
          res.status(200).end();
      })
      .catch(next);
}

module.exports = {
    checkReset,
    forgot,
    login,
    register,
    reset,
};
