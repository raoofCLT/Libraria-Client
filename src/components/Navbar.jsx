import { Search2Icon } from "@chakra-ui/icons";
import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import useLogout from "../hooks/useLogout.js";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { TbLayoutDashboard } from "react-icons/tb";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";

const Navbar = () => {
  const { logout, loading } = useLogout();
  const user = useRecoilValue(userAtom);
  const [fUser,setFUser] = useState("")
  const showToast = useShowToast()

  useEffect(()=>{
    const getUser = async () => {
      try {
        const userRes = await fetch(`/api/users/getuser/${user._id}`);
        if (!userRes) {
          showToast("Error", "User not found", "error");
          return;
        }
        const userData = await userRes.json();
        setFUser(userData);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getUser();
  },[showToast,user._id])

  return (
    <Flex
      w={"full"}
      h={"65px"}
      bgGradient="linear(to-b, rgba(141, 101, 104, 0.8), rgba(255, 255, 255, 0))"
      justify={"space-between"}
      align={"center"}
      p={4}
    >
      <Flex>
        <a href="/">
          <Image
            src="https://img.icons8.com/?size=80&id=113798&format=png"
            borderRadius={"50%"}
            objectFit="cover"
            height="40px"
            width="40px"
             boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          />
        </a>
      </Flex>
      <Flex>
        <InputGroup>
          <Input
            bg="rgb(156, 141, 142)"
            placeholder="Search..."
            size="sm"
            mr={2}
            borderRadius={5}
            width={{ base: "250px", md: "400px", lg: "500px" }}
            variant="outline"
             boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          />
          <InputRightElement  pr={"20px"} pb={"7px"}>
            <Search2Icon  cursor={"pointer"} />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Flex align={"center"} gap={2}>
        <a href={`/user/${user._id}`}>
          <FaRegUserCircle size={"20px"} />
        </a>
        {fUser?.isAdmin && (
          <a href={`/admin`}>
            <TbLayoutDashboard size={"20px"} />
          </a>
        )}
        <Button
          bg="gray.600"
          size={"sm"}
          w={10}
          h={30}
          variant={"ghost"}
          onClick={logout}
          isLoading={loading}
           boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
        >
          <IoIosLogOut  />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
