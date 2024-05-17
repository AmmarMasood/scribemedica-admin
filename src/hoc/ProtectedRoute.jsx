// Lib
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { component, authValidator, navigateTo, ...rest } = props;
  const ComponentInstance = component;
  const isAllowed = authValidator;
  return isAllowed ? (
    <ComponentInstance {...rest} />
  ) : (
    <Navigate to={navigateTo} replace />
  );
};

export default ProtectedRoute;
