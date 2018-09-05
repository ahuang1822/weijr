import React, { Component } from "react";
import "./App.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import GeneralChat from "./GeneralChat/index";
import NavBar from "./NavBar";
import HomeButton from "./HomeButton";
import {
  Icon,
  Segment,
  Grid,
  Button,
  Card,
  Label,
  Message
} from "semantic-ui-react";

import Wager from "../ether/wagers";
import web3 from "../ether/web3";

class SingleWagerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      address: this.props.match.params.address,
      minimumBet: "",
      pot: "",
      totalUsers: "",
      sideOne: "",
      sideTwo: "",
      manager: "",
      loading: false,
      leftSide: "",
      rightSide: "",
      title: "",
      accounts: [],
      description: "",
      errorMessage: "",
      error: ""
    };
    this.goHome = this.goHome.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.betSide = this.betSide.bind(this);
    this.paySide = this.paySide.bind(this);
  }

  async componentDidMount() {
    try {
      const accounts = await web3.eth.getAccounts();
      const wager = Wager(this.props.match.params.address);
      const summary = await wager.methods.getWagerSummary().call();
      const left = summary[6].split(" vs. ")[0];
      const right = summary[6].split(" vs. ")[1];

      this.setState({
        minimumBet: summary[0],
        pot: summary[1],
        totalUsers: summary[2],
        sideOne: summary[3],
        sideTwo: summary[4],
        manager: summary[5],
        leftSide: left,
        rightSide: right,
        title: summary[6],
        accounts: accounts,
        description: summary[8],
        error: "error"
      });
    } catch (err) {
      console.error(err);
    }
  }

  goHome = event => {
    event.preventDefault();
    this.props.history.push("/wagers");
  };

  renderLoader = loading => {
    return (
      <div id={loading} className="ui active dimmer">
        <div className="ui large text loader">
          <p className="loading-text">
            This Honestly Takes A Long Time! Be Patient! Do Not Leave The Page!
          </p>
        </div>
      </div>
    );
  };

  renderCards = () => {
    const items = [
      {
        header: `The Current Pot is ${web3.utils.fromWei(
          this.state.pot,
          "ether"
        )} ether!`,
        meta: this.state.title,
        description: `There are ${
          this.state.totalUsers
        } people involved in this Weijr! Place Your Bets Below!`
      }
    ];
    return <Card.Group items={items} />;
  };

  renderBetButtons = () => {
    return (
      <div>
        <Button as="div" labelPosition="right">
          <Button
            color="red"
            value={this.state.sideOne}
            onClick={event => this.betSide(event, true)}
          >
            <Icon name="ethereum" />
            {this.state.leftSide}
          </Button>
          <Label as="a" basic color="red" pointing="left">
            {this.state.sideOne} Bets Placed
          </Label>
        </Button>
        <Button as="div" labelPosition="right">
          <Button
            color="blue"
            value={this.state.sideTwo}
            onClick={event => this.betSide(event, false)}
          >
            <Icon name="ethereum" />
            {this.state.rightSide}
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {this.state.sideTwo} Bets Placed
          </Label>
        </Button>
      </div>
    );
  };

  renderPayoutButton = () => {
    if (this.state.accounts.includes(this.state.manager)) {
      return (
        <div>
          <Button onClick={event => this.paySide(event, true)}>
            {this.state.leftSide} Won!
          </Button>
          <Button onClick={event => this.paySide(event, false)}>
            {this.state.rightSide} Won!
          </Button>
        </div>
      );
    }
  };

  async paySide(event, bool) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const manager = await wager.methods.manager().call();

    if (accounts[0] !== this.state.manager) {
      this.setState({
        errorMessage: "You're Not The Manager Of This Weijr!",
        error: ""
      });
    } else {
      const wager = Wager(this.props.match.params.address);

      this.setState({ loading: true, errorMessage: "" });
      try {
        await wager.methods.payout(bool).send({
          from: manager
        });
        this.setState({ error: "" });
      } catch (err) {
        this.setState({
          errorMessage: "You're Not The Manager Of This Weijr!",
          error: ""
        });
      }
      this.props.history.push("/wagers");
    }
    this.setState({ loading: false });
  }

  async betSide(event, bool) {
    event.preventDefault();
    const wager = Wager(this.props.match.params.address);
    const accounts = await web3.eth.getAccounts();
    const summaryCheck = await wager.methods.getWagerSummary().call();
    const arrayOfParticipants = summaryCheck[9];
    const check = arrayOfParticipants.includes(accounts[0]);
    if (check || accounts[0] === summaryCheck[5]) {
      this.setState({
        errorMessage:
          "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! You Might Even Be The Manager Of This Weijr! No Cheating!",
        error: ""
      });
    } else {
      this.setState({ loading: true, errorMessage: "" });
      try {
        await wager.methods.joinBet(bool).send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.minimumBet, "ether")
        });
        const summary = await wager.methods.getWagerSummary().call();
        this.setState({
          pot: summary[1],
          totalUsers: summary[2],
          sideOne: summary[3],
          sideTwo: summary[4],
          error: "error"
        });
      } catch (err) {
        this.setState({
          errorMessage:
            "You Either Don't Have Enough Ether Or You May Have Already Bet In This Weijr! No Cheating!",
          error: ""
        });
      }
    }
    this.setState({ loading: false });
  }

  render() {
    let loading = this.state.loading ? "loading" : "loading-false";
    const title = this.state.leftSide + " vs. " + this.state.rightSide;

    if (this.props.currentUser) {
      return this.state.manager === "" ? null : (
        <div>
          {this.renderLoader(loading)}
          <Segment inverted textAlign="center">
            <NavBar message={title} />
            <HomeButton goHome={this.goHome} />
          </Segment>
          <div className="borderFix">
            <Grid columns={2}>
              <Grid.Column width={9}>
                <GeneralChat wager={this.state.title} chatType="wager" />
              </Grid.Column>
              <Grid.Column width={7} className="ui centered grid">
                <Grid.Row>
                  <div>{this.renderCards()}</div>
                </Grid.Row>
                <Grid.Row>
                  <div>{this.renderBetButtons()}</div>
                </Grid.Row>
                <div className="ui raised segment">
                  <p>{this.state.description}</p>
                </div>
                {this.renderPayoutButton()}
                <Message
                  id={`${this.state.error}`}
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      );
    } else {
      this.props.history.push("/");
      return null;
    }
  }
}

const mapStateToProps = function(state, ownProps) {
  return {
    currentUser: state.user
  };
};

export default withRouter(connect(mapStateToProps, null)(SingleWagerView));
