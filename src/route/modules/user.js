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
      const { id } = req.params
      const user = await new User({ id }).fill()
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  const updateUser = async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await new User({ id }).update()
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  exempt('/signup')
  exempt('/login')

  route.post('/signup', signup) // 注册
  route.post('/login', login) // 登录
  route.post('/changepassword', changePassword) // 修改密码
  route.get('/user/:id', getUser)
  route.put('/user/:id', updateUser)
}
