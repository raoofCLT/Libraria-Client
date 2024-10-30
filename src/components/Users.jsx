import { Box, Divider, Flex, Image, Text, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons"; // Importing the DeleteIcon

const Users = () => {
  const users = [
    {
      id: 1,
      name: "Babu",
      image: "https://bit.ly/sage-adebayo",
    },
    {
      id: 2,
      name: "John Doe",
      image: "https://bit.ly/ryan-florence",
    },
    {
      id: 3,
      name: "Jane Smith",
      image: "https://bit.ly/sage-adebayo",
    },
  ];

  return (
      <Flex p={5} flexDirection="column" w="100%">
        <Box w={"100%"}>
          {users.map((user, index) => (
            <Box key={user.id}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                p={2}
                bg="rgba(169, 169, 169, 0.5)" 
                mb={2}
                borderRadius="md"
              >
                <Flex alignItems="center">
                  <Image
                    src={user.image}
                    alt={`${user.name}'s avatar`}
                    rounded="full"
                    boxSize="50px"
                    mr={3}
                  />
                  <Text fontSize="lg" >{user.name}</Text>
                </Flex>
                <IconButton
                  aria-label="Delete user"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  size="sm"
                />
              </Flex>
              {index < users.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Flex>
  );
};

export default Users