import {
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { books } from "../dummyData/bookdata";
import { MdDeleteOutline } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";

const Books = () => {
  const allBooks = books;

  return (
    <Flex>
      <Flex width={"100%"} p={5} gap={6} justify={"center"} wrap={"wrap"}>
        {allBooks.map((book) => (
          <Card key={book.bookId} w={"200px"} p={2} boxShadow="lg">
            <CardBody>
              <Image
                src={book.coverPage || "https://via.placeholder.com/150"}
                alt={book.title || "Book cover"}
                borderRadius="md"
                mb={4}
                objectFit="cover"
                justifySelf={"center"}
                h={{ base: "100px", md: "200px" }}
              />
              <Heading size="xs" color={"gray.500"}>
                {book.title}
              </Heading>
            </CardBody>
            <Flex flexDirection={"row"} justify={"center"}>
              <IconButton
                w={"50px"}
                aria-label="Update Book"
                borderRadius="10px"
                mr={2}
                icon={<RxUpdate />}
              />
              <IconButton
                w={"50px"}
                bg={"red.500"}
                aria-label="Delete Book"
                borderRadius="10px"
                icon={<MdDeleteOutline />}
              />
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
};

export default Books;
