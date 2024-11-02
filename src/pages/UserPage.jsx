import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

const UserPage = () => {
  const showToast = useShowToast();
  const [currentBooks, setCurrentBooks] = useState([]);
  const [userUpdate, setUserUpdate] = useState("");
  const [user, setUser] = useRecoilState(userAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileRef = useRef(null);
  const [formVisible, setFormVisible] = useState(false);
  const [inputs, setInputs] = useState({
    name: user.name,
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
          const fetchedBooks = [];
          for (const bookId of userUpdate.currentBooks) {
            const res = await fetch(`/api/books/getbook/${bookId}`);
            const data = await res.json();
            fetchedBooks.push(data);
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            }
          }
          setCurrentBooks(fetchedBooks);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getCurrentBooks();
  }, [showToast, userUpdate, user.currentBooks]);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
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
      return;
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    // handle image with cloudinary
  };

  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Flex flex={{ base: "1", md: "2" }} p={10} gap={6}>
        {currentBooks?.map((book) => (
          <Box
            align={"center"}
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
                justifySelf={"center"}
                h={{ base: "170px", md: "250px" }}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
              />
              <Heading size="xs" mb={2} color={"gray.500"}>
                {book.title}
              </Heading>
            </Box>
            <Button
              mb={2}
              mx={2}
              boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
              bg={"red.500"}
              width={{ base: "85%", md: "92%" }}
            >
              CHECK OUT
            </Button>
          </Box>
        ))}
      </Flex>
      <Button
        m={5}
        onClick={() => setFormVisible(!formVisible)}
      >
        {formVisible ? <FaRegArrowAltCircleRight /> : "Update Profile"}
      </Button>
      {formVisible && (
        <form onSubmit={handleUpdate} style={{ flex: "1" }}>
          <Flex display={"column"} p={2} m={{ base: 5, md: 2 }}>
            <Heading
              lineHeight={1}
              my={3}
              fontSize={{ base: "2xl", sm: "3xl" }}
            >
              Profile Edit
            </Heading>
            <FormControl id="userName">
              <Stack direction={["column", "row"]} spacing={6}>
                <Center mb={1}>
                  <Avatar
                    size="xl"
                    src={user.profilePic}
                    boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                  />
                </Center>
                <Center w="full">
                  <Button
                    w="full"
                    onClick={() => fileRef.current.click()}
                    boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                  >
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
            <Flex display={"column"} m={2}>
              <Stack spacing={4}>
                <FormControl>
                  <Input
                    h={"50px"}
                    type="text"
                    placeholder={inputs.name}
                    bg={"gray.200"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ bg: "gray.200" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    value={inputs.name}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    h={"50px"}
                    type="text"
                    placeholder={inputs.username}
                    bg={"gray.200"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ bg: "gray.200" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
                    onChange={(e) =>
                      setInputs({ ...inputs, username: e.target.value })
                    }
                    value={inputs.username}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    h={"50px"}
                    type="email"
                    placeholder={inputs.email}
                    bg={"gray.200"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ bg: "gray.200" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
                    onChange={(e) =>
                      setInputs({ ...inputs, email: e.target.value })
                    }
                    value={inputs.email}
                  />
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <Input
                      h={"50px"}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      bg={"gray.200"}
                      border={0}
                      mb={4}
                      color={"gray.500"}
                      _placeholder={{ color: "gray.500" }}
                      _hover={{ bg: "gray.200" }}
                      _focus={{
                        borderColor: "red.400",
                        boxShadow: "0 0 0 1px red.400",
                      }}
                      onChange={(e) =>
                        setInputs({ ...inputs, password: e.target.value })
                      }
                      value={inputs.password}
                    />
                    <InputRightElement h={"full"}>
                      <Button variant={"ghost"} mb={3} onClick={togglePassword}>
                        {showPassword ? (
                          <ViewIcon color="gray" />
                        ) : (
                          <ViewOffIcon color="gray" />
                        )}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Stack>
              <Button
                fontFamily={"heading"}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                mt={5}
                h={"50px"}
                w={"full"}
                bg="green.500"
                color="white"
                _hover={{
                  bg: "green.600",
                  boxShadow: "md",
                }}
                type="submit"
                isLoading={updating}
              >
                Update
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </Flex>
  );
};

export default UserPage;
