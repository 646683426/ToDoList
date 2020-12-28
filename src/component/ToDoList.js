import React from 'react';
import '../style/ToDoList.css';

class ToDo extends React.Component {

    render() {
        let toDo = this.props.toDo;
        toDo = toDo.map((item, index) => {
            return (
                <li
                    key={item.id} className='to-do'>
                    <input
                        className='check-box'
                        tindex={index}
                        type='checkbox'
                        onClick={(e) => { this.props.haveDone(e) }} />
                    <span
                        className='span'
                        onClick={(e) => { this.props.change(e) }}>
                        <p
                            index={index}>
                            {item.title}
                        </p>
                    </span>
                    <button
                        className='btn'
                        tindex={index}
                        onClick={(e) => { this.props.remove(e) }}>
                        -
                    </button>
                </li>
            )
        })
        return (
            <div className='do-content'>
                <h2>
                    {this.props.children}
                </h2>
                <ul>
                    {toDo}
                </ul>
            </div>
        )
    }
}

class Done extends React.Component {
    render() {
        let done = this.props.done
        done = done.map((item, index) => {
            return (
                <li key={item.id} className='done'>
                    <input
                        defaultChecked
                        className='check-box'
                        dindex={index}
                        type='checkbox'
                        onClick={(e) => { this.props.doing(e) }} />
                    <span
                        className='span'
                        onClick={(e) => { this.props.change(e) }}>
                        <p
                            index={index}>
                            {item.title}
                        </p>
                    </span>
                    <button
                        className='btn'
                        defaultChecked='true'
                        dindex={index}
                        onClick={(e) => { this.props.remove(e) }}>
                        -
                    </button>
                </li>
            )
        })
        return (
            <div className='done-content'>
                <h2>
                    {this.props.children}
                </h2>
                <ul>
                    {done}
                </ul>
            </div>
        )
    }
}

export default class ToDoList extends React.Component {

    state = {
        toDo: [],
        done: [],
    }

    componentDidMount() {
        this.setState({
            toDo: localStorage.getItem('toDo') !== null ? JSON.parse(localStorage.getItem('toDo')) : [],
            done: localStorage.getItem('done') !== null ? JSON.parse(localStorage.getItem('done')) : []
        })
    }

    render() {
        return (
            <div>
                <header>
                    <span className='title'>ToDoList</span>
                    <input
                        placeholder='输入内容并按下回车添加ToDo'
                        onKeyDown={(e) => { this.toDo(e) }} />
                </header>
                <main>
                    <ToDo
                        toDo={this.state.toDo}
                        remove={this.remove}
                        haveDone={this.haveDone}
                        change={this.change}>
                        <span>正在进行:</span>
                        <span className='to-do-count'>{this.state.toDo.length}</span>
                    </ToDo>
                    <Done
                        done={this.state.done}
                        remove={this.remove}
                        doing={this.doing}
                        change={this.doneChange}>
                        <span>已经完成:</span>
                        <span className='done-count'>{this.state.done.length}</span>
                    </Done>
                </main>
                <footer>
                    <button
                        className='clean'
                        onClick={this.clean}>
                        清除
                    </button>
                </footer>
            </div>
        )
    }

    setToDo = () => {
        localStorage.setItem('toDo', JSON.stringify(this.state.toDo))
    }

    setDone = () => {
        localStorage.setItem('done', JSON.stringify(this.state.done))
    }

    // 添加进行的任务
    toDo = (e) => {
        let id = Date.now();
        if (e.code === 'Enter') {
            if (e.target.value.length === 0) {
                alert('内容不能为空')
            } else {
                this.setState(
                    {
                        toDo: [{ id: id, title: e.target.value }, ...this.state.toDo]
                    },
                    () => {
                        this.setToDo()
                    }
                )
                e.target.value = '';
            }
        }
    }

    // 修改进行中的内容
    change = (e) => {
        const index = e.target.getAttribute('index');
        let list = this;
        let text = this.state.toDo[index].title;
        let id = this.state.toDo[index].id
        if (e.target && e.target.nodeName === 'P') {
            e.target.parentNode.innerHTML = "<input  value=" + text + " index=" + index + " id='input'/>";
        }
        const input = document.getElementById('input');
        input.focus();
        input.setSelectionRange(0, input.value.length);
        input.onblur = function () {
            if (input.value.length === 0) {
                input.parentNode.innerHTML = "<p index=" + index + " >" + text + "</p>";
                alert("内容不能为空");
            }
            else {
                list.state.toDo.splice([index], 1, { id: id, title: input.value })
                list.setState(
                    {
                        toDo: list.state.toDo
                    },
                    () => {
                        list.setToDo();
                    }
                )
                input.parentNode.innerHTML = "<p index=" + index + " >" + input.value + "</p>";
            }
        };
    }

    // 修改已完成的内容
    doneChange = (e) => {
        const index = e.target.getAttribute('index');
        let list = this;
        let text = this.state.done[index].title;
        let id = this.state.done[index].id
        if (e.target && e.target.nodeName === 'P') {
            e.target.parentNode.innerHTML = "<input  value=" + text + " index=" + index + " id='input'/>";
        }
        const input = document.getElementById('input');
        input.focus();
        input.setSelectionRange(0, input.value.length);
        input.onblur = function () {
            if (input.value.length === 0) {
                input.parentNode.innerHTML = "<p index=" + index + " >" + text + "</p>";
                alert("内容不能为空");
            }
            else {
                list.state.done.splice([index], 1, { id: id, title: input.value })
                list.setState(
                    {
                        done: list.state.done
                    },
                    () => {
                        list.setDone();
                    }
                )
                input.parentNode.innerHTML = "<p index=" + index + " >" + input.value + "</p>";
            }
        };
    }

    //从进行变成完成
    haveDone = (e) => {
        this.setState(
            {
                done: [{ id: this.state.done.length, title: e.target.parentNode.getElementsByTagName('span')[0].getElementsByTagName('p')[0].innerHTML }, ...this.state.done],
            },
            () => {
                this.setDone();
            }
        )
        this.remove(e);
    }

    // 从完成变成进行
    doing = (e) => {
        this.setState(
            {
                toDo: [{ id: this.state.done.length, title: e.target.parentNode.getElementsByTagName('span')[0].getElementsByTagName('p')[0].innerHTML }, ...this.state.toDo],
            },
            () => {
                this.setToDo();
            }
        )
        this.remove(e);
    }

    // 删除单个任务
    remove = (e) => {
        e.target.getAttribute('tindex') !== null ?
            this.setState(
                {
                    del: this.state.toDo.splice(e.target.getAttribute('tindex'), 1)
                },
                () => {
                    this.setToDo();
                }
            )
            : this.setState(
                {
                    del: this.state.done.splice(e.target.getAttribute('dindex'), 1)
                },
                () => {
                    this.setDone();
                }
            )
    }

    //清除所有任务
    clean = () => {
        localStorage.setItem('toDo', JSON.stringify([]));
        localStorage.setItem('done', JSON.stringify([]));
        this.setState({
            toDo: [],
            done: []
        })
    }
}