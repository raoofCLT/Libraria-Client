import { Button, Flex } from "@chakra-ui/react";
import Users from "../components/Users";
// import Books from "../components/Books";

const Dashboard = () => {
  return (
    <Flex flexDirection={"column"} align={"center"}>
      <Flex gap={2} my={5}>
        <Button color={"green.500"}>USERS</Button>
        <Button>BOOKS</Button>
      </Flex>
      <Users/>
      {/* <Books/> */}
    </Flex>
  );
};

export default Dashboard;
