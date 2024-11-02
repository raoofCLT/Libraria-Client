import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import {Link } from "react-router-dom";


const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();


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
        <Spinner size="xl" />
      ) : (
        <Flex width={"100%"} p={5} gap={6} justify={"center"} wrap={"wrap"}>
          {books.map((book) => (
            <Box
              key={book.bookId}
              w={{base:"150px" ,md:"200px"}}
              p={2}
              borderWidth={1}
              borderColor={"gray.500"}
              borderRadius={10}
              bg={"gray.700"}
               boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
            >
              <Box align={"center"} h={{base:185 ,md:255}}>
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
                <Heading size="xs" color={"gray.500"} mb={2}>
                  {book.title}
                </Heading>
              </Box>
              <Flex flexDirection={"row"} justify={"space-evenly"}>
              <Link to={`/admin/book/${book._id}`}>
                <IconButton
                  w={{base:"40px", md:"50px"}}
                  aria-label="Update Book"
                  borderRadius="10px"
                  mr={2}
                  icon={<RxUpdate />}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
                </Link>
                <IconButton
                  w={{base:"40px", md:"50px"}}
                  bg={"red.500"}
                  aria-label="Delete Book"
                  borderRadius="10px"
                  icon={<MdDeleteOutline />}
                  onClick={()=> handleDelete (book._id)}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
              </Flex>
            </Box>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Books;
