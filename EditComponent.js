import React from "react";
import { Redirect } from "react-router-dom";
import FlashMessage from "./FlashMessage";
import { setFlashMessage } from "./FlashMessage";
import {
  academicScores_getById,
  academicScores_update,
  academicScores_post
} from "./server";

class AdminAcademicScoresEdit extends React.Component {
  state = {
    id: "",
    userId: "",
    gpa: "",
    sat: "",
    act: "",
    buttonToggleHide: false,
    validatePost: false,
    validateUpdate: false,
    gpaNullOrHasTypeCheck: false,
    loading: false,
    validationOff: false,
    redirectUpdateSuccess: false
  };

  componentDidMount() {
    if (this.props.match.params.id) {
      this.setState({
        buttonToggleHide: true,
        loading: true
      });
      this.populateForm();
    }
  }

  populateForm = () => {
    const myPromise = academicScores_getById(this.props.match.params.id);
    myPromise.then(populate => {
      this.setState({
        validationOff: true,
        id: populate.data.item.id,
        userId: populate.data.item.userId,
        gpa: populate.data.item.gpa || "",
        sat: populate.data.item.sat || "",
        act: populate.data.item.act || "",
        loading: false
      });
    });
  };

  submitIfValid = () => {
    if (this.state.gpa === null) {
      this.setState({
        gpa: ""
      });
    }
    if (this.state.sat === null) {
      this.setState({
        sat: ""
      });
    }
    if (this.state.act === null) {
      this.setState({
        act: ""
      });
    }
    if (!this.state.buttonToggleHide) {
      this.validate(false);
      if (this.state.validatePost) {
        this.create();
      }
    }
    if (!this.state.validationHasRun) {
      this.validate(true);
    }
    if (this.state.buttonToggleHide) {
      this.validate(false);

      if (this.state.validateUpdate) {
        this.validate(true);
      }
    }
  };

  validate = shouldDoAjaxCall => {
    const userIdEmpty = this.state.userId === "";
    const userIdNeedsDigit = !/^([0-9]+)$/.test(this.state.userId);
    const gpaNullOrHasTypeCheck = /^(|\x00+|[0-5]|[0-4]\.\d\d?|[5]\.[0]{0,2})$/.test(
      this.state.gpa
    );
    const satNullOrHasDigit = /^(|[4-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-5][0-9]{2}|1600)$/.test(
      this.state.sat
    );
    const actNullOrHasDigit = /^(|[1-9]|[12][0-9]|3[0-6])$/.test(
      this.state.act
    );
    this.setState({
      validationHasRun: true,
      userIdEmpty,
      userIdNeedsDigit,
      gpaNullOrHasTypeCheck,
      satNullOrHasDigit,
      actNullOrHasDigit,
      validatePost: false,
      validateUpdate: false,
      validationOff: false
    });

    if (
      !userIdEmpty &&
      !userIdNeedsDigit &&
      gpaNullOrHasTypeCheck &&
      satNullOrHasDigit &&
      actNullOrHasDigit
    ) {
      if (!shouldDoAjaxCall) {
        if (!this.state.buttonToggleHide) {
          this.setState({
            validatePost: true
          });
        } else if (this.state.buttonToggleHide) {
          this.setState({
            validateUpdate: true
          });
        }
        return;
      }

      if (shouldDoAjaxCall) {
        if (!this.state.buttonToggleHide) {
          this.create();
        } else if (this.state.buttonToggleHide) {
          this.update();
        }
      }
    }
  };

  create = () => {
    const myPromise = academicScores_post({
      UserId: this.state.userId,
      GPA: this.state.gpa,
      SAT: this.state.sat,
      ACT: this.state.act
    });
    myPromise.then(e => {
      this.setState({
        redirectUpdateSuccess: true
      });
      setFlashMessage("Submit Successful!!");
    });
  };

  update = id => {
    const myPromise = academicScores_update({
      Id: this.props.match.params.id,
      UserId: this.state.userId,
      GPA: this.state.gpa,
      SAT: this.state.sat,
      ACT: this.state.act
    });
    myPromise.then(e => {
      setFlashMessage("Update Successful!!");
      this.setState({
        redirectUpdateSuccess: true
      });
      console.log("updatesuccessful");
    });
  };

