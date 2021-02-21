// fiber根节点
let wipRoot = null;
function render(vnode, container) {
    wipRoot = {
        type: 'div',
        children: {...vnode},
        stateNode: container
    }

    nextUnitOfWork = wipRoot;
}

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number';
}

// 给原生标签创建node节点
function createNode(workInProgress) {
    const { type, props } = workInProgress;
    let node = document.createElement(type);
    updateNode(node, props);

    return node;
}

// 给node添加属性, className, id, href, style, 合成事件
function updateNode(node, nextVal) {
    Object.keys(nextVal)
    .forEach(k => {
        if (k === "children") {
            if (isStringOrNumber(nextVal[k])) {
                node.textContent = nextVal[k] + "";
            }
        } else {
            node[k] = nextVal[k];
        }
    })
}

// 生成原生标签节点
function updateHostComponent(workInProgress) {
    if (!workInProgress.stateNode) {
        // 创建dom节点
        workInProgress.stateNode = createNode(workInProgress);
    }

    // 协调子节点
    reconcileChildren(workInProgress, workInProgress.props.children);
}

// 函数组件
// 拿到子节点，协调
function updateFunctionComponent(workInProgress) {
    const { type, props } = workInProgress;
    const child = type(props);

    reconcileChildren(workInProgress, child);
}

function updateClassComponent(workInProgress) {
    const { type, props } = workInProgress;
    const instance = new type(props);
    const child = instance.render();

    reconcileChildren(workInProgress, child);
}

function updateFragmentComponent(workInProgress) {
    reconcileChildren(workInProgress, workInProgress.props.children);
}

function reconcileChildren(workInProgress, children) {
    if (isStringOrNumber(children)) {
        return;
    }

    const newChildren = Array.isArray(children) ? children : [children];

    let previousNewFiber = null;
    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        let newFiber = {
            type: child.type,
            props: {...child.props},
            child: null,
            sibling: null,
            return: workInProgress,
            stateNode: null,
        }

        if (i === 0) {
            // newFiber是workInProgress的第一个子fiber
            workInProgress.child = newFiber;
        } else {
            previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
    }
}

// 下一个需要渲染更新的任务 fiber
let nextUnitOfWork = null;

function performUnitOfWork(workInProgress) {
    const { type } = workInProgress;
    // step1: 渲染更新fiber
    if (typeof type === 'string') {
        // 原生标签节点
        updateHostComponent(workInProgress);
    } else if (typeof type === 'function') {
        type.prototype.isReactComponent
            ? updateClassComponent(workInProgress)
            : updateFunctionComponent(workInProgress);
    } else {
        updateFragmentComponent(workInProgress);
    }

    // step2: 并且返回下一个
    if (workInProgress.child) {
        // 有长子，传给第一个子节点
        return workInProgress.child;
    }
    let nextFiber = workInProgress;

    while(nextFiber) {
        if (nextFiber.sibling) {
            // 有兄弟节点，传给兄弟节点
            return nextFiber.sibling;
        }
        // 没有兄弟节点，返回父节点继续查找，父节点继续查找兄弟节点
        nextFiber = nextFiber.return;
    }
}

function workLoop(IdleDeadline) {
    while(nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        // 渲染更新fiber, 并且返回下一个
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    // commit
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
}

function commitRoot() {
    commitWorker(wipRoot.child);
    wipRoot = null;
}

function commitWorker(workInProgress) {
    if (!workInProgress) {
        return;
    }
    // step1 渲染更新自己
    // vnode->node，node更新到container
    let parentNodeFiber = workInProgress.return;
    // fiber节点不一定有dom节点，如fragment consumer
    while(!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return;
    }
    let parentNode = parentNodeFiber.stateNode;
    if (workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode);
    }
    // step2 渲染更新子节点
    commitWorker(workInProgress.child);
    // step3 渲染更新兄弟节点
    commitWorker(workInProgress.sibling);
}

// 将在浏览器的空闲时段内调用的函数排队, 不会影响延迟关键事件，如动画和输入响应
// 函数一般会按先进先调用的顺序执行
// 然而，如果回调函数指定了执行超时时间timeout，则有可能为了在超时前执行函数而打乱执行顺序
requestIdleCallback(workLoop);


export default { render };

