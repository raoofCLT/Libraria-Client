import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Tooltip,
} from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { Link, useNavigate } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const showToast = useShowToast();

  // Get Books
  useEffect(() => {
    const getBooks = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };
    getBooks();
  }, [showToast]);

  const handleDelete = async (bookId) => {
    try {
      if (!window.confirm("Are you sure you want to remove this book?")) return;

      const res = await fetch(`/api/books/delete/${bookId}`, {
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
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      showToast("Success", "Book removed successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <Flex>
      {loading ? (
        <Flex width={"100%"} p={5} gap={6} justify={"center"} wrap={"wrap"}>
          {[0, 1, 2, 3, 4, 5, 6].map((_, index) => (
            <Box
              key={index}
              w={{ base: "150px", md: "200px" }}
              p={2}
              borderWidth={1}
              align={"center"}
              borderColor={"gray.500"}
              borderRadius={10}
              bg={"gray.700"}
              boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            >
              <Skeleton height="200px" mb={4} rounded="md" />{" "}
              <Skeleton height={3} width={100}  rounded={5} />
              <Flex mt={4} justify={"space-around"}>
                <Skeleton height={10} width={10} rounded={5} />
                <Skeleton height={10} width={10} rounded={5} />
              </Flex>
            </Box>
          ))}
        </Flex>
      ) : (
        <Flex width={"100%"} p={5} gap={6} justify={"center"} wrap={"wrap"}>
          {books.map((book) => (
            <Box
              key={book.bookId}
              w={{ base: "150px", md: "200px" }}
              p={2}
              borderWidth={1}
              borderColor={"gray.500"}
              borderRadius={10}
              bg={"gray.700"}
              boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            >
              <Box align={"center"} h={{ base: 185, md: 255 }}>
                <Image
                  src={book.coverPage || "https://via.placeholder.com/150"}
                  alt={book.title || "Book cover"}
                  borderRadius="md"
                  mb={4}
                  objectFit="cover"
                  justifySelf={"center"}
                  h={{ base: "130px", md: "200px" }}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
                <Tooltip label={book.title}>
                  <Heading
                    size="xs"
                    color={"gray.500"}
                    mx={3}
                    isTruncated
                    mb={2}
                  >
                    {book.title}
                  </Heading>
                </Tooltip>
              </Box>
              <Flex flexDirection={"row"} justify={"space-evenly"}>
                <Link to={`/admin/book/${book._id}`}>
                  <IconButton
                    w={{ base: "40px", md: "50px" }}
                    bg={"green.500"}
                    aria-label="Update Book"
                    borderRadius="10px"
                    mr={2}
                    color={"white"}
                    _hover={{ bg: "green.600" }}
                    icon={<RxUpdate />}
                    boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                  />
                </Link>
                {/* <Tooltip label={"raoof"}> */}
                <IconButton
                  w={{ base: "40px", md: "50px" }}
                  bg={"red.500"}
                  aria-label="Delete Book"
                  borderRadius="10px"
                  color={"white"}
                  _hover={{ bg: "red.600" }}
                  icon={<MdDeleteOutline />}
                  onClick={() => handleDelete(book._id)}
                  isDisabled={!book.available}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
                {/* </Tooltip> */}
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
      <Box position="fixed" bottom="20px" right="20px">
        <Button
          colorScheme="teal"
          onClick={() => {
            navigate("/admin/createbook");
          }}
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

export default Books;
