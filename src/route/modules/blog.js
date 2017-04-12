export function bind(route) {
  const Blog = global.models.Blog

  const createBlog = async (req, res, next) => {
    try {
      req.body.user = {
        id: req.user.id,
      }
      const blog = await new Blog(req.body).create()
      return res.status(201).send(blog)
    } catch (err) {
      return next(err)
    }
  }

  const getBlogs = async (req, res, next) => {
    try {
      const { page, pagesize } = req.query
      const blogs = await Blog.getBlogs(req.user.id, page, pagesize)
      return res.json(blogs)
    } catch (err) {
      return next(err)
    }
  }

  const getBlog = async (req, res, next) => {
    try {
      const { id } = req.params
      const blog = await new Blog({ id }).fill()
      return res.json(blog)
    } catch (err) {
      return next(err)
    }
  }

  const updateBlog = async (req, res, next) => {
    try {
      req.body.user = {
        id: req.user.id,
      }
      const blog = await new Blog(req.body).update()
      return res.json(blog)
    } catch (err) {
      return next(err)
    }
  }

  const deleteBlog = async (req, res, next) => {
    try {
      const { id } = req.params
      await new Blog({
        id,
        user: { id: req.user.id },
      }).delete()
      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  route.get('/blog/:id', getBlog)
  route.get('/blogs', getBlogs)
  route.post('/blogs', createBlog)
  route.put('/blog/:id', updateBlog)
  route.delete('/blog/:id', deleteBlog)
}
