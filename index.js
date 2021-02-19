import ReactDom from './react/react-dom';
import { Component } from './react/Component';

class ClassComponent extends Component {
    render() {
        return (
            <div>{props.name}</div>
        )
    }
}

function FunctionComponent(props) {
    return <div>{props.name}</div>
}

function FragmentComponent(props) {
    return (
        <>
            <li>1</li>
            <li>2</li>
        </>
    )
}

const jsx = (
    <section classNames="border">
        <h1>手写React</h1>
        <h1>react 源码</h1>
        <a href="www.baidu.com">百度一下</a>
        <ClassComponent name="react源码1" />
        <FunctionComponent name="react源码2" />
        <ul>
            <FragmentComponent />
        </ul>
    </section>
)

ReactDom.render(jsx, document.getElementById('root'));
