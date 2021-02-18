import ReactDom from './react/react-dom';

const jsx = (
    <section classNames="border">
        <h1>手写React</h1>
        <h1>react 源码</h1>
        <a href="www.baidu.com">百度一下</a>
    </section>
)

ReactDom.render(jsx, document.getElementById('root'));
