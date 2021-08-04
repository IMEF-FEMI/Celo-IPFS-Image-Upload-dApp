import React, {  useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Spinner from "../common/Spinner";
import ImageItem from "./ImageItem";
import { getImages } from "../../actions/imageActions";

const bgImg = require("../../assets/images/decentralized-network.jpg");

const Images = (props) => {
  useEffect(() => {
    props.getImages();
  }, []);

  let { images, loading } = props.image;
  let imageItems;

  if (images === null || loading) {
    imageItems = <Spinner />;
  } else {
    if (images.length > 0) {
      imageItems = images.map((image) => (
        <ImageItem key={image.index} image={image} />
      ));
    } else {
      imageItems = <h4>No images found</h4>;
    }
  }
  return (
    <div>
      <section
        className="jumbotron text-center"
        style={{
          backgroundImage: `url("${bgImg}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "1.0",
        }}
      >
        <div className="container">
          <h1 className="jumbotron-heading">Images</h1>
          <p className="lead text-muted">
            Upload images to IPFS and store the IPFS hash on the Celo
            Blockchain.
          </p>
          <p>
            <small>
              Celo Account <mark>{props.web3.account || "Not Connected"}</mark>
            </small>
          </p>
          <p>
            <Link to="/uploadimage" className="btn btn-primary my-2">
              Upload Image
            </Link>
          </p>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row" >
            {imageItems}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  web3: state.web3,
  image: state.image,
});

export default connect(mapStateToProps, { getImages })(Images);
