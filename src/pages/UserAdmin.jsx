import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Heading,
  Stack,
  Spinner,
  Image,
  Flex,
  Avatar,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { differenceInDays } from "date-fns";

const UserAdmin = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const showToast = useShowToast();

  const { id: userId } = useParams();

  //Get User
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/getuser/${userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [showToast, userId]);

  //Get Books
  useEffect(() => {
    const getBooks = async () => {
      try {
        console.log();
        if (user?.currentBooks) {
          const fetchedBooks = await Promise.all(
            user.currentBooks.map(async (book) => {
              const res = await fetch(`/api/books/getbook/${book.bookId}`);
              return await res.json();
            })
          );
          setBooks(fetchedBooks);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getBooks();
  }, [showToast, user]);

  const calculateDays = (checkInDate) => {
    if (!checkInDate) return "N/A";
    console.log(checkInDate);
    try {
      const daysPassed = differenceInDays(new Date(), new Date(checkInDate));
      const daysLeft = 10 - daysPassed;
      return daysLeft > 0
        ? `Due In: ${daysLeft}d`
        : daysLeft === 0
        ? "Due today"
        : "Overdue";
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <Flex justify={"center"}>
        <Spinner size="lg" color="blue.500" mt={8} />;
      </Flex>
    );
  }

  if (!user) {
    return (
      <Text fontSize="lg" color="red.500" mt={8}>
        No user data available.
      </Text>
    );
  }

  return (
    <Box
      p={8}
      maxW="70%"
      mx="auto"
      mt={10}
      bgGradient="linear(to-r, gray.900, gray.800)"
      borderRadius="lg"
      boxShadow="2xl"
      color="gray.400"
    >
      <Flex align="center" direction="column" mb={6}>
        <Avatar
          src={user.profilePic || "https://via.placeholder.com/150"}
          size="2xl"
          mb={4}
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3)"
        />
        <Heading textAlign="center" color="cyan.400">
          {user.name}&apos;s Details
        </Heading>
      </Flex>

      <Stack spacing={2} textAlign="center">
        <Text>
          <strong>@</strong>
          {user.username}
        </Text>
        <Text>{user.email}</Text>
      </Stack>

      <Divider mt={5} />

      <Heading size="md" mt={8} color="cyan.400" textAlign="center">
        Books Checked In
      </Heading>

      <Flex
        width="100%"
        p={10}
        m={5}
        gap={6}
        justify="space-around"
        wrap="wrap"
      >
        {user.currentBooks?.length > 0 ? (
          books.map((book, index) => {
            const checkInDate = user.currentBooks[index]?.checkInDate;
            const remainingDays = calculateDays(checkInDate);

            return (
              <Box
                key={book._id}
                align="center"
                h={{ base: 200, md: 280 }}
                w={{ base: "130px", md: "200px" }}
                p={{ base: "", md: 2 }}
                rounded="lg"
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                transition="transform 0.2s ease-in-out"
                _hover={{ transform: "scale(1.05)" }}
                bg={remainingDays === "Overdue" ? "red.300" : "gray.800"}
              >
                <Box p={2}>
                  <Image
                    src={book.coverPage || "https://via.placeholder.com/150"}
                    alt={book.title || "Book cover"}
                    borderRadius="md"
                    mb={2}
                    objectFit="cover"
                    h={{ base: "120px", md: "190px" }}
                  />
                  <Tooltip label={book.title}>
                    <Heading
                      size="xs"
                      mb={2}
                      color={
                        remainingDays === "Overdue" ? "gray.200" : "gray.300"
                      }
                      isTruncated
                      maxWidth="150px"
                    >
                      {book.title}
                    </Heading>
                  </Tooltip>
                  <Text
                    color={remainingDays === "Overdue" ? "gray.900" : "red.300"}
                  >
                    {remainingDays}
                  </Text>
                </Box>
              </Box>
            );
          })
        ) : (
          <Text color="gray.400" mt={4}>
            No books currently checked in.
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default UserAdmin;
