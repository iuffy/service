import client from './lib/client'

describe('Test', () => {
  it('hello', (done) => {
    client()
      .get('/api/v0/test')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err) => {
        should.not.exist(err)
        done()
      })
  })
})
