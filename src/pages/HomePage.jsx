import {
  Box,
  Card,
  CardBody,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [books, setBooks] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);
  const [isLoadingBooks, setLoadingBooks] = useState(true);
  const [user, setUser] = useRecoilState(userAtom);

  //Get User
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/getuser/${user._id}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setUser(data);
        localStorage.setItem("user-library", JSON.stringify(data));
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getUser();
  }, [showToast, user._id, setUser]);

  //Trending Books
  useEffect(() => {
    const getTrending = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/books/trending");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setTrending(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getTrending();
  }, [setTrending, showToast]);

  // All Books
  useEffect(() => {
    const getBooks = async () => {
      setLoadingBooks(true);
      try {
        const res = await fetch("/api/books/getbooks");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setBooks(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        return;
      } finally {
        setLoadingBooks(false);
      }
    };
    getBooks();
  }, [showToast]);

  return (
    <Flex flexDirection={"column"}>
      <Flex wrap={"wrap"} gap={4} mt={2} justify={"center"}>
        <Box w={"100%"} m={3} align={"center"}>
          <Heading size={"md"} color={"gold"}>
            TRENDING BOOKS
          </Heading>
        </Box>
        {loading ? (
          <Box>
            <Spinner />
          </Box>
        ) : (
          <Flex gap={4} wrap={"wrap"} justify={"center"} rounded={5} p={4}>
            {trending.map((book) => (
              <Link key={book._id} to={`/book/${book._id}`}>
                <Flex w={"150px"}>
                  <Box
                    align={"center"}
                    width={"170px"}
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.1)" }}
                  >
                    <Image
                      src={book.coverPage || "https://via.placeholder.com/150"}
                      alt={book.title || "Book cover"}
                      borderRadius="md"
                      mb={2}
                      objectFit="cover"
                      height="250px"
                    />
                    <Heading size="sm" color={"gray.300"}>
                      {book.title}
                    </Heading>
                  </Box>
                </Flex>
              </Link>
            ))}
          </Flex>
        )}
      </Flex>
      <Divider
        borderColor="cyan.300"
        borderWidth="1px"
        my={4}
        width="70%"
        mx="auto"
      />
      <Flex wrap={"wrap"} gap={4} justify={"center"} p={4}>
        <Box w={"100%"} m={3} align={"center"}>
          <Heading size={"md"}>ALL BOOKS</Heading>
        </Box>
        {isLoadingBooks ? (
          <Box>
            <Spinner />
          </Box>
        ) : (
          books.map((book) => (
            <Link key={book._id} to={`/book/${book._id}`}>
              <Card w={"200px"} h={"340px"} boxShadow="lg">
                <CardBody
                  transition="transform 0.2s ease"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <Image
                    src={book.coverPage || "https://via.placeholder.com/150"}
                    alt={book.title || "Book cover"}
                    borderRadius="md"
                    mb={4}
                    objectFit="cover"
                    height="250px"
                  />
                  <Tooltip label={book.title}>
                    <Heading size="sm" color={"gray.500"} isTruncated>
                      {book.title}
                    </Heading>
                  </Tooltip>
                </CardBody>
              </Card>
            </Link>
          ))
        )}
      </Flex>
    </Flex>
  );
};

export default HomePage;
