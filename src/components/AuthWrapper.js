import React from "react";
import Error from "./Error";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

export default function AuthWrapper({ children }) {
  const { isLoading, error } = useAuth0();
  console.log(isLoading);
  if (isLoading)
    return (
      <Wrapper>
        <h1>Loading...</h1>
      </Wrapper>
    );
  if (error)
    return (
      <Wrapper>
        <Error />
      </Wrapper>
    );
  return <>{children}</>;
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`;
