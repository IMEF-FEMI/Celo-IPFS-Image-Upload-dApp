import React from "react";

import spinner from "./spinner.gif";

const Spinner = () => {
  return (
    <div style={{ width: "100%", margin: "auto" }}>
      <img
        src={spinner}
        alt="Loading..."
        style={{
          width: "200px",
          margin: "auto",
          display: "block",
          alignSelf: "center",
        }}
      />
    </div>
  );
};

export default Spinner;
