import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MessageList from "./MessageList";
import NewMessageEntry from "./NewMessageEntry";


class GeneralChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      wager: this.props.wager,
      chatType: this.props.chatType,
      userName: '',
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick = () => {
    this.props.history.push('/')
  }

  render() {
    return (
      <div>
        <MessageList wager={this.state.wager} chatType={this.state.chatType} userName={this.state.userName} recipientName={this.props.recipientName}/>
        <NewMessageEntry wager={this.state.wager} chatType={this.state.chatType} userName={this.state.userName} recipientName={this.props.recipientName}/>
      </div>
    );
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    recipientName: state.DirectChat
  };
};

export default withRouter(connect(mapStateToProps, null)(GeneralChat));
