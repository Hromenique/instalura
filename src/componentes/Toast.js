import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import { MESSAGE_EVENT } from './Eventos';
import '../css/toast.css';

export default class Toast extends Component {

    constructor() {
        super();
        this.state = { message: "" };
    }

    componentWillMount() {
        PubSub.subscribe(MESSAGE_EVENT, (topico, message) => {
            this.setState({ message: message })
            this._show();
        });
    }

    _show() {
        this.toastDiv.className = this.toastDiv.className +  " show";
        setTimeout(() => this.toastDiv.className = this.toastDiv.className.replace("show", ""), 3000);
    }

    render() {
        return (
            <div className="toast" ref={div => this.toastDiv = div}>{this.state.message}</div>
        );
    }

}