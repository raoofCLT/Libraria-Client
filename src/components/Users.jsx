import {
  Box,
  Flex,
  Image,
  Text,
  IconButton,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);

  // Get All Users
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/getusers");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        return;
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [showToast]);

  const handleDelete = async (userId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      const res = await fetch(`/api/users/delete/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      showToast("Success", "User deleted successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Flex p={5} wrap="wrap" justify="center" w="100%" gap={1}>
      {loading ? (
        <Flex gap={4} wrap={"wrap"} justify={"center"} rounded={5} p={4}>
          {[0, 1, 2, 3, 4].map((_, index) => (
            <Flex
            key={index}
            width="280px"
            height="100px"
            m={1}
            p={3}
            boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            borderRadius="xl"
            bg="gray.700"
          >
            <Flex align="center" gap={4} p={2}>
              <SkeletonCircle size="80px" rounded={"full"} bg="gray.800" />
              <Skeleton height="10px" width="100px" bg="gray.600" borderRadius="md" />
            </Flex>
          </Flex>
          ))}
        </Flex>
      ) : (
        users.map((user) => (
          <Box
            key={user._id}
            width="280px"
            m={1}
            p={1}
            boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            borderRadius="xl"
            bg="gray.700"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              p={3}
              bg="gray.800"
              borderRadius="md"
            >
              <Link to={`/admin/user/${user._id}`}>
                <Flex alignItems="center">
                  <Image
                    src={user.profilePic}
                    alt={`${user.name}'s avatar`}
                    rounded="full"
                    boxSize="80px"
                    mr={3}
                    boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                  />
                  <Text fontSize="lg" color="white">
                    {user.name}
                  </Text>
                </Flex>
              </Link>
              <IconButton
                aria-label="Delete user"
                icon={<DeleteIcon />}
                color="red.500"
                bg={"gray.700"}
                size="sm"
                onClick={() => handleDelete(user._id)}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
              />
            </Flex>
          </Box>
        ))
      )}
    </Flex>
  );
};

export default Users;
