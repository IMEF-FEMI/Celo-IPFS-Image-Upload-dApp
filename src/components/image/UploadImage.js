import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import toastr from "toastr";

import { uploadImage, getImages } from "../../actions/imageActions";
import Spinner from "../common/Spinner";


const UploadImage = (props) => {
  const [state, setState] = useState({
    title: "",
    description: "",
    tags: "",
    buffer: null,
    file: null,
  });
 const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));

    // setState({
    //   [event.target.id]: event.target.value,
    // });
  };

  const captureFile = (event) => {
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setState((prevState) => ({
        ...prevState,
        buffer: Buffer(reader.result),
        file: URL.createObjectURL(file),
      }));

      // setState({
      //   buffer: Buffer(reader.result),
      //   file: URL.createObjectURL(file),
      // });
    };
  };

  const handleUploadImage = async (event) => {
    event.preventDefault();

    const { title, description, tags, buffer } = state;
    console.log(title, description, buffer);
    try {
      await props.uploadImage(buffer, title, description, tags, props.history);
      toastr.success(
        "Image uploaded. Might take a while for Celo wallet to respond."
      );
      window.scrollTo(0, 0);
    } catch (error) {
      toastr.error(error);
    }

    // return to image list
    // props.history.push("/");
  };

  return (
    <div className="container">
      <fieldset disabled={props.loading}>
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center mt-4">Upload an image</h1>
            {props.loading ? (
              <Spinner />
            ) : (
              <p className="lead text-center">
                Let's get some information before uploading your image to IPFS
                and the Blockchain
              </p>
            )}
            <form className="needs-validation" onSubmit={handleUploadImage}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="Title"
                  value={state.title}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Title is required.</div>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Description"
                  rows="3"
                  value={state.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="tags">Tags *</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  placeholder="Tags"
                  value={state.tags}
                  onChange={handleChange}
                  required
                />
                <small id="tagsHelpBlock" className="form-text text-muted">
                  Comma-delimited e.g Baseball, Softball, Soccer.
                </small>
                <div className="invalid-feedback">Tags are required.</div>
              </div>
              <div className="form-group">
                <label htmlFor="file">Image *</label>
                <input
                  type="file"
                  className="form-control-file"
                  id="file"
                  onChange={captureFile}
                  required
                />
                <div className="invalid-feedback">Image required.</div>
              </div>
              <small className="d-block pb-3">* = required fields</small>
              <small className="d-block pb-3">
                Uploading the same file multiple times will result in the same
                file with the same hash being uploaded.
              </small>
              <div className="mb-3">
                <Link to="/" className="btn btn-secondary mr-2">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  Upload
                </button>
              </div>
            </form>
            {state.file && (
              <div className="text-center mt-3 mb-3">
                <img src={state.file} className="img-thumbnail" alt="Preview" />
              </div>
            )}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.image.loading,
});

export default connect(mapStateToProps, { uploadImage, getImages })(
  UploadImage
);
