exports.getAllTodos = (req, res) => {
  todos = [
    {
      'id': '1',
      'title': 'greeting',
      'body': 'Hello world from ByS'
    },
    {
      'id': '2',
      'title': 'greeting2',
      'body': 'Hello2 world2 from ByS'
    }
  ]


  return res.json(todos)
}