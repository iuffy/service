import client from './lib/client'

global.env = {}

describe('User', () => {
  it('register', (done) => {
    client()
      .post('/api/v0/signup')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'test@iuffy.com',
        password: '123456',
      })
      .expect(201)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('token')
        env.user = {
          id: res.body.id,
          token: res.body.token,
        }
        done()
      })
  })

  it('login', (done) => {
    client()
      .post('/api/v0/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'test@iuffy.com',
        password: '123456',
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('token')
        env.user.token = res.body.token
        done()
      })
  })

  it('change password', (done) => {
    client()
      .post('/api/v0/changepassword')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .send({
        password: '654321',
        oldPassword: '123456',
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        done()
      })
  })

  it('login by new password', (done) => {
    client()
      .post('/api/v0/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'test@iuffy.com',
        password: '654321',
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('token')
        env.user.token = res.body.token
        done()
      })
  })

  it('login by wrong password', (done) => {
    client()
      .post('/api/v0/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        email: 'test@iuffy.com',
        password: '6543211',
      })
      .expect(401)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('error')
        res.body.error.should.have.property('code').and.equal('InvalidIdentification')
        done()
      })
  })

  it('update user avatar and nickname', (done) => {
    client()
      .put('/api/v0/user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .send({
        avatar: 'user avatar',
        nickname: 'test user',
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        done()
      })
  })

  it('get user', (done) => {
    client()
      .get('/api/v0/user')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('email')
        res.body.should.have.property('avatar')
        res.body.should.have.property('nickname')
        done()
      })
  })
})
