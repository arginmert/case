// components/PageLayout.js
import React from "react";
import PageTitle from "./PageTitle";

const PageLayout = ({ title, children }) => {
  return (
    <div>
      <PageTitle title={title} />
      <div className="container bg-gray-50 h-fit rounded-lg md:px-10 mt-5">
        <div className="bg-white shadow-sm ">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
