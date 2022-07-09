import React, { Component } from "react";
import Iterator from "./iterator";
import "bootstrap/dist/css/bootstrap.css";
import "../../styles/mainEngine.css";

export default class MCQ extends Component {
  loadOptions = () => {
    let op = [];
    for (let i = 0; i < 4; i++)
      op.push(
        <div
          onClick={() => this.props.setAnswer(i)}
          className={
            "col col-5 option " +
            (String.fromCharCode(i + 65) === this.props.mcq["selected_index"]
              ? "option-disabled"
              : "")
          }
          key={i}
          id={"option-" + i}
          dangerouslySetInnerHTML={{
            __html: this.props.mcq.options[i],
          }}
        />,
      );
    return op;
  };

  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="mcq">
          <p style={{ marginLeft: 20 }}>
            {" "}
            {this.props.mcq["reported"] ? (
              <i
                style={{ color: "red" }}
                className="fa fa-exclamation-triangle"></i>
            ) : (
              ""
            )}{" "}
            {this.props.mcq["isMarked"] ? (
              <i style={{ color: "#2196F3" }} className="fa fa-bookmark"></i>
            ) : (
              ""
            )}{" "}
            Question No. {this.props.number}
          </p>
          {this.props.mcq.images.length>0 && (
            <div style={{display: "flex", padding: 20, justifyContent: "space-around"}}>
            {this.props.mcq.images.map(elem=><img style={{border: "1px solid black"}} height="150px" width="150px" src={"/images/"+elem} alt="Failed to load img" />)}
            </div>
          )}
          <div className="questionDiv">
            <div
              className="question"
              dangerouslySetInnerHTML={{ __html: this.props.mcq.question }}
            />
          </div>
          <div className="optionsDiv">
            <div className="container my-container">
              <div className="row my-row">{this.loadOptions()}</div>
            </div>
          </div>
          <Iterator
            isMarked={this.props.mcq["isMarked"]}
            nextClicked={() => this.props.nextClicked()}
            prevClicked={() => this.props.prevClicked()}
            setIsMarked={() => this.props.setIsMarked()}
            onSubmit={this.props.onSubmit}
            onReport={this.props.onReport}
            onClickQuestionsModal={this.props.onClickQuestionsModal}
          />
        </div>
      </div>
    );
  }
}
