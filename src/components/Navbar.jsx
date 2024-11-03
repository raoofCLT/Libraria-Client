import { Search2Icon } from "@chakra-ui/icons";
import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import useLogout from "../hooks/useLogout.js";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { TbLayoutDashboard } from "react-icons/tb";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout, loading } = useLogout();
  const user = useRecoilValue(userAtom);
  const [fUser, setFUser] = useState("");
  const showToast = useShowToast();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      if (searchTerm) {
        const res = await fetch(`/api/books/searchbook/${searchTerm}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        const bookId = data[0]._id;
        navigate(`/book/${bookId}`);
        setSearchTerm("");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  useEffect(() => {
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
  }, [showToast, user._id]);

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
        <Link to={"/"}>
          <Image
            src="https://img.icons8.com/?size=80&id=113798&format=png"
            borderRadius={"50%"}
            objectFit="cover"
            height="40px"
            width="40px"
            boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          />
        </Link>
      </Flex>
      <Flex>
        <InputGroup>
          <Input
            placeholder="Search..."
            size="md"
            bg="gray.800"
            color="gray.200"
            width={{ base: "250px", md: "400px", lg: "500px" }}
            variant="outline"
            borderColor="gray.700"
            _hover={{ borderColor: "gray.600" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <InputRightElement pr="1" pb="1">
            <IconButton
              icon={<Search2Icon />}
              color="gray.300"
              bg="transparent"
              aria-label="Search"
              size="sm"
              onClick={handleSearch}
            />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Flex align={"center"} gap={2}>
        {fUser.profilePic ? (
          <Link to={`/user/${user._id}`}>
            {
              <Image
                w={"25px"}
                h={"25px"}
                rounded={"full"}
                src={fUser.profilePic}
              />
            }
          </Link>
        ) : (
          <Link to={`/user/${user._id}`}>
            <FaRegUserCircle size={"24px"} />
          </Link>
        )}
        {fUser?.isAdmin && (
          <Link to={`/admin`}>
            <TbLayoutDashboard size={"25px"} />
          </Link>
        )}
        <Button
          bg="gray.600"
          size={"sm"}
          w={10}
          h={30}
          onClick={logout}
          isLoading={loading}
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
        >
          <IoIosLogOut />
        </Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;
