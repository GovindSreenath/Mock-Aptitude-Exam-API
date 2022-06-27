import React, { Component } from "react";
import NavBar from "./navBar";
import MCQ from "./mcq";
// import Footer from "./footer";
import QuestionModal from "./questionsModal";

let myInterval;

class MainEngine extends Component {
  state = {
    index: 0,
    minutes: 180,
    seconds: 0,
    absTime: 0,
    questionsModal: 0,
  };

  componentWillUnmount() {
    clearInterval(myInterval);
  }

  componentDidMount() {
    myInterval = setInterval(() => {
      if (this.state.seconds === 0) {
        if (this.state.minutes === 0) {
          clearInterval(myInterval);
          this.onSubmit();
        } else {
          this.setState({ seconds: 59, minutes: this.state.minutes - 1 });
        }
      } else if (this.state.seconds > 0) {
        this.setState({ seconds: this.state.seconds - 1 });
      }

      this.setState({ absTime: this.state.absTime + 1 });
    }, 1000);

    // const found = localStorage.getItem("exam-state");
    // if (!found) {
    //   // console.log("fetched waale use kiye");
    // } else {
    //   this.setState(JSON.parse(found));
    //   // console.log("local waale use kiye");
    // }
  }

  // componentDidUpdate() {
  //   localStorage.setItem(
  //     "exam-state",
  //     JSON.stringify({ ...this.state, mcqs: [] }),
  //   );
  // }

  nextClicked = () => {
    if (this.state.index < this.props.mcqs.length - 1)
      this.setState({ index: this.state.index + 1 });
  };

  prevClicked = () => {
    if (this.state.index !== 0) this.setState({ index: this.state.index - 1 });
  };

  setAnswer = (id) => {
    let copy = this.props.mcqs;
    copy[this.state.index]["selected_index"] = String.fromCharCode(
      parseInt(id) + 65
    );
    this.props.setMcqs(copy);
  };

  onSubmit = () => {
    this.props.setState({
      mcqs: this.props.mcqs,
      inExam: 0,
      inResult: 1,
      absTime: this.state.absTime,
    });
  };

  onReport = (reported) => {
    let copy = this.props.mcqs;
    copy[this.state.index]["reported"] = reported;
    this.props.setMcqs(copy);
  };

  onClickQuestionsModal = () => {
    this.setState({ questionsModal: !this.state.questionsModal });
  };

  goToQuestion = (index) => {
    this.setState({ index, questionsModal: 0 });
  };

  setIsMarked = () => {
    let copy = this.props.mcqs;
    copy[this.state.index]["isMarked"] = !copy[this.state.index]["isMarked"];
    this.props.setMcqs(copy);
  };

  render() {
    return (
      <div style={{ height: "100vh" }}>
        {!this.state.submit && (
          <>
            <NavBar
              minutes={this.state.minutes}
              seconds={this.state.seconds}
              id={this.props.id}
            />

            {this.state.questionsModal ? (
              <QuestionModal
                mcqs={this.props.mcqs}
                onClickQuestionsModal={this.onClickQuestionsModal}
                goToQuestion={this.goToQuestion}
              />
            ) : (
              ""
            )}

            <MCQ
              mcq={this.props.mcqs[this.state.index]}
              number={this.state.index + 1}
              nextClicked={this.nextClicked}
              prevClicked={this.prevClicked}
              setIsMarked={this.setIsMarked}
              setAnswer={this.setAnswer}
              onSubmit={this.onSubmit}
              onReport={this.onReport}
              onClickQuestionsModal={this.onClickQuestionsModal}
            />
            {/* <Footer
              onSubmit={this.onSubmit}
              onReport={this.onReport}
              mcq={this.state.mcqs[this.state.index]}
              onClickQuestionsModal={this.onClickQuestionsModal}
            /> */}
          </>
        )}
      </div>
    );
  }
}

export default MainEngine;
