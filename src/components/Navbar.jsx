import {
  Flex,
  Image,
  Input,
  InputGroup,
  Button,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import useLogout from "../hooks/useLogout.js";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import { TbLayoutDashboard } from "react-icons/tb";
import { useEffect, useState, useCallback } from "react";
import useShowToast from "../hooks/useShowToast.js";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { logout, loading } = useLogout();
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const location = useLocation();
  const path = location.pathname;

  const handleSearch = useCallback(
    async (term) => {
      if (!term) {
        setSearchResults([]);
        return;
      }

      try {
        const endpoint =
          path === "/admin/allusers"
            ? `/api/users/searchuser/${term}`
            : `/api/books/searchbook/${term}`;
        const res = await fetch(endpoint);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setSearchResults(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    },
    [path, showToast]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  return (
    <Flex
      w="full"
      h="70px"
      bg="rgba(48, 48, 48, 0.8)"
      backdropFilter="blur(8px)"
      justify="space-between"
      align="center"
      px={6}
      py={4}
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.3)"
      borderBottom="1px solid rgba(255, 255, 255, 0.1)"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex align="center">
        <Link to={"/"}>
          <Image
            src="https://img.icons8.com/?size=80&id=113798&format=png"
            borderRadius="50%"
            height="45px"
            width="45px"
            boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3)"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.1)" }}
          />
        </Link>
      </Flex>
      <Flex flex="1" justify="center" position="relative">
        <InputGroup maxW="500px" mx={4}>
          <Input
            placeholder={
              path === "/admin/allusers"
                ? "Search for users..."
                : "Search for books..."
            }
            size="md"
            bg="gray.700"
            rounded="full"
            color="whiteAlpha.900"
            borderColor="transparent"
            _hover={{ borderColor: "purple.500" }}
            _focus={{
              borderColor: "purple.400",
              boxShadow: "0 0 8px 2px rgba(128, 90, 213, 0.5)",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </InputGroup>
      </Flex>
      <Flex
        position="absolute"
        top={"100%"}
        left="50%"
        transform="translateX(-50%)"
        flexDirection={"column"}
        width="100%"        
        maxWidth={{base:"300px",md:"700px"}}     
        minWidth="50px"     
        maxHeight="300px"
        bg="gray.700"
        zIndex="2000"
        borderRadius="md"
        boxShadow="lg"
        overflowY="auto"
        overflowX="hidden"
      >
        {searchResults.length > 0 &&
          searchResults.map((result) => (
            <Link
              key={result._id}
              to={
                path === "/admin/allusers"
                  ? `/admin/user/${result._id}`
                  : `/book/${result._id}`
              }
              onClick={() => setSearchTerm("")}
            >
              <Flex
                alignItems="center"
                p={2}
                rounded={5}
                _hover={{ bg: "gray.600", transform: "scale(1.01)" }}
              >
                <Image
                  src={
                    path === "/admin/allusers"
                      ? result.profilePic ||
                        "https://img.icons8.com/?size=80&id=113798&format=png"
                      : result.coverPage ||
                        "https://img.icons8.com/?size=80&id=113798&format=png"
                  }
                  borderRadius="50%"
                  w={10}
                  h={10}
                  mr={2}
                />
                <Text color="white" fontSize="lg">
                  {path === "/admin/allusers" ? result.name : result.title}
                </Text>
              </Flex>
            </Link>
          ))}
      </Flex>
      <Flex align={"center"} gap={4}>
        {user?.profilePic ? (
          <Tooltip label={user?.name} placement="bottom">
            <Link to={`/user/${user._id}`}>
              <Image
                w="35px"
                h="35px"
                rounded="full"
                src={user.profilePic}
                boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{
                  transform: "scale(1.1)",
                  boxShadow: "0 0 15px rgba(128, 90, 213, 0.4)",
                }}
              />
            </Link>
          </Tooltip>
        ) : (
          <Link to={`/user/${user?._id}`}>
            <FaRegUserCircle size={"24px"} />
          </Link>
        )}
        {user?.isAdmin && (
          <Tooltip label="Dashboard" placement="bottom">
            <Link to={"/admin/allusers"}>
              <TbLayoutDashboard
                size="30px"
                color="whiteAlpha.900"
                cursor="pointer"
                _hover={{
                  color: "purple.400",
                  transform: "scale(1.1)",
                }}
                transition="transform 0.2s"
              />
            </Link>
          </Tooltip>
        )}
        <Tooltip label="Logout" placement="bottom">
          <Button
            bg="gray.700"
            color="white"
            size="sm"
            rounded="full"
            w="35px"
            h="35px"
            onClick={logout}
            isLoading={loading}
            boxShadow="0px 4px 12px rgba(0, 0, 0, 0.3)"
            _hover={{ bg: "gray.600", transform: "scale(1.1)" }}
          >
            <IoIosLogOut size="25px" />
          </Button>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Navbar;
