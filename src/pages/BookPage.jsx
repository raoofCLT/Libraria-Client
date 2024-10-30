import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";

const BookPage = () => {
  const book = {
    bookId: "B005",
    title: "Harry Potter and the Sorcerer's Stone",
    coverPage:
      "https://rukminim2.flixcart.com/image/850/1000/jskofww0/book/8/8/9/harry-potter-and-the-sorcerer-s-stone-book-1-original-imafe3mzc6vs5ta5.jpeg?q=90&crop=false",
    author: "J.K. Rowling",
    genre: "Fantasy",
    publicationDate: "1997-06-26",
    isbn: "978-0-590-35340-3",
    availability: true,
    location: "Aisle 3, Shelf B",
    bio: "Harry Potter and the Sorcerer's Stone follows young Harry, an orphan mistreated by his relatives, who discovers he's a wizard on his eleventh birthday. At Hogwarts School of Witchcraft and Wizardry, he makes friends with Ron and Hermione while unraveling the mystery of the Sorcerer’s Stone. Harry learns of his connection to the dark wizard Lord Voldemort, setting him on a path of courage and friendship. This marks the beginning of his journey into a magical world filled with wonder and danger.",
  };
  return (
    <Flex
      mt={20}
      h="70%"
      width="100%"
      flexDir={{ base: "column", md: "row" }}
      p={4}
      gap={8}
      align={"center"}
    >
      <Flex w={{ base: "100%", md: "35%" }} justify={{base:"center", md:"right"}}>
        <Image
          src={book.coverPage}
          alt={`${book.title} cover`}
          height="450px"
          objectFit="cover"
          borderRadius="md"
        />
      </Flex>
      <Flex
        w={{ base: "100%", md: "50%" }}
        display={"flex"}
        flexDirection={"column"}
        gap={2}
      >
        <Heading size="lg">{book.title}</Heading>
        <Text fontSize="md" color="gray.600">
          Book ID: {book.bookId}
        </Text>
        <Text fontSize="md">Author: {book.author}</Text>
        <Text fontSize="md">Released On: {book.publicationDate}</Text>
        <Text fontSize="md">Genre: {book.genre}</Text>
        <Text fontSize="md">Location: {book.location}</Text>
        <Text fontSize="md" color={book.availability ? "green.500" : "red.500"}>
          {book.availability ? "Available" : "Unavailable"}
        </Text>
        <Button
          color={book.availability ? "white" : "white"}
          bg={book.availability ? "green.500" : "red.300"}
          _hover={{ bg: book.availability ? "green.600" : "red.400" }}
        //   _disabled={{ bg: "gray.300", cursor: "not-allowed" }}
          isDisabled={!book.availability}
        >
          CHECK IN
        </Button>
        <Box mt={4}>
          <Text fontSize="md" lineHeight="1.6">
            {book.bio}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default BookPage;
