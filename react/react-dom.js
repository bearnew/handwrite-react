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
    }

    return node;
}

// 生成原生标签节点
function updateHostComponent(vnode) {
    const { type, props } = vnode;
    const node = document.createElement(type);
    reconcileChildren(node, props.children);
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
