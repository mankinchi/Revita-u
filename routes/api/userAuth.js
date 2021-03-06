const User = require("../../models/user");
const router = require('express').Router();
const passport = require('../../config/passport');

router.get('/user', (req, res, next) => {
  console.log(req.user)
  
  if (req.user) {
    return res.json({ user: req.user })
  } else {
    return res.json({ user: null })
  }
});

router.post('/signup', (req, res, next) => {
  const { firstName, lastName, username, password } = req.body;

  User.findOne({
    'username': username
  }, (err, userFind) => {
    if (userFind) {
      return res.json ({
        error: `User ${username} already exists`
      })
    }
    const newUser = new User({
      'username': username, 
      'password': password,
      'firstName': firstName,
      'lastName': lastName
    })
    newUser.save((err, savedUser) => {
      if (err) return res.json(err)
      return res.json(savedUser);
    })
  })
  
  if (req.user) {
    return res.json({ user: req.user })
  } else {
    return res.json({ user: null })
  }
});

router.post('/login', (req, res, next) => {
    console.log(req.body)
    next()
  },
  passport.authenticate('username'),
	(req, res) => {
    console.log('POST to /login')
    
		const user = JSON.parse(JSON.stringify(req.user)) // hack
		const cleanUser = Object.assign({}, user)
		if (cleanUser.local) {
			console.log(`Deleting ${cleanUser.local.password}`)
			delete cleanUser.local.password
		}
		res.json({ user: cleanUser })
	}
);

router.post('/logout', (req, res, next) => {
    if (req.user) {
      req.session.destroy()
      req.clearCookie('connect.sid')
      return res.json({ message: 'You are being logged out'})
    } else {
      return res.json({ message: 'no one to log out'})
    }
  }

);


module.exports = router
