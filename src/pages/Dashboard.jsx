import { Button, Flex } from "@chakra-ui/react";
import Users from "../components/Users";
import Books from "../components/Books";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(location.pathname === "/admin/allusers");

  useEffect(() => {
    setUser(location.pathname === "/admin/allusers");
  }, [location.pathname]);

  const handleUserClick = () => {
    navigate("/admin/allusers");
  };

  const handleBookClick = () => {
    navigate("/admin/allbooks");
  };

  return (
    <Flex flexDirection={"column"} align={"center"}>
      <Flex gap={2} my={5}>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={user ? "green.500" : ""}
          onClick={handleUserClick}
        >
          USERS
        </Button>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={!user ? "green.500" : ""}
          onClick={handleBookClick}
        >
          BOOKS
        </Button>
      </Flex>
      {user ? <Users /> : <Books />}
    </Flex>
  );
};

export default Dashboard;
