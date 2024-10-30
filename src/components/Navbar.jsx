import { Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
} from "@chakra-ui/react";
import { IoIosLogOut } from "react-icons/io";
import useLogout from "../hooks/useLogout.js";

const Navbar = () => {
  const { logout, loading } = useLogout();

  return (
    <Flex
      w={"full"}
      h={"65px"}
      bgGradient="linear(to-b, rgba(141, 101, 104, 0.8), rgba(255, 255, 255, 0))"
      justify={"space-between"}
      align={"center"}
      p={4}
    >
      <Link to={"/"}>
        <Flex>
          <Image
            src="https://img.icons8.com/?size=80&id=113798&format=png"
            borderRadius={"50%"}
            objectFit="cover"
            height="40px"
            width="40px"
          />
        </Flex>
      </Link>
      <Flex>
        <InputGroup>
          <Input
            bg="rgb(156, 141, 142)"
            placeholder="Search..."
            size="sm"
            mr={2}
            borderRadius={5}
            width={{ base: "150px", md: "300px" }}
            variant="outline"
          />
          <InputRightElement pr={"20px"} pb={"7px"}>
            <Search2Icon cursor={"pointer"} />
          </InputRightElement>
        </InputGroup>
        <Button
          bg="rgb(156, 141, 142)"
          size={"sm"}
          w={10}
          h={30}
          onClick={logout}
          isLoading={loading}
        >
          <IoIosLogOut />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
