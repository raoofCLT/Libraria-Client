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
  import { differenceInDays} from "date-fns";
  import { ViewIcon, ViewOffIcon, ChevronLeftIcon } from "@chakra-ui/icons";
  
  const UserPage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBooks, setCurrentBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [inputs, setInputs] = useState({
      name: user?.name,
      profilePic: user?.profilePic,
      username: user?.username,
      email: user?.email,
      password: "",
    });
  
    //Current Books
    useEffect(() => {
      const getCurrentBooks = async () => {
        try {
          if (user.currentBooks) {
            const fetchedBooks = await Promise.all(
              user.currentBooks.map(async (book) => {
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
    }, [showToast, user]);
  
    const calculateDays = (checkInDate) => {
      if (!checkInDate) return "N/A";
      console.log(checkInDate)
      try {
        const daysPassed  = differenceInDays(new Date(), new Date(checkInDate));
        const daysLeft = 10 - daysPassed;
        return daysLeft > 0 ? `Due In: ${daysLeft}d` : daysLeft === 0 ? "Due today" : "Overdue";
      } catch {
        return "Invalid date";
      }
    };
  
    // Read Books
    useEffect(() => {
      const getReadBooks = async () => {
        try {
          if (user.books) {
            const bookPromises = user.books.map(async (bookId) => {
              const res = await fetch(`/api/books/getbook/${bookId}`);
              const data = await res.json();
  
              if (data.error) {
                showToast("Error", data.error, "error");
                return null;
              }
              return data;
            });
  
            const books = await Promise.all(bookPromises);
            const filteredBooks = books.filter((book) => book !== null);
            setReadBooks(filteredBooks);
          }
        } catch (error) {
          showToast("Error", error.message, "error");
        }
      };
      getReadBooks();
    }, [showToast, user]);
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
  
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImageUrl(reader.result);
        };
  
        reader.readAsDataURL(file);
      } else {
        showToast("Invalid file type", "Please select an image file", "error");
        setImageUrl(null);
      }
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      if (!user?._id) {
        showToast("Error", "User data not loaded", "error");
        return;
      }
      setUpdating(true);
      try {
        const res = await fetch(`/api/users/update/${user?._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...inputs,
            profilePic: imageUrl,
          }),
        });
        const data = await res.json();
        console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        localStorage.setItem("user-library", JSON.stringify(data));
        showToast("Success", "Profile updated successfully", "success");
        setUser(data);
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
  
        if (!userData.currentBooks.some((book) => book.bookId === bookId)) {
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
        console.log(currentBooks);
        setCurrentBooks((prevBooks) =>
          prevBooks.filter((book) => book._id !== bookId)
        );
        console.log(currentBooks);
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
  
        {/* Current Books */}
  
        <Flex width={"100%"} p={10} m={5} mt={10} gap={6} justify="center" wrap="wrap">
          {currentBooks?.length > 0 ? (
            currentBooks.map((book, index) => {
              const checkInDate = user.currentBooks[index]?.checkInDate;
              const remainingDays = calculateDays(checkInDate);
  
              return (
                <Box
                  key={book._id}
                  align="center"
                  h={{ base: 290, md: 380 }}
                  w={{ base: "170px", md: "200px" }}
                  p={{ base: "", md: 2 }}
                  rounded="lg"
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                  transition="transform 0.2s ease-in-out"
                  _hover={{ transform: "scale(1.05)" }}
                  bg="gray.800" >
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
                    <Text fontSize={"md"} color="red.300"
                    >
                      {remainingDays}
                    </Text>
                  </Box>
                  <Button
                    mb={2}
                    mx={2}
                    bg={remainingDays === "Overdue" ? "red.500" : "gray.700"}
                   
                    color={remainingDays === "Overdue" ? "white" : "red.500"}
                    width={{ base: "85%", md: "92%" }}
                   _hover={{ bg:remainingDays === "Overdue" ? "red.600" : "gray.600"}}
                    onClick={() => handleCheckOut(book._id)}
                  >
                    CHECK OUT
                  </Button>
                </Box>
              );
            })
          ) : (
            <Flex width="100%" height="300px" justify="center" align="center">
              <Text fontSize="xl" color="gray.500">
                Oops, no books here! Check in books to view them in your library.
              </Text>
            </Flex>
          )}
        </Flex>
  
        <Divider
          borderColor="cyan.300"
          borderWidth="1px"
          my={4}
          width="70%"
          mx="auto"
        />
  
        {/* Books Read */}
  
        <Heading mt={3} textAlign={"center"}>
          Books Read
        </Heading>
  
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
              <Box p={2} align={"center"}  w={"170px"} key={book._id}>
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
            <Flex width="100%" height="300px" justify="center" align="center">
              <Text fontSize="xl" color="gray.500">
                It seems you haven&apos;t tracked any books read. Get started
                today!
              </Text>
            </Flex>
          )}
        </Flex>
  
        {/* Profile Udpdate */}
  
        <Flex position={"absolute"} mt={4} right={0} mr={3}>
          <Button bg={"gray.700"} color={"white"} _hover={{ bg: "gray.600" }} onClick={() => setIsModalOpen(true)}>Update Profile</Button>
        </Flex>
  
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
        >
          <ModalOverlay />
          <ModalContent bg={"gray.800"}>
            <ModalHeader color={"gray.200"} >Profile Edit</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleUpdate}>
              <ModalBody>
                <FormControl mb={4}>
                  <Stack direction={["column", "row"]} spacing={6}>
                    <Center bg={"gray.300"} rounded={"full"} p={0.5} mb={1}>
                      <Avatar size="xl" src={imageUrl || user.profilePic} />
                    </Center>
                    <Center w="full">
                      <Button w="full" onClick={() => fileRef.current.click()} bg={"gray.700"} color={"white"} _hover={{ bg: "gray.600" }}>
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
                    bg={"gray.700"}
                    color={"gray.200"}
                    _placeholder={{ color: "gray.400" }}
                    _hover={{ bg: "gray.600" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
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
                    bg={"gray.700"}
                    color={"gray.200"}
                    _placeholder={{ color: "gray.400" }}
                    _hover={{ bg: "gray.600" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
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
                    bg={"gray.700"}
                    color={"gray.200"}
                    _placeholder={{ color: "gray.400" }}
                    _hover={{ bg: "gray.600" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
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
                      bg={"gray.700"}
                      color={"gray.200"}
                      _placeholder={{ color: "gray.400" }}
                      _hover={{ bg: "gray.600" }}
                      _focus={{
                        borderColor: "red.400",
                        boxShadow: "0 0 0 1px red.400",
                      }}
                      onChange={(e) =>
                        setInputs({ ...inputs, password: e.target.value })
                      }
                    />
                    <InputRightElement>
                      <Button variant="ghost" onClick={togglePassword} color={"white"} _hover={{ bg: "gray.700" }}>
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button bg={"gray.700"} color={"white"} _hover={{ bg: "gray.600" }} type="submit" isLoading={updating}>
                  Update
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Flex>
    );
  };
  
  export default UserPage;
  