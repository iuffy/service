import client from './lib/client'

describe('Blog', () => {
  it('Add blog', (done) => {
    client()
      .post('/api/v0/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .send({
        title: 'hello',
        content: 'my first blog',
      })
      .expect(201)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('title')
        res.body.should.have.property('content')
        env.blog = res.body
        done()
      })
  })

  it('Update blog', (done) => {
    client()
      .put(`/api/v0/blog/${env.blog.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .send({
        id: env.blog.id,
        title: 'Hello',
        content: 'My updated blog content',
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('title')
        res.body.should.have.property('content')
        done()
      })
  })

  it('Get blog', (done) => {
    client()
      .get(`/api/v0/blog/${env.blog.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('id')
        res.body.should.have.property('title')
        res.body.should.have.property('content')
        res.body.should.have.property('created')
        done()
      })
  })

  it('Get blogs list', (done) => {
    client()
      .get('/api/v0/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('total').and.equal(1)
        res.body.should.have.property('items').and.instanceOf(Array).with.lengthOf(1)
        for (const i of res.body.items) {
          i.should.have.property('id')
        }
        done()
      })
  })

  it('Remove blog', (done) => {
    client()
      .del(`/api/v0/blog/${env.blog.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .expect(204)
      .end((err) => {
        should.not.exist(err)
        done()
      })
  })

  it('Get blogs list', (done) => {
    client()
      .get('/api/v0/blogs')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('X-Auth-Key', env.user.token)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.have.property('total').and.equal(0)
        res.body.should.not.have.property('items')
        done()
      })
  })

})
