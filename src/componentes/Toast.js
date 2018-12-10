import React, { Component } from 'react';
import '../css/toast.css';

export default class Toast extends Component {

    constructor() {
        super();
        this.state = { message: "" };
    }

    componentWillMount() {
        this.props.store.subscribe(() => {
            this.setState({message: this.props.store.getState().notificacao}) ;
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.state.message !== ""){
            this._show();
        }  
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