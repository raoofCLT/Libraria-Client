import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tooltip,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon, ChevronLeftIcon } from "@chakra-ui/icons";

const UserPage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [userUpdate, setUserUpdate] = useState("");
  const [readBooks, setReadBooks] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [inputs, setInputs] = useState({
    name: user.name,
    profilePic:user.profilePic,
    username: user.username,
    email: user.email,
    password: "",
  });

  //User Details
  useEffect(() => {
    const getUserUpdate = async () => {
      try {
        const userRes = await fetch(`/api/users/getuser/${user._id}`);
        if (!userRes) {
          showToast("Error", "User not found", "error");
          return;
        }
        const userData = await userRes.json();
        setUserUpdate(userData);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getUserUpdate();
  }, [showToast, user]);

  //Current Books
  useEffect(() => {
    const getCurrentBooks = async () => {
      try {
        if (userUpdate.currentBooks) {
          const fetchedBooks = await Promise.all(
            userUpdate.currentBooks.map(async (book) => {
              const res = await fetch(`/api/books/getbook/${book.bookId}`);
              return await res.json();
            })
          );
          setCurrentBooks(fetchedBooks);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getCurrentBooks();
  }, [showToast, userUpdate]);

 // Read Books
  useEffect(() => {
    const getReadBooks = async () => {
      try {
        if (userUpdate.books) {
 
          const bookPromises = userUpdate.books.map(async (bookId) => {
            const res = await fetch(`/api/books/getbook/${bookId}`);
            const data = await res.json(); 
  
            if (data.error) {
              showToast("Error", data.error, "error");
              return null; 
            }
            return data;
          });

        const books = await Promise.all(bookPromises);
        const filteredBooks = books.filter(book => book !== null);
          setReadBooks(filteredBooks);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getReadBooks();
  }, [showToast, userUpdate]);

  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setInputs((prevInputs) => ({ ...prevInputs, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const updatedInputs = { ...inputs, profilePic: imageUrl || inputs.profilePic };
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedInputs),
      });
      
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-library", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
      setIsModalOpen(false);
    }
  };
  
  const handleCheckOut = async (bookId) => {
    try {
      const dbUser = await fetch(`/api/users/getuser/${user._id}`);
      if (!dbUser.ok) {
        showToast("Error", "User not found", "error");
        return;
      }
      const userData = await dbUser.json();
      
      if (!userData.currentBooks.some(book => book.bookId === bookId)) {
        showToast("Error", "Check in this book first", "error");
        return;
      }
  
      const res = await fetch(`/api/books/checkout/${bookId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
  
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
  
      showToast("Success", data.message, "success");

 setCurrentBooks((prevBooks) => prevBooks.filter(book => book.bookId !== bookId));   
 
 } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleBack = () => navigate(-1);

  return (
    <Flex direction="column" mx={4}>
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
    width={"100%"}
    p={10}
    m={5}
    mt={10}
    gap={6}
    justify="center"
    wrap="wrap"
  >
    {currentBooks?.length > 0 ? (
      currentBooks.map((book) => (
        <Box
          key={book._id}
          align="center"
          h={{ base: 270, md: 370 }}
          w={{ base: "170px", md: "200px" }}
          p={{ base: "", md: 2 }}
          rounded="lg"
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          transition="transform 0.2s ease-in-out"
          _hover={{ transform: "scale(1.05)" }}
          bg="gray.800"
        >
          <Box p={2}>
            <Image
              src={book.coverPage || "https://via.placeholder.com/150"}
              alt={book.title || "Book cover"}
              borderRadius="md"
              mb={2}
              objectFit="cover"
              h={{ base: "170px", md: "250px" }}
            />
            <Tooltip label={book.title}>
              <Heading
                size="xs"
                mb={2}
                color="gray.300"
                isTruncated
                maxWidth="150px"
              >
                {book.title}
              </Heading>
            </Tooltip>
          </Box>
          <Button
            mb={2}
            mx={2}
            bg="red.500"
            color="white"
            width={{ base: "85%", md: "92%" }}
            _hover={{ bg: "red.600" }}
            onClick={() => handleCheckOut(book._id)}
          >
            CHECK OUT
          </Button>
        </Box>
      ))
    ) : (
      <Flex
      width="100%"
      height="300px"
      justify="center"
      align="center"
    >
      <Text fontSize="xl" color="gray.500">
      Oops, no books here! Check in books to view them in your library.
      </Text>
    </Flex>
    )}
  </Flex>
      <Flex position={"absolute"} mt={4} right={0} mr={3}>
        <Button onClick={() => setIsModalOpen(true)}>Update Profile</Button>
      </Flex>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Edit</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleUpdate}>
            <ModalBody>
              <FormControl mb={4}>
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center mb={1}>
                    <Avatar size="xl" src={imageUrl || userUpdate.profilePic} />
                  </Center>
                  <Center w="full">
                    <Button w="full" onClick={() => fileRef.current.click()}>
                      Change Avatar
                    </Button>
                    <Input
                      type="file"
                      hidden
                      ref={fileRef}
                      onChange={handleImageChange}
                    />
                  </Center>
                </Stack>
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  value={inputs.name}
                  onChange={(e) =>
                    setInputs({ ...inputs, name: e.target.value })
                  }
                  mb={3}
                />
              </FormControl>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Username"
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                  }
                  mb={3}
                />
              </FormControl>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                  }
                  mb={3}
                />
              </FormControl>
              <FormControl id="password">
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={inputs.password}
                    onChange={(e) =>
                      setInputs({ ...inputs, password: e.target.value })
                    }
                  />
                  <InputRightElement>
                    <Button variant="ghost" onClick={togglePassword}>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={updating}
              >
                Update
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

<Divider
      borderColor="cyan.300"
      borderWidth="1px"
      my={4}
      width="70%"
      mx="auto"
/>

<Heading mt={3} textAlign={"center"}>Books Read</Heading>

      <Flex
    width={{ base: "100%", md: "100%" }}
    p={10}
    ml={3}
    gap={6}
    justify="left"
    wrap="wrap"
  >
    {readBooks?.length > 0 ? (
      readBooks.map((book) => (
          <Box p={2} align={"center"} key={book._id}>
            <Image
              src={book.coverPage || "https://via.placeholder.com/150"}
              alt={book.title || "Book cover"}
              borderRadius="md"
              mb={2}
              objectFit="cover"
              h={{ base: "160px", md: "240px" }}
            />
            <Tooltip label={book.title}>
              <Heading
                size="xs"
                mb={2}
                color="gray.400"
                isTruncated
                maxWidth="150px"
              >
                {book.title}
              </Heading>
            </Tooltip>
          </Box>
      ))
    ) : (
      <Flex
      width="100%"
      height="300px"
      justify="center"
      align="center"
    >
      <Text fontSize="xl" color="gray.500">
      It seems you haven&apos;t tracked any books read. Get started today!
      </Text>
    </Flex>
    )}
  </Flex>
    </Flex>
  );
};

export default UserPage;
