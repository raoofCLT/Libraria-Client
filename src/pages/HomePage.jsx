import { Card, CardBody, Flex, Heading, Image } from "@chakra-ui/react";
import { books } from "../dummyData/bookdata";
import { Link } from "react-router-dom";

const HomePage = () => {
  const shuffled = [...books].sort(() => 0.5 - Math.random()).slice(0, 12);
  console.log(shuffled);

  return (
    <Flex wrap={"wrap"} gap={4} justify={"center"} p={4}>
        {shuffled.map((book) => (
      <Link key={book.bookId} to={"/book"}>
          <Card w={"200px"} boxShadow="lg">
            <CardBody>
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
        ))}
    </Flex>
  );
};
export default HomePage;
