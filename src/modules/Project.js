const Project = (name) => {
  const _id = crypto.randomUUID();
  let _name = name;
  let _list = [];

  const getId = () => _id;
  const getName = () => _name;
  const setName = (newName) => { _name = newName; };

  const getList = () => _list;

  const addTodo = (todo) => _list.push(todo);

  const deleteTodo = (id) => {
    const index = _list.findIndex(todo => todo.getId() === id);
    _list.splice(index, 1);
  };

  const getTodo = (id) => _list.find(todo => todo.getId() === id);

  return {
    getId,
    getName,
    setName,
    getList,
    addTodo,
    deleteTodo,
    getTodo,
  };
};

export { Project };