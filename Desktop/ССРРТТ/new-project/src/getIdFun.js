const getId = (() => {
  const listId = []
  return () => {
    let id = `m${(Math.random() ** 9).toString(26).slice(2)}${(Math.random() ** 9).toString(26).slice(2)}`;
    while ((listId.some((item) => item === id))) {
      id = `m${(Math.random() ** 9).toString(26).slice(2)}${(Math.random() ** 9).toString(26).slice(2)}`;
    }
    listId.push(id);
    return id;
  }
})();
export default getId;