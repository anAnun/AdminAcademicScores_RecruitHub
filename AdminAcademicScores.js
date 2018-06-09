import React from "react";
import { Route } from "react-router";
import AdminAcademicScoresViewAll from "./AdminAcademicScoresViewAll";
import AdminAcademicScoresEdit from "./AdminAcademicScoresEdit";

class AdminAcademicScores extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route
          exact
          path="/admin/academic-scores"
          component={AdminAcademicScoresViewAll}
        />
        <Route
          exact
          path="/admin/academic-scores/create"
          component={AdminAcademicScoresEdit}
        />
        <Route
          exact
          path="/admin/academic-scores/:id(\d+)"
          component={AdminAcademicScoresEdit}
        />
      </React.Fragment>
    );
  }
}

export default AdminAcademicScores;
