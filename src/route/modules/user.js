import { generateToken } from '../../authorization'

export function bind(route, exempt) {
  const User = global.models.User

  const signup = async (req, res, next) => {
    const { email, password } = req.body
    try {
      const user = await new User({ email }).create(password)
      user.token = generateToken(user.id)
      return res.status(201).send(user)
    } catch (err) {
      return next(err)
    }
  }

  const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
      const user = await new User({ email }).login(password)
      user.token = generateToken(user.id)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  const changePassword = async (req, res, next) => {
    const { id } = req.user
    const { password, oldPassword } = req.body
    try {
      const user = await new User({ id }).changePassword(password, oldPassword)
      user.token = generateToken(user.id)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  const getUser = async (req, res, next) => {
    try {
      const { id } = req.user
      const user = await new User({ id }).fill()
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  const updateUser = async (req, res, next) => {
    try {
      const { id } = req.user
      req.body.id = id
      const user = await new User(req.body).update()
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  exempt('/signup')
  exempt('/login')

  route.post('/signup', signup)
  route.post('/login', login)
  route.post('/changepassword', changePassword)
  route.get('/user', getUser)
  route.put('/user', updateUser)
}
