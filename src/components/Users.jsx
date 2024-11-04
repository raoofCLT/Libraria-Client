import { Box, Flex, Image, Text, IconButton, Spinner } from "@chakra-ui/react";
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
    <Flex p={5} flexDirection="column" align={loading && "center"} w="100%">
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box w={"100%"}>
          {users.map((user) => (
            <Box
              key={user._id}
              boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            >
              <Flex
                alignItems="center"
                justifyContent="space-between"
                p={2}
                bg="gray.800"
                mb={2}
              >
                <Link to={`/admin/user/${user._id}`}>
                  <Flex alignItems="center">
                    <Image
                      src={user.profilePic}
                      alt={`${user.name}'s avatar`}
                      rounded="full"
                      boxSize="50px"
                      mr={3}
                      boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                    />
                    <Text fontSize="lg">{user.name}</Text>
                  </Flex>
                </Link>
                <IconButton
                  aria-label="Delete user"
                  icon={<DeleteIcon />}
                  color="red.500"
                  size="sm"
                  onClick={() => handleDelete(user._id)}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
              </Flex>
            </Box>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default Users;
