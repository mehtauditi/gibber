import styled from "styled-components";

export const Container = styled.div`
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    align-items: center;
    overflow-y: scroll;
    background-color: ${props => props.theme.bg};
    color: ${props => props.theme.txt};
    position: relative;
`

export const Divider = styled.div`
  width: 130px;
  height: 2px;
  background-color: ${props => props.theme.title};
  @media screen and (max-width: 350px) {
    width: 110px;
  }
`;

export const TextField = styled.div`

    margin-left: 15px;

    & h4 {
        display: inline-block;
        text-align: left;
        margin: 5px 5px 5px 0px;
    }
    

    & input {
        color: ${props => props.theme.title} !important;
    }
`;

export const AvatarButton = styled.img `
  height: 175px;
  width: 175px;
  border-radius: 50%;
  border: 2px solid black;
`;