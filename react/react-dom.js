// vnode 虚拟dom节点
// node dom节点
function render(vnode, container) {
    console.log("vnode", vnode);

    // step1 vnode-node
    const node = createNode(vnode);
    // step2 append dom
    container.appendChild(node);
}

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number';
}

// 虚拟dom节点生成真实dom节点
function createNode(vnode) {
    let node;
    const { type } = vnode;

    if (typeof type === 'string') {
        // 原生标签节点
        node = updateHostComponent(vnode);
    } else if (isStringOrNumber(sth)) {
        // 文本标签节点
        node = updateTextComponent(vnode);
    } else if (typeof type === 'function') {
        // 函数组件
        node = type.prototype.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode);
    }

    return node;
}

// 给node添加属性
function updateNode(node, nextVal) {
    Object.keys(nextVal).filter(k => k !== "children")
    .forEach(k => {
        node[k] = nextVal[k];
    })
}

// 生成原生标签节点
function updateHostComponent(vnode) {
    const { type, props } = vnode;
    const node = document.createElement(type);
    updateNode(node, props);
    reconcileChildren(node, props.children);
    return node;
}

// 生成文本节点
function updateTextComponent(vnode) {
    const node = document.createTextNode(vnode);
    return node;
}

// 返回node节点
function updateFunctionComponent(vnode) {
    const { type, props } = vnode;
    const child = type(props);
    // vnode -> node
    const node = createNode(child);

    return node;
}

// 类组件，返回node节点
function updateClassComponent(vnode) {
    const { type, props } = vnode;
    const instance = new type(props);
    const child = instance.render();
    // vnode -> node
    const node = createNode(child);

    return node;
}

function reconcileChildren(parentNode, children) {
    const newChildren = Array.isArray(children) ? children : [children];

    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        render(child, parentNode);
    }
}

export default { render };
