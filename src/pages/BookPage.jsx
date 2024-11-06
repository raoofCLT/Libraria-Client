import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  IconButton,
  Skeleton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const BookPage = () => {
  const { id: bookId } = useParams();
  const [book, setBook] = useState({});
  const navigate = useNavigate();
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);

  // Get Book
  useEffect(() => {
    const getBook = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/books/getbook/${bookId}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setBook(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
    getBook();
  }, [showToast, bookId]);

  const handleCheckIn = async () => {
    try {
      const res = await fetch(`/api/books/checkin/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkInDate: new Date(),
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", data.message, "success");
      setBook((prevBook) => ({
        ...prevBook,
        available: false,
        checkedIn: true,
        checkInDate: new Date(),
      }));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Flex
        mt={20}
        h="70%"
        width="100%"
        flexDir={{ base: "column", md: "row" }}
        p={4}
        gap={8}
        justify="center"
        align="center"
      >
        <Skeleton rounded={5} h={"450px"} w={"300px"} />
        <Flex
          w={{ base: "100%", md: "50%" }}
          display="flex"
          flexDirection="column"
          gap={5}
          align={{ base: "center", md: "flex-start" }}
        >
          <Skeleton rounded={5} h={"50px"} w={"300px"} />
          {[0, 1, 2, 3, 4].map((_, index) => (
          <Skeleton key={index} rounded={5} h={"10px"} w={"300px"} />
          ))}
          <Skeleton rounded={5} h={"40px"} w={"100px"} />
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      mt={20}
      h="70%"
      width="100%"
      flexDir={{ base: "column", md: "row" }}
      p={4}
      gap={8}
      align="center"
    >
      <IconButton
        aria-label="Go back"
        icon={<ChevronLeftIcon />}
        onClick={handleBack}
        size="sm"
        position="absolute"
        top={75}
        left={4}
      />
      <Flex
        w={{ base: "100%", md: "35%" }}
        justify={{ base: "center", md: "right" }}
      >
        <Image
          src={book.coverPage || "https://via.placeholder.com/150"}
          alt={`${book.title} cover`}
          height="450px"
          objectFit="cover"
          borderRadius="md"
        />
      </Flex>
      <Flex
        w={{ base: "100%", md: "50%" }}
        display="flex"
        flexDirection="column"
        gap={2}
        align={{ base: "center", md: "flex-start" }}
      >
        <Heading size="lg">{book.title}</Heading>
        <Text fontSize="md">Author: {book.author}</Text>
        <Text fontSize="md">Genre: {book.genre}</Text>
        <Text fontSize="md">
          Published On: {book.publicationDate.split("T")[0]}
        </Text>
        <Text fontSize="md">Location: {book.location}</Text>
        <Text fontSize="md">Bio: {book.bio}</Text>
        <Text fontSize="md" color={book.available ? "green.500" : "red.500"}>
          {book.available ? "Available" : "Unavailable"}
        </Text>
        {book.available ? (
          <Button
            color="white"
            bg="green.500"
            _hover={{ bg: "green.600" }}
            onClick={handleCheckIn}
          >
            CHECK IN
          </Button>
        ) : (
          <Button color="white" bg="gray.500" isDisabled>
            Checked In
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default BookPage;
