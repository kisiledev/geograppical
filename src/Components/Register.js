import React from "react";
import { db } from "./Firebase/firebase";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        name: "",
        email: ""
      },
      formErrors: {
        name: "",
        email: ""
      },
      formValidity: {
        name: false,
        email: false
      },
      isSubmitting: false
    };
  }

  
  addUser = () => {
    const data = {
      ...this.state.formValues,
      uid: new Date().getTime()
    };
    db.collection("users")
      .doc(data.uid.toString())
      .set(data)
      .then(() => {
        window.location = "/";
      })
      .catch(error => {
        this.setState({ isSubmitting: false });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isSubmitting: true });
    const { formValues, formValidity } = this.state;
    if (Object.values(formValidity).every(Boolean)) {
      this.addUser();
    } else {
      for (let key in formValues) {
        let target = {
          name: key,
          value: formValues[key]
        };
        this.handleValidation(target);
      }
      this.setState({ isSubmitting: false });
    }
  };

  handleChange = ({ target }) => {
    const { formValues } = this.state;
    formValues[target.name] = target.value;
    this.setState({ formValues });
    this.handleValidation(target);
  };

  handleValidation = target => {
    const { name, value } = target;
    const fieldValidationErrors = this.state.formErrors;
    const validity = this.state.formValidity;
    const isImage = name === "image";

    if (!isImage) {
      validity[name] = value.length > 0;
      fieldValidationErrors[name] = validity[name]
        ? ""
        : `${name} is required and cannot be empty`;
    }

    this.setState({
      formErrors: fieldValidationErrors,
      formValidity: validity
    });
  };

  render() {
    const { formValues, formErrors, isSubmitting } = this.state;
    return (
      <div className="mx-auto col-lg-4">
        <div className="row mb-5">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">Register New Person</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${
                    formErrors.name ? "is-invalid" : ""
                  }`}
                  placeholder="Enter name"
                  onChange={this.handleChange}
                  value={formValues.name}
                />
                <div className="invalid-feedback">{formErrors.name}</div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  className={`form-control ${
                    formErrors.email ? "is-invalid" : ""
                  }`}
                  placeholder="Enter valid email"
                  onChange={this.handleChange}
                  value={formValues.email}
                />
                <div className="invalid-feedback">{formErrors.email}</div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;