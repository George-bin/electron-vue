// 递归设置树节点
export function recursionSetTreeNode (data) {
  function toParse (arr) {
    arr.forEach(item => {
      if (item.flag === 'notebook') {
        item.show = false
        item.label = item.notebookName
        item.rightKeyMenu = false
        item.isActive = false
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(data)
}

// 恢复默认
export function recoverSetTreeNode (data) {
  function toParse (arr) {
    arr.forEach(item => {
      if (item.flag === 'notebook') {
        item.rightKeyMenu = false
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(data)
}

// 递归设置右键菜单的节点
export function recursionSetRightKeyMenuNode (tree, data) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (item.flag === 'notebook' && data._id === item._id) {
        arr.splice(index, 1, {
          ...item,
          rightKeyMenu: true,
          isActive: true
        })
      } else {
        item.rightKeyMenu = false
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

// 递归显示/隐藏对应节点（设置选中节点）
export function recursionShowNode (tree, data) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (item.flag === 'notebook' && data._id === item._id) {
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
      if (item.flag === 'notebook' && node.PARENT_CODE === item.notebookCode) {
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
      if (item.flag === 'notebook' && _id === item._id) {
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
export function recursionUpdateNoteNum (tree, notebookCode, type) {
  function toParse (arr) {
    arr.forEach((item, index) => {
      if (item.flag === 'notebook' && notebookCode === item.notebookCode) {
        if (type === 'addNote') {
          item.noteNum += 1
        } else {
          item.noteNum -= 1
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
      if (item.flag === 'notebook' && notebook.notebookCode === item.notebookCode) {
        item.label = notebook.notebookName
      }
      if (item.children && item.children.length) {
        toParse(item.children)
      }
    })
    return arr
  }
  return toParse(tree)
}
