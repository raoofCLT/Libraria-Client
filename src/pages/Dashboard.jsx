import { Box, Button, Flex } from "@chakra-ui/react";
import Users from "../components/Users";
import Books from "../components/Books";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import {useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [book, setBook] = useState(true);
  const navigate = useNavigate()

  return (
    <Flex flexDirection={"column"} align={"center"}>
      <Flex gap={2} my={5}>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={book ? "green.500" : ""}
          onClick={() => setBook(!book)}
        >
          USERS
        </Button>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={!book ? "green.500" : ""}
          onClick={() => setBook(!book)}
        >
          BOOKS
        </Button>
      </Flex>
      {book ? <Users /> : <Books />}
      <Box position="fixed" bottom="20px" right="20px"> {/* Set to fixed */}
        <Button
          colorScheme="teal"
          onClick={() => {navigate("/admin/createbook")}}
          size="lg"
          borderRadius="full"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.2)"
        >
          <AddIcon />
        </Button>
      </Box>
    </Flex>
  );
};

export default Dashboard;