  render() {
    if (this.state.redirectUpdateSuccess) {
      return <Redirect to="/admin/academic-scores" />;
    }
    return (
      <React.Fragment>
        {this.state.loading && (
          <div>
            <i className="fa fa-spinner fa-spin" />
            Loading...
          </div>
        )}
        <div className="panel rounded shadow">
          <div className="panel-heading">
            <div className="pull-left">
              <h3 className="panel-title">Submit Your Scores!</h3>
            </div>
            <div className="pull-right">
              <button
                className="btn btn-sm"
                data-action="collapse"
                data-container="body"
                data-toggle="tooltip"
                data-placement="top"
                data-title="Collapse"
                data-original-title=""
                title=""
              >
                <i className="fa fa-angle-up" />
              </button>
              <button
                className="btn btn-sm"
                data-action="remove"
                data-container="body"
                data-toggle="tooltip"
                data-placement="top"
                data-title="Remove"
                data-original-title=""
                title=""
              >
                <i className="fa fa-times" />
              </button>
            </div>
            <div className="clearfix" />
          </div>
          <div className="panel-body no-padding">
            <form
              className="form-horizontal form-bordered"
              id="basic-validate"
              action="#"
              noValidate="novalidate"
            >
              <div className="form-body">
                <div
                  className={
                    this.state.userIdNeedsDigit || this.state.userIdEmpty
                      ? "form-group has-feedback has-error"
                      : "form-group"
                  }
                >
                  <label className="col-sm-3 control-label">
                    <span
                      className={this.state.userId === null ? "asterisk" : ""}
                    >
                      User ID
                    </span>
                  </label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control input-sm"
                      name="bv_required"
                      placeholder="Enter User ID"
                      aria-required="true"
                      aria-invalid="true"
                      value={this.state.userId}
                      onChange={e => {
                        this.setState({ userId: e.target.value }, () => {
                          if (this.state.validationHasRun) {
                            this.validate(false);
                          }
                        });
                      }}
                    />

                    {this.state.userIdEmpty ? (
                      <label
                        id="bv_required-error"
                        className="error"
                        htmlFor="bv_required"
                        style={{ display: "inline-block" }}
                      >
                        Field required.
                      </label>
                    ) : (
                      this.state.userIdNeedsDigit && (
                        <label
                          id="bv_required-error"
                          className="error"
                          htmlFor="bv_required"
                          style={{ display: "inline-block" }}
                        >
                          Must be a number.
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div
                  className={
                    this.state.validationOff
                      ? "form-group"
                      : !/^(|[0-5]|[0-4]\.\d\d?|[5]\.[0]{0,2})$/.test(
                          this.state.gpa
                        )
                        ? "form-group has-feedback has-error"
                        : "form-group"
                  }
                >
                  <label className="col-sm-3 control-label">GPA</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control input-sm"
                      name="bv_date"
                      placeholder="Not Required"
                      aria-required="true"
                      aria-invalid="true"
                      value={this.state.gpa}
                      onChange={e => {
                        this.setState({ gpa: e.target.value }, () => {
                          if (this.state.validationHasRun) {
                            this.validate(false);
                          }
                        });
                      }}
                    />

                    {this.state.validationOff
                      ? undefined
                      : !/^(|[0-5]|[0-4]\.\d\d?|[5]\.[0]{0,2})$/.test(
                          this.state.gpa
                        ) && (
                          <label
                            id="bv_date-error"
                            className="error"
                            htmlFor="bv_date"
                            style={{ display: "inline-block" }}
                          >
                            Please enter valid GPA format. #, #.#, or #.##
                          </label>
                        )}
                  </div>
                </div>

                <div
                  className={
                    this.state.validationOff
                      ? "form-group"
                      : !/^(|[4-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-5][0-9]{2}|1600)$/.test(
                          this.state.sat
                        )
                        ? "form-group has-error has-feedback"
                        : "form-group"
                  }
                >
                  <label className="col-sm-3 control-label">SAT</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control input-sm"
                      name="bv_url"
                      placeholder="Not Required"
                      aria-required="true"
                      aria-invalid="true"
                      value={this.state.sat}
                      onChange={e => {
                        this.setState({ sat: e.target.value }, () => {
                          if (this.state.validationHasRun) {
                            this.validate(false);
                          }
                        });
                      }}
                    />
                    {this.state.validationOff
                      ? undefined
                      : !/^(|[4-8][0-9]{2}|9[0-8][0-9]|99[0-9]|1[0-5][0-9]{2}|1600)$/.test(
                          this.state.sat
                        ) && (
                          <label
                            id="bv_url-error"
                            className="error"
                            htmlFor="bv_url"
                            style={{ display: "inline-block" }}
                          >
                            Please enter a number between 400 and 1600.
                          </label>
                        )}
                  </div>
                </div>

                <div
                  className={
                    this.state.validationOff
                      ? "form-group"
                      : !/^(|[1-9]|[12][0-9]|3[0-6])$/.test(this.state.act)
                        ? "form-group has-feedback has-error"
                        : "form-group"
                  }
                >
                  <label className="col-sm-3 control-label">ACT</label>
                  <div className="col-sm-7">
                    <input
                      type="text"
                      className="form-control input-sm"
                      name="bv_username"
                      placeholder="Not Required"
                      aria-required="true"
                      aria-invalid="true"
                      value={this.state.act}
                      onChange={e => {
                        this.setState({ act: e.target.value }, () => {
                          if (this.state.validationHasRun) {
                            this.validate(false);
                          }
                        });
                      }}
                    />
                    {this.state.validationOff
                      ? undefined
                      : !/^(|[1-9]|[12][0-9]|3[0-6])$/.test(this.state.act) && (
                          <label
                            id="bv_username-error"
                            className="error"
                            htmlFor="bv_username"
                            style={{ display: "inline-block" }}
                          >
                            Please enter a number between 1 and 36.
                          </label>
                        )}
                  </div>
                </div>
              </div>
              {!this.state.buttonToggleHide ? (
                <div className="form-footer">
                  <div className="col-sm-offset-3">
                    <button
                      type="button"
                      onClick={this.submitIfValid}
                      className="btn btn-theme"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="form-footer">
                  <div className="col-sm-offset-3">
                    <button
                      type="button"
                      onClick={this.submitIfValid}
                      className="btn btn-theme"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminAcademicScoresEdit;
