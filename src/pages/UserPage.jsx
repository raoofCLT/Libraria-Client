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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon, ChevronLeftIcon } from "@chakra-ui/icons";

const UserPage = () => {
  const showToast = useShowToast();
  const [currentBooks, setCurrentBooks] = useState([]);
  const [userUpdate, setUserUpdate] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputs, setInputs] = useState({
    name: user.name,
    profilePic:user.profilePic,
    username: user.username,
    email: user.email,
    password: "",
  });

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

  useEffect(() => {
    const getCurrentBooks = async () => {
      try {
        if (userUpdate.currentBooks) {
          const fetchedBooks = await Promise.all(
            userUpdate.currentBooks.map(async (bookId) => {
              const res = await fetch(`/api/books/getbook/${bookId}`);
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

  const togglePassword = () => setShowPassword(!showPassword);

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
      if (!dbUser) {
        showToast("Error", "User not found", "error");
        return;
      }
      const userData = await dbUser.json();

      if (!userData.currentBooks.includes(bookId)) {
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
      setCurrentBooks((prevBooks) => prevBooks.filter(book => book._id !== bookId));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <Flex direction={{ base: "column", md: "row" }} mx={4}>
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
        width={{ base: "100%", md: "80%" }}
        p={10}
        m={5}
        gap={6}
        justify="center"
      >
        {currentBooks?.map((book) => (
          <Box
            align="center"
            key={book._id}
            h={{ base: 270, md: 370 }}
            w={{ base: "170px", md: "200px" }}
            p={{ base: "", md: "2" }}
            rounded={10}
            boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
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
                  color="gray.500"
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
              width={{ base: "85%", md: "92%" }}
              onClick={()=>{handleCheckOut(book._id)}}
            >
              CHECK OUT
            </Button>
          </Box>
        ))}
      </Flex>
      <Flex ml="auto" mt={5} >
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
                    <Avatar size="xl" src={imageUrl || user.profilePic} />
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
    </Flex>
  );
};

export default UserPage;
