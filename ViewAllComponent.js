import React from "react";
import { Redirect } from "react-router-dom";
import { showModal } from "./SmallModal";
import { academicScores_getAll, academicScores_delete } from "./server";
import { AdminAcademicScoresEdit } from "./AdminAcademicScoresEdit";
import FlashMessage from "./FlashMessage";
import { setFlashMessage } from "./FlashMessage";

class AdminAcademicScoresViewAll extends React.Component {
  state = {
    id: "",
    scores: [],
    editPage: false,
    loading: true,
    deleteHighlight: false,
    idToDelete: null,
    redirectedFromUpdate: false
  };

  getAll() {
    const myPromise = academicScores_getAll();
    myPromise.then(users => {
      this.setState({
        scores: users.data.items,
        loading: false
      });
    });
  }

  componentDidMount() {
    this.getAll();
  }

  editPage = userDataId => {
    this.setState({
      id: userDataId,
      editPage: true
    });
  };

  confirmDelete = userDataId => {
    this.setState({
      id: userDataId,
      deleteHighlight: true,
      idToDelete: userDataId
    });

    showModal({
      title: "Are you sure you want to delete?",
      body: "Click Ok to confirm!"
    }).then(
      () => {
        this.deleteScores(userDataId);
      },
      () => {
        this.setState({
          idToDelete: null
        });
      }
    );
  };

  deleteScores = userDataId => {
    const myPromise = academicScores_delete(userDataId);
    myPromise.then(e => {
      this.getAll();
    });
    return;
  };

  render() {
    if (this.state.editPage && this.state.id) {
      return <Redirect to={"/admin/academic-scores/" + this.state.id} />;
    }

    return (
      <React.Fragment>
        <FlashMessage />
        {this.state.loading && (
          <div>
            <i className="fa fa-spinner fa-spin" /> Loading...
          </div>
        )}
        <div className="row">
          <div className="col-md-6 form-group">
            {this.state.scores.map(score => (
              <div
                className="form-footer"
                key={score.id}
                style={
                  this.state.idToDelete === score.id && {
                    backgroundColor: "#F6BB42"
                  }
                }
              >
                <li>
                  ID: {score.id} <br />
                </li>
                <li>
                  USER: {score.userId} <br />
                </li>
                <li>
                  GPA: {score.gpa} <br />
                </li>
                <li>
                  SAT: {score.sat} <br />
                </li>
                <li>
                  ACT: {score.act} <br />
                </li>

                <button
                  className="btn btn-theme"
                  onClick={() =>
                    this.props.history.push(
                      "/admin/academic-scores/" + score.id
                    )
                  }
                >
                  EDIT
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => this.confirmDelete(score.id)}
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminAcademicScoresViewAll;
