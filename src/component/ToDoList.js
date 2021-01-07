import React from 'react';
import '../style/ToDoList.css';

class List extends React.Component {
    render() {
        let { list, changeState, onBlur, onClick, remove, state, liClass, divClass,defaultChecked } = this.props;
        list = list.map((item, index) => {
            return (
                <li
                    key={item.id} className={liClass}>
                    <input
                        className='check-box'
                        index={state + index}
                        type='checkbox'
                        state={state}
                        defaultChecked={defaultChecked}
                        onClick={(e) => { changeState(e, state) }} />
                    <span
                        className='span'>
                        {item.isClick ?
                            <input
                                index={state + index}
                                id='input'
                                defaultValue={item.title}
                                autoFocus
                                onBlur={(e) => { onBlur(e, state) }}
                            />
                            :
                            <p
                                onClick={(e) => { onClick(e, state) }}
                                index={state + index}>
                                {item.title}
                            </p>
                        }
                    </span>
                    <button
                        className='btn'
                        index={state + index}
                        state={state}
                        onClick={(e) => { remove(e, state) }}>
                        -
                    </button>
                </li>
            )
        })
        return (
            <div className={divClass}>
                <h2>
                    {this.props.children}
                </h2>
                <ul>
                    {list}
                </ul>
            </div>
        )
    }
}

export default class ToDoList extends React.Component {

    state = {
        toDo: [],
        done: []
    }

    componentDidMount() {
        //在缓存中获取任务
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
                    <List
                        list={this.state.toDo}
                        remove={this.remove}
                        changeState={this.changeState}
                        state={'toDo'}
                        liClass={'to-do'}
                        divClass={'do-content'}
                        onBlur={this.changeDone}
                        onClick={this.change}>
                        <span>正在进行:</span>
                        <span className='to-do-count'>{this.state.toDo.length}</span>
                    </List>
                    <List
                        list={this.state.done}
                        remove={this.remove}
                        changeState={this.changeState}
                        state={'done'}
                        liClass={'done'}
                        divClass={'done-content'}
                        defaultChecked={'true'}
                        onBlur={this.changeDone}
                        onClick={this.change}>
                        <span>已经完成:</span>
                        <span className='done-count'>{this.state.done.length}</span>
                    </List>
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

    //向浏览器缓存添加任务
    setToDo = () => {
        localStorage.setItem('toDo', JSON.stringify(this.state.toDo))
    }

    setDone = () => {
        localStorage.setItem('done', JSON.stringify(this.state.done))
    }

    // 按下回车后，添加进行任务
    toDo = (e) => {
        let id = Date.now();
        if (e.code === 'Enter') {
            if (e.target.value.length === 0) {
                alert('内容不能为空')
            } else {
                this.setState(
                    {
                        toDo: [{ id: id, title: e.target.value, isClick: false }, ...this.state.toDo]
                    },
                    () => {
                        this.setToDo()
                    }
                )
                e.target.value = '';
            }
        }
    }

    // 点击进行修改
    change = (e, state) => {
        let index = e.target.getAttribute('index').slice(4);
        if (state === 'toDo') {
            let toDo = this.state.toDo;
            toDo[index].isClick = !toDo[index].isClick;
            this.setState({
                toDo: toDo
            })
        } else {
            let done = this.state.done;
            done[index].isClick = !done[index].isClick;
            this.setState({
                done: done
            })
        }
    }

    //完成修改
    changeDone = (e, state) => {
        let index = e.target.getAttribute('index').slice(4);
        let list;
        if (state === 'toDo') {
            list = this.state.toDo
        } else {
            list = this.state.done
        }
        let isClick = list[index].isClick;
        let id = list[index].id;
        let text;
        if (e.target.value.length === 0) {
            text = list[index].title;
            alert('内容不能为空')
            list.splice([index], 1, { id: id, title: text, isClick: !isClick })
            list === this.state.toDo ?
                this.setState({
                    toDo: list
                }) :
                this.setState({
                    done: list
                })
        } else {
            text = e.target.value;
            list.splice([index], 1, { id: id, title: text, isClick: !isClick })
            list === this.state.toDo ?
                this.setState(
                    {
                        toDo: list
                    },
                    () => {
                        this.setToDo();
                    }
                ) :
                this.setState(
                    {
                        done: list
                    },
                    () => {
                        this.setDone();
                    }
                )
        }
    }

    //更改任务完成状态
    changeState = (e, state) => {
        let id = Date.now();
        if (state === 'toDo') {
            this.setState(
                {
                    done: [{ id: id, title: e.target.parentNode.getElementsByTagName('span')[0].getElementsByTagName('p')[0].innerHTML }, ...this.state.done],
                },
                () => {
                    this.setDone();
                }
            )
            this.remove(e, state);
        } else {
            this.setState(
                {
                    toDo: [{ id: id, title: e.target.parentNode.getElementsByTagName('span')[0].getElementsByTagName('p')[0].innerHTML }, ...this.state.toDo],
                },
                () => {
                    this.setToDo();
                }
            )
            this.remove(e, state);
        }
    }

    // 删除单个任务
    remove = (e, state) => {
        let index = e.target.getAttribute('index').slice(4);
        state === 'toDo' ?
            this.setState(
                {
                    del: this.state.toDo.splice(index, 1)
                },
                () => {
                    this.setToDo();
                }
            )
            : this.setState(
                {
                    del: this.state.done.splice(index, 1)
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