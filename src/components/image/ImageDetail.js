import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./ImageDetail.css";
import { getImage, getImages } from "../../actions/imageActions";

const ImageDetail = (props) => {
  
  useEffect(async () => {
    await props.getImages();
    await props.getImage(props.match.params.index);

  }, [props.image]);

  const image = props.image ? props.image : {};
  // const { image } = useSelector((state) => state.image);

  const {
    ipfsHash,
    title,
    description,
    uploadedOn,
    blockHash,
    blockNumber,
    transactionHash,
    transactionIndex,
    cumulativeGasUsed,
    gasUsed,
  } = image;

  return (
    <div className="container">
      <div className="alert alert-info mt-3" role="alert">
        Blockchain transaction information is <strong>not</strong> persisted.
        This information <i>may</i> be lost when you refresh the browser or
        login as another user.
      </div>
      <div className="mt-3 mb-3">
        <Link to="/">Go Back</Link>
      </div>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            {ipfsHash ? (
              <img
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
                className="card-img-top"
                alt={`${ipfsHash}`}
              />
            ) : (
              <img
                src="https://api.fnkr.net/testimg/333x180/?text=IPFS"
                className="card-img-top"
                alt="NA"
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">{description}</p>
              <p className="card-text">
                <small className="text-muted">
                  Uploaded on {uploadedOn ? uploadedOn : "N/A"}
                </small>
              </p>
            </div>
          </div>
          <p className="lead">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              className={`btn btn-primary btn-lg ${!ipfsHash && "disabled"}`}
              role="button"
            >
              View on IPFS
            </a>
          </p>
        </div>
        <div className="col-md-8">
          <h3>IPFS Hash</h3>
          <p>
            {ipfsHash ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://ipfs.io/ipfs/${ipfsHash}`}
                className="lead"
                role="button"
              >
                {ipfsHash}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <hr className="my-4" />
          <h3>Blockchain Details</h3>

          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <th scope="row">Transaction Hash</th>
                  <td>{transactionHash ? transactionHash : "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Transaction Index</th>
                  <td>
                    {transactionIndex || transactionIndex >= 0
                      ? transactionIndex
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Block Hash</th>
                  <td>{blockHash ? blockHash : "N/A"} </td>
                </tr>
                <tr>
                  <th scope="row">Block Number</th>
                  <td>{blockNumber ? blockNumber : "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Gas Used (wei)</th>
                  <td>{gasUsed ? gasUsed : "N/A"}</td>
                </tr>
                <tr>
                  <th scope="row">Cumulative Gas Used (wei)</th>
                  <td>{cumulativeGasUsed ? cumulativeGasUsed : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr className="my-4" />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  image: state.image.image,
});

export default connect(mapStateToProps, { getImage, getImages })(ImageDetail);
