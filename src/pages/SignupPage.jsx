import {
  // Box,
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
  HStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [showPassword,setShowPassword] = useState(false)
  const navigate = useNavigate()
const [inputs, setInputs] = useState({
  name:"",
  username:"",
  email:"",
  password: "",
})

const togglePassword = () => {
  setShowPassword(!showPassword)
}

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs)
      });
      const data = await res.json()
      if(data.error){
        console.log("Error in data:", data.error)
        return;
      }
      console.log("Signup successful:", data)
      navigate("/")
    } catch (error) {
      console.log("Error in handleSignup:", error);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh" w="100%">
      <Flex
        width={{ base: "90%", md: "70%", lg: "60%" }}
        height="auto"
        borderRadius={20}
        overflow="hidden"
        direction={{ base: "column", md: "row" }}
        border={"solid white 2px"}
        bg={"white"}
      >
        <Image
          borderRadius={20}
          objectFit="cover"
          src="https://payhip.com/cdn-cgi/image/format=auto,width=1500/https://pe56d.s3.amazonaws.com/o_1hi48jdor42o1jb1okn1c441bvsr.png"
          height="auto"
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
          direction="column"
        >
          <Stack spacing={4} width="80%">
            <Heading
              color={"gray.800"}
              textAlign="center"
              fontSize={{ base: "2xl", sm: "3xl", md: "3xl" }}
            >
              Hello Welcome
            </Heading>
            <Text
              mb={7}
              textAlign="center"
              color={"gray.500"}
              fontSize={{ base: "sm", sm: "md" }}
            >
              Sign up to explore a world of books.
            </Text>
            <Stack spacing={4}>
              <HStack>
                <FormControl isRequired>
                  <Input
                    h={"50px"}
                    type="text"
                    placeholder="Full name"
                    bg={"gray.200"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{ color: "gray.500" }}
                    _hover={{ bg: "gray.200" }}
                    _focus={{
                      borderColor: "red.400",
                      boxShadow: "0 0 0 1px red.400",
                    }}
                    onChange={(e)=> setInputs({...inputs,name:e.target.value})}
                    value={inputs.name}
                  />
                </FormControl>
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
                    onChange={(e)=> setInputs({...inputs,username:e.target.value})}
                    value={inputs.username}
                  />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="email"
                  placeholder="Email"
                  bg={"gray.200"}
                  border={0}
                  color={"gray.500"}
                  _placeholder={{ color: "gray.500" }}
                  _hover={{ bg: "gray.200" }}
                  _focus={{
                    borderColor: "red.400",
                    boxShadow: "0 0 0 1px red.400",
                  }}
                  onChange={(e)=> setInputs({...inputs,email:e.target.value})}
                  value={inputs.email}
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
                    onChange={(e)=> setInputs({...inputs,password:e.target.value})}
                    value={inputs.password}
                  />
                  <InputRightElement h={"full"}>
                    <Button variant={"ghost"} onClick={togglePassword}>
                      {showPassword ? <ViewIcon color={"gray"} /> :<ViewOffIcon color={"gray"} />}
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
                bgGradient: "linear(to-r, red.500,pink.500)", // Slightly darker hover effect
                boxShadow: "xl",
              }}
              type="submit"
              onClick={handleSignup}
            >
              Signup
            </Button>
            <Stack pb={2}>
              <Text align={"center"} color={"gray"}>
                Already a user{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SignupPage;
