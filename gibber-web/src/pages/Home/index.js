import React from 'react';
import {Container, HomeText, LeftSection, RightSection, StoreBtn} from "./styles";
import {Button, Logo, MockUpContainer, MockUpSource, MocUp, Row} from "../../utils/sharedStyles";
import {useNavigate} from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <LeftSection>
        <Logo/>
        <HomeText>
        <div>
        <h1>DON'T <span className="primary">GIBBER</span>, COMMUNICATE</h1>
          <p>In a world where communication drives families, relationships, business, and more, gibber's mission is to simplify communication between parties.</p>
          <br/>
          <Button style={{fontSize: 23}} onClick={() => navigate('app/login')}>Chat on web</Button>
        </div>
        </HomeText>
        <Row align="center">
          {/* <a href="#"><StoreBtn src={require('../../images/appstore.png')} alt=""/></a>
          <a href="#"><StoreBtn src={require('../../images/playstore.png')} alt=""/></a> */}
        </Row>
      </LeftSection>
      {/* <RightSection>
        <MockUpContainer>
          <MocUp/>
          <MockUpSource/>
        </MockUpContainer>
      </RightSection> */}
    </Container>
  )
}

export default Home;
