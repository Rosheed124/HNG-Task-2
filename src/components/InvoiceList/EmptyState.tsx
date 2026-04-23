import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
        textAlign: "center",
      }}
    >
      <img
        src="/illustration-empty.svg"
        alt="Empty illustration"
        style={{ marginBottom: "40px", maxWidth: "242px" }}
      />
      <h2>There is nothing here</h2>
      <p
        style={{
          marginTop: "24px",
          color: "var(--text-secondary)",
          maxWidth: "220px",
          lineHeight: "15px",
        }}
        className="body-1"
      >
        Create an invoice by clicking the <br />
        <strong>
          New<span className="hide-mobile"> Invoice</span>
        </strong>{" "}
        button and get started
      </p>
    </div>
  );
};

export default EmptyState;
