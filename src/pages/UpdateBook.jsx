import {
  Button,
  Center,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const UpdateBook = () => {
  const [book, setBook] = useState(null);
  const showToast = useShowToast();
  const { id: bookId } = useParams();
  const [updating, setUpdating] = useState(false);
  const fileRef = useRef(null);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    coverPage: "",
    author: "",
    genre: "",
    publicationDate: "",
    bio: "",
  });

  //Get Book
  useEffect(() => {
    const getBook = async () => {
      try {
        const res = await fetch(`/api/books/getbook/${bookId}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setBook(data);
        setInputs({
          title: data.title,
          coverPage: data.coverPage,
          author: data.author,
          genre: data.genre,
          publicationDate: data.publicationDate,
          bio: data.bio,
        });
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getBook();
  }, [showToast, bookId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!book) {
      showToast("Error", "Book not found", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/books/update/${book._id}`, {
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
      showToast("Success", "Book updated successfully", "success");
      setBook(data);
      setInputs({
        title: data.title || inputs.title,
        coverPage: data.coverPage || inputs.coverPage,
        author: data.author || inputs.author,
        genre: data.genre || inputs.genre,
        publicationDate: data.publicationDate || inputs.publicationDate,
        bio: data.bio || inputs.bio,
      });
    } catch (error) {
      showToast("Error", error.message, "error");
      return;
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Flex>
      <IconButton
        aria-label="Go back"
        icon={<ChevronLeftIcon />}
        onClick={handleBack}
        size="sm"
        position="absolute"
        top={75}
        left={4}
      />
      <form style={{ flex: "1" }}>
        <Stack
          spacing={5}
          direction={{ base: "column", md: "row" }}
          p={2}
          m={{ base: 5, md: 2 }}
          align={"center"}
        >
          <Flex direction="column" flex="1" alignItems="center">
            <Center m={5}>
              <Image
                w={{ base: "300px", md: "300px" }}
                src={inputs.coverPage}
                rounded={10}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
              />
            </Center>
            <Center>
              <Button
                w="150px"
                onClick={() => fileRef.current.click()}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
              >
                Change Cover
              </Button>
              <Input
                type="file"
                hidden
                ref={fileRef}
                // onChange={handleImageChange}
              />
            </Center>
          </Flex>

          <Flex flex="1" direction="column" w={"80%"} m={2}>
            <Stack spacing={4}>
              <FormControl>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder={inputs.title}
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
                    setInputs({ ...inputs, title: e.target.value })
                  }
                  value={inputs.title}
                />
              </FormControl>
              <FormControl>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder={inputs.author}
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
                    setInputs({ ...inputs, author: e.target.value })
                  }
                  value={inputs.author}
                />
              </FormControl>
              <FormControl>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder={inputs.genre}
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
                    setInputs({ ...inputs, genre: e.target.value })
                  }
                  value={inputs.genre}
                />
              </FormControl>
              <FormControl>
                <Input
                  h={"50px"}
                  type="date"
                  placeholder={inputs.publicationDate}
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
                    setInputs({ ...inputs, publicationDate: e.target.value })
                  }
                  value={inputs.publicationDate}
                />
              </FormControl>
              <FormControl>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder={inputs.bio}
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
                    setInputs({ ...inputs, bio: e.target.value })
                  }
                  value={inputs.bio}
                />
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
              type="button"
              onClick={handleUpdate}
              isLoading={updating}
            >
              Update
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
};

export default UpdateBook;
