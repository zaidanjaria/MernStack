import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Exercise = (props) => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>
      <button className="btn btn-sm btn-success">
        <Link to={"/edit/" + props.exercise._id} style={{ color: "white" }}>
          Edit
        </Link>
      </button>{" "}
      |{" "}
      <button
        className="btn btn-sm btn-danger"
        onClick={() => {
          props.deleteExercise(props.exercise._id);
        }}
      >
        Delete
      </button>
    </td>
  </tr>
);

export default class ExercisesList extends Component {
  constructor(props) {
    super(props);
    this.state = { exercises: [], search: "" };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/exercises/")
      .then((response) => {
        this.setState({ exercises: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteExercise = (id) => {
    axios.delete("http://localhost:5000/exercises/" + id).then((response) => {
      console.log(response.data);
    });

    this.setState({
      exercises: this.state.exercises.filter((el) => el._id !== id),
    });
  };

  exerciseList() {
    return this.state.exercises.map((currentexercise) => {
      return (
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
      );
    });
  }

  onChangeSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };
  searchByName = () => {
    if (!this.state.search) {
      axios
        .get("http://localhost:5000/exercises/")
        .then((response) => {
          this.setState({ exercises: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get("http://localhost:5000/exercises/find/" + this.state.search)
        .then((response) => {
          this.setState({ exercises: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  render() {
    return (
      <div>
        <h3>
          <i>Logged Exercises </i>
        </h3>
        <div>
          <div className="form-row">
            <div className="col">
              <input
                placeholder="Search by Username"
                type="text"
                className="form-control"
                value={this.state.search}
                onChange={this.onChangeSearch}
              />
            </div>
            <div className="col">
              <button
                className="btn btn-primary ml-3"
                onClick={this.searchByName}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <table className="table mt-3">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.exerciseList()}</tbody>
        </table>
      </div>
    );
  }
}
