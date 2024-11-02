import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  FormControl,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import authScreenAtom from "../atoms/authScreenAtom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error in data:", data.error);
        return;
      }
      localStorage.setItem("user-library", JSON.stringify(data));
      console.log("Login successful:", data);
      setUser(data);
    } catch (error) {
      console.log("Error in handleLogin:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align="center" justify="center" height="90vh" w="100%">
      <Flex
        width={{ base: "90%", md: "70%", lg: "60%" }}
        height="70vh"
        borderRadius={20}
        overflow="hidden"
        direction={{ base: "column", md: "row" }}
        border={"solid white 2px"}
        bg={"white"}
      >
        <Image
          borderRadius={20}
          objectFit="cover"
          src="https://mir-s3-cdn-cf.behance.net/projects/max_808/4b927197194893.Y3JvcCwxMjU5LDk4NSwxNDAsMzE.png"
          height="100%"
          width="50%"
          border={"solid white 10px"}
          display={{ base: "none", md: "block" }}
        />

        <Flex
          width={{ base: "100%", md: "50%" }}
          align="center"
          justify="center"
          bgGradient="linear(to-r, #ffffff, #f4f2f2)"
          p={6}
          borderRadius={20}
          border="2px solid white"
        >
          <Stack spacing={4} width="80%">
            <Heading
              color={"gray.800"}
              textAlign="center"
              fontSize={{ base: "2xl", sm: "3xl", md: "3xl" }}
            >
              Hello Again
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text
              mb={7}
              textAlign="center"
              color={"gray.500"}
              fontSize={{ base: "sm", sm: "md" }}
            >
              Welcome back, you&apos;ve been missed!
            </Text>
            <Stack spacing={4}>
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder="Username"
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
              <FormControl isRequired>
                <InputGroup>
                  <Input
                    h={"50px"}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                      setInputs({ ...inputs, password: e.target.value })
                    }
                    value={inputs.password}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={togglePassword}>
                      {showPassword ? (
                        <ViewIcon color={"gray"} />
                      ) : (
                        <ViewOffIcon color={"gray"} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Stack>
            <Button
              fontFamily={"heading"}
              mt={5}
              h={"50px"}
              w={"full"}
              bgGradient="linear(to-r, red.400,pink.400)"
              color={"white"}
              _hover={{
                bgGradient: "linear(to-r, red.500,pink.500)",
                boxShadow: "xl",
              }}
              type="submit"
              onClick={handleLogin}
              isLoading={loading}
            >
              Login
            </Button>
            <Stack pb={2}>
              <Text align={"center"} color={"gray"}>
                Don&apos;t have an account?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreen("signup")}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LoginPage;
