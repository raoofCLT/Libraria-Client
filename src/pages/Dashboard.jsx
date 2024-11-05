import {Button, Flex } from "@chakra-ui/react";
import Users from "../components/Users";
import Books from "../components/Books";
import { useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState(true);

  return (
    <Flex flexDirection={"column"} align={"center"}>
      <Flex gap={2} my={5}>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={user ? "green.500" : ""}
          onClick={() => setUser(true)}
        >
          USERS
        </Button>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={!user ? "green.500" : ""}
          onClick={() => setUser(false)}
        >
          BOOKS
        </Button>
      </Flex>
      {user ? <Users /> : <Books />}
    </Flex>
  );
};

export default Dashboard;
