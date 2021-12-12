const { db } = require('../util/admin')

exports.getAllTodos = (req, res) => {
  db
    .collection('todos')
    .where('username', '==', req.user.username)
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let todos = []
      data.forEach(doc => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        })
      })
      return res.json(todos)
    }).catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

exports.postOneTodo = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ body: 'Must not be empty' })

  if (req.body.title.trim() === '')
    return res.this.status(400).json({ title: 'Must not be empty' })

  const newTodoItem = {
    username: req.user.username,
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().toISOString()
  }
  db
    .collection('todos')
    .add(newTodoItem)
    .then(doc => {
      const resTodoItem = newTodoItem
      resTodoItem.id = doc.id
      return res.json(resTodoItem)
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong' })
      console.error(err);
    })
}

exports.deleteTodo = (req, res) => {
  const document = db.doc(`/todos/${req.params.todoId}`)

  document
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: 'Todo Not Found!' })
      if (doc.data().username !== req.user.username)
        return res.status(403).json({ error: 'Unauthorized' })

      return document.delete()
    })
    .then(() => {
      res.json({ message: 'Delete Succesfull' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}

exports.editTodo = (req, res) => {
  if (req.body.todoId || req.body.createdAt)
    return res.status(403), json({ message: 'Not Allowed edit' })

  // bir başka şekilde sorgulama doc için
  let document = db.collection('todos').doc(`${req.params.todoId}`)

  document.update(req.body)
    .then(() => {
      return res.json({ message: 'Update Succesfull' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}