import React from "react";
import styled from "@emotion/styled";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Aside } from "body/Aside";
import { Content } from "pages";

const Entries = () => {
  return (
    <Router>
      <Container>
        <Header>
          <HeaderLeft>ELN</HeaderLeft>
          <HeaderRight>
            {/* <div>组件</div>
            <div>ELN</div> */}
          </HeaderRight>
        </Header>
        <Main>
          <Nav>
            <Aside />
          </Nav>
          <Article>
            <Routes>
              <Route path="main/*" element={<Content />} />
              <Route path="/" element={<Navigate to={"main"} replace />} />
            </Routes>
          </Article>
        </Main>
      </Container>
    </Router>
  );
};

export default Entries;

const Container = styled.div`
  height: 100%;
`;

const Header = styled.header`
  height: 4rem;
  /* border: 1px solid; */
  display: flex;
  background: rgb(127, 171, 177);
  border-bottom: 1px solid #ccc;
  color: rgb(32, 137, 177);
`;
const HeaderLeft = styled.div`
  width: 20rem;
  /* border: 1px solid darkblue; */
  font-size: 20;
  font-weight: 700;
  line-height: 4rem;
  text-align: center;
`;
const HeaderRight = styled.div`
  flex: 1;
`;

const Main = styled.main`
  /* border: 1px solid saddlebrown; */
  height: calc(100% - 4rem);
  display: flex;
`;

const Nav = styled.nav`
  width: 20rem;
  height: 100%;
  background: aliceblue;
`;

const Article = styled.article`
  flex: 1;
  padding: 1rem;
  overflow: auto;
  /* background: cadetblue; */
`;
