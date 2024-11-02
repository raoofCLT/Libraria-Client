import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const BookPage = () => {
  const { id: bookId } = useParams();
  const [book, setBook] = useState({});
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(true);


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


  const handleCheckInOut = async () =>{
    if(book.available){

      //Check In
      try{
        const res = await fetch(`/api/books/checkin/${bookId}`,{
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          }
        })
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        
        showToast("Success", data.message, "success");
        setBook((prevBook) => ({ ...prevBook, available: false }));
      } catch (error) {
        showToast("Error", error.message, "error");
      } 
      //CheckOut
    }else{
      try{
        const dbUser = await fetch(`/api/users/getuser/${user._id}`);
        if (!user) {
          showToast("Error", "User not found", "error");
          return
        }
        const userData = await dbUser.json();

        if (userData.currentBooks.includes(bookId)) {
          const res = await fetch(`/api/books/checkout/${bookId}`,{
            method: "POST",
            headers: {
              "Content-Type":"application/json"
            }
          })
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          
          showToast("Success", data.message, "success");
          setBook((prevBook) => ({ ...prevBook, available: true }));
        }
        showToast("Error","Check in this book first","error")
      } catch (error) {
        showToast("Error", error.message, "error");
      } 
    }
  }

  if (isLoading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size="xl" />
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
        align={{base:"center" ,md:"flex-start"}}
      >
        <Heading size="lg">{book.title}</Heading>
        <Text fontSize="md">Author: {book.author}</Text>
        <Text fontSize="md">Released On: {book.publicationDate}</Text>
        <Text fontSize="md">Genre: {book.genre}</Text>
        <Text fontSize="md">Location: {book.location}</Text>
        <Text fontSize="md">Bio: {book.bio}</Text>
        <Text fontSize="md" color={book.available ? "green.500" : "red.500"}>
          {book.available ? "Available" : "Unavailable"}
        </Text>
        <Button
          color="white"
          bg={book.available ? "green.500" : "red.500"}
          _hover={{ bg: book.available ? "green.600" : "red.400" }}
          
          onClick={handleCheckInOut}
        >
          {book.available ? "CHECK IN" : "CHECK OUT"}
        </Button>
      </Flex>
    </Flex>
  );
};

export default BookPage;
