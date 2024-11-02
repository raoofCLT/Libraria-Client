import { Box, Card, CardBody, Flex, Heading, Image, Spinner } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const HomePage = () => {
  const [trending, setTrending] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  useEffect(() => {
    const getTrending = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };
    getTrending();
  }, [setTrending, showToast]);

  useEffect(() => {
    const getSuggestions = async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch("/api/books/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setSuggestions(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoadingSuggestions(false);
      }
    };
    getSuggestions();
  }, [setSuggestions, showToast]);

  return (
    <Flex flexDirection={"column"}>
      <Flex wrap={"wrap"} gap={4} mt={2} justify={"center"}>
        <Box w={"100%"} m={3} align={"center"}>
          <Heading size={"md"} color={"gold"}>
            TRENDING BOOKS
          </Heading>
        </Box>
        {isLoading ? (
          <Box>
            <Spinner />
          </Box>
        ) : (
          <Flex gap={4} justify={"center"} rounded={5} p={4}>
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

      <Flex wrap={"wrap"} gap={4} justify={"center"} p={4}>
        <Box w={"100%"} m={3} align={"center"}>
          <Heading size={"md"}>SUGGESTED BOOKS</Heading>
        </Box>
        {isLoadingSuggestions ? (
          <Box>
            <Spinner />
          </Box>
        ) : (
          suggestions.map((book) => ( 
            <Link key={book._id} to={`/book/${book._id}`}>
              <Card w={"200px"} h={"345px"} boxShadow="lg">
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
                  <Heading size="sm" color={"gray.500"}>
                    {book.title}
                  </Heading>
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
