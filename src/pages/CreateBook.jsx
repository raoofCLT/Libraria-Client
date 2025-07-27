import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const CreateBook = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const showToast = useShowToast();
  const [inputs, setInputs] = useState({
    title: "",
    author: "",
    coverPage: "",
    genre: "",
    bio: "",
    publicationDate: "",
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result);
        setCoverUrl("");
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImageUrl(null);
    }
  };

  const handleUrlChange = (e) => {
    setCoverUrl(e.target.value);
    setImageUrl(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    const coverPageValue = coverUrl || imageUrl;
    if (!coverPageValue) {
      showToast(
        "Error",
        "Please provide a cover image by uploading a file or entering a URL.",
        "error"
      );
      setCreating(false);
      return;
    }

    const updatedInputs = { ...inputs, coverPage: coverPageValue };
    try {
      const { title, author, publicationDate, genre } = updatedInputs;
      if (!title || !author || !genre || !publicationDate) {
        showToast("Error", "Please fill in all required fields.", "error");
        setCreating(false);
        return;
      }
      const res = await fetch("/api/books/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        setCreating(false);
        return;
      }
      showToast("Success", "Book created successfully!", "success");

      setInputs({
        title: "",
        coverPage: "",
        author: "",
        genre: "",
        publicationDate: "",
        bio: "",
      });
      setImageUrl(null);
      setCoverUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Flex m={5} mt={10}>
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
              {coverUrl || imageUrl ? (
                <Image
                  w={{ base: "300px", md: "300px" }}
                  src={coverUrl || imageUrl}
                  rounded={10}
                  boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                />
              ) : (
                <Skeleton
                  w={{ base: "300px", md: "300px" }}
                  height="200px"
                  bg={"gray.800"}
                  rounded={10}
                />
              )}
            </Center>
            <Center>
              <Button
                w="150px"
                onClick={() => document.getElementById("file-input").click()}
                boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
                bg={"gray.700"}
                color={"white"}
                _hover={{ bg: "gray.600" }}
              >
                Upload Cover
              </Button>
              <Input
                id="file-input"
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Center>
          </Flex>

          <Flex flex="1" direction="column" w={"80%"} m={2}>
            <Stack spacing={4}>
              <FormControl>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder="Enter cover image URL"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ bg: "gray.600" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                  onChange={handleUrlChange}
                  value={coverUrl}
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder="Title *"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ bg: "gray.600" }}
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
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder="Author *"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ bg: "gray.600" }}
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
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="text"
                  placeholder="Genre *"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ bg: "gray.600" }}
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
              <FormControl isRequired>
                <Input
                  h={"50px"}
                  type="date"
                  placeholder="Published Date"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.300" }}
                  _hover={{ bg: "gray.600" }}
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
                  placeholder="Bio"
                  bg={"gray.700"}
                  border={0}
                  color={"gray.200"}
                  _placeholder={{ color: "gray.400" }}
                  _hover={{ bg: "gray.600" }}
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
              onClick={handleCreate}
              isLoading={creating}
            >
              Create
            </Button>
          </Flex>
        </Stack>
      </form>
    </Flex>
  );
};

export default CreateBook;
