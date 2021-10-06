import { Button } from "@material-ui/core";
import React from "react";
import { useHistory, withRouter } from "react-router-dom";
import { NavbarDiv } from "./navbar-style";

const Navbar = () => {
  const history = useHistory();
  const handleClick = (link) => {
    history.push(link);
  };

  return (
    <NavbarDiv>
      <Button onClick={() => handleClick("/")}>FS IFC</Button>
      <Button onClick={() => handleClick("/LoadIFC")}>AutoLoad IFC</Button>
    </NavbarDiv>
  );
};

export default withRouter(Navbar);
