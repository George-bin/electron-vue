// 递归设置树节点
export function recursionSetTreeNode (data) {
  function toParse (arr) {
    arr.forEach(item => {
      item.show = false
      item.isActive = false
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(data)
}

// 递归显示/隐藏对应节点（设置选中节点）
export function recursionShowNode (tree, data) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (data._id === item._id) {
        arr.splice(index, 1, {
          ...item,
          show: !item.show,
          isActive: true
        })
      } else {
        item.isActive = false
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}

// 递归插入对应节点
export function recursionInsertNode (tree, node) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (node.PARENT_CODE === item._id) {
        item.children.push(node)
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}

// 递归删除对应节点
export function recursionDeleteNotebook (tree, _id) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (_id === item._id) {
        arr.splice(index, 1)
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}

// 递归更新笔记本中的笔记数量
export function recursionUpdateNoteNum (tree, notebookId, type) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (notebookId === item._id) {
        if (type === 'addNote') {
          item.total += 1
        } else {
          item.total -= 1
        }
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}

// 递归更新笔记本
export function recursionUpdateNoteBook (tree, notebook) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (notebook._id === item._id) {
        item.name = notebook.name
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}
