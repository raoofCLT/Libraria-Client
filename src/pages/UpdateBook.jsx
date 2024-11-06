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
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const UpdateBook = () => {
  const [book, setBook] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [inputs, setInputs] = useState({
    title: "",
    coverPage: "",
    author: "",
    genre: "",
    publicationDate: "",
    bio: "",
  });
  const showToast = useShowToast();
  const { id: bookId } = useParams();
  const fileRef = useRef(null);
  const navigate = useNavigate();

  //Get Book
  useEffect(() => {
    const getBook = async () => {
      setLoading(true);
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
        setImageUrl(data.coverPage);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getBook();
  }, [showToast, bookId]);

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", "Please select an image file", "error");
      setImageUrl(null);
    }
  };

  // Handle book update
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
        body: JSON.stringify({
          ...inputs,
          coverPage: imageUrl,
        }),
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
    } finally {
      setUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Flex direction="column" align="center" p={5}>
      {loading ? (
        <Flex
          mt={20}
          h="70%"
          width="100%"
          flexDir={{ base: "column", md: "row" }}
          p={4}
          gap={8}
          justify="center"
          align="center"
        >
          <Skeleton rounded={10} h="400px" w="250px" />
          <Flex
            w={{ base: "100%", md: "50%" }}
            flexDirection="column"
            gap={5}
            align={{ base: "center", md: "flex-start" }}
          >
            {[0, 1, 2, 3, 4].map((_, index) => (
              <Skeleton key={index} rounded={5} h="50px" w="300px" />
            ))}
          </Flex>
        </Flex>
      ) : (
        <>
          <IconButton
            aria-label="Go back"
            icon={<ChevronLeftIcon />}
            onClick={handleBack}
            size="sm"
            position="absolute"
            top={75}
            left={4}
          />
          <form style={{ flex: "1" }} onSubmit={handleUpdate}>
            <Stack
              spacing={5}
              direction={{ base: "column", md: "row" }}
              p={2}
              m={{ base: 5, md: 2 }}
              align="center"
            >
              <Flex direction="column" flex="1" alignItems="center">
                <Center m={10}>
                  <Image
                    w="400px"
                    src={imageUrl || inputs.coverPage}
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
                    onChange={handleImageChange}
                  />
                </Center>
              </Flex>

              <Flex flex="1" direction="column"  m={2}>
                <Stack spacing={4}>
                  <FormControl>
                    <Input
                      h="50px"
                      type="text"
                      placeholder="Enter book title"
                      bg="gray.200"
                      border={0}
                      color="gray.500"
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
                        setInputs({
                          ...inputs,
                          publicationDate: e.target.value,
                        })
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
        </>
      )}
    </Flex>
  );
};

export default UpdateBook;
