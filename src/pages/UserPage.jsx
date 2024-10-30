import {
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

const UserPage = () => {
  const books = [
    {
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
    },
    {
      bookId: "B008",
      title: "The Odyssey",
      coverPage:
        "https://cdn.kobo.com/book-images/1c003baf-c48d-45be-9fd3-bc9c2bc6a685/1200/1200/False/the-odyssey-172.jpg",
      author: "Homer",
      genre: "Epic",
      publicationDate: "800-01-01",
      isbn: "978-0-14-026886-7",
      availability: true,
      location: "Aisle 3, Shelf B",
      bio: "Homer’s timeless epic follows Odysseus’s long journey home after the Trojan War.",
    },
  ];
  return (
    <Flex>
        <Flex width={"70%"} p={10} gap={6}>
      {books.map((book)=> (
        <Card  key={book.bookId} w={"200px"} boxShadow="lg">
          <CardBody>
            <Image
              src={book.coverPage || "https://via.placeholder.com/150"}
              alt={book.title || "Book cover"}
              borderRadius="md"
              mb={4}
              objectFit="cover"
              height="250px"
            />
            <Heading size="xs" color={"gray.500"}>
              {book.title}
            </Heading>
            <Text mt={1} >21-5-2025</Text>
            <Text color={"red"}>2 days</Text>
          </CardBody>
        <Button mb={2} mx={2} width={"92%"}>
          CHECK OUT
        </Button>
        </Card>
      ))}
      </Flex>
    </Flex>
  );
};

export default UserPage;
