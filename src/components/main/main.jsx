import React, { Component } from "react";
import NavBar from "./navBar";
import Login from "./login";
import SelectTopic from "./select_topic";
import MCQEngine from "../exam/main";
import Result from "../results/main";

import "bootstrap/dist/css/bootstrap.css";
import "../../styles/index.css";
import axios from "axios";

export default class Main extends Component {
  state = {
    inExam: 0,
    inResult: 0,
    loggedIn: 0,
    fetchError: 0,
    absTime: 0,
    totalMarks: 0,
    id: 0,
    whichExam: "",
    mcqs: [],
  };

  calcResult = (mcqs) => {
    let res = 0;

    mcqs.forEach((val, idx) => {
      if (val["selected_index"]) {
        console.log(idx,
          "Answer:",
          val["answer"],
          "   Selected:",
          val["selected_index"],
          "    Result:",
          res
        );
        if (val["answer"] === val["selected_index"]) {
          res += 4;
        } else {
          res--;
        }
      }
    });

    return res;
  };

  onSubmit = async (id, pass) => {
    try {
      let res = await axios({
        method: "post",
        url: "/api/credentials",
        data: {
          id,
          pass,
        },
      });

      if (res.data.status === "success") {
        this.setState({ loggedIn: 1, id });
      } else {
        this.setState({ fetchError: 1 });
      }
    } catch (err) {
      console.error(err);
      this.setState({ fetchError: 1 });
    }
  };

  selectedTopic = async (id, limit) => {
    try {
      let res = await axios.get(`/api/apti`);

      this.setState({ mcqs: res.data.mcq, inExam: 1, whichExam: id });
    } catch (err) {
      console.error(err);
    }
  };

  setMcqs = (mcqs) => {
    this.setState({ mcqs });
  };

  handleSetState = async (data) => {
    // const db = firebase.firestore();
    // await db
    //   .collection(this.state.whichExam)
    //   .doc(this.state.id)
    //   .set(
    //     {
    //       score: this.calcResult(data.mcqs),
    //       time: data.absTime,
    //     },
    //     { merge: true }
    //   );

    this.setState(data);

    fetch(
      `/api/saveResult?id=${
        this.state.id
      }&result=${this.calcResult(data.mcqs)}`,
      {
        method: "POST",
        headers: {
          accepts: "application/json",
        },
      },
    )
      .then(res => res.json())
      .then(json => {
        if (json.msg === "success") this.setState(data);
        else {
          console.log("error while saving result");
        }
      });
  };

  logout = () => {
    // localStorage.clear();
    this.setState({
      loggedIn: 0,
      inExam: 0,
      inResult: 0,
      id: 0,
      fetchError: 0,
    });
  };

  render() {
    let navOptions = [];

    if (this.state.loggedIn) {
      navOptions = [
        { id: this.state.id },
        { title: "Logout", func: this.logout },
      ];
    }

    return (
      <div>
        {this.state.inExam ? (
          <MCQEngine
            mcqs={this.state.mcqs}
            id={this.state.id}
            state={this.state}
            setState={this.handleSetState}
            setMcqs={this.setMcqs}
          />
        ) : (
          <>
            <NavBar options={navOptions} />
            {this.state.inResult ? (
              <Result
                mcqs={this.state.mcqs}
                result={this.calcResult(this.state.mcqs)}
                logout={this.logout}
              />
            ) : (
              <>
                {this.state.loggedIn ? (
                  <SelectTopic selectedTopic={this.selectedTopic} />
                ) : (
                  <Login
                    onSubmit={this.onSubmit}
                    fetchError={this.state.fetchError}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
