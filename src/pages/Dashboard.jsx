import { Button, Flex } from "@chakra-ui/react";
import Users from "../components/Users";
import Books from "../components/Books";
import { useState } from "react";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import useShowToast from "../hooks/useShowToast";
// import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [book, setBook] = useState(true);
  // const [userDetails, setUserDetails] = useState(false);
  // const user = useRecoilValue(userAtom)
  // const navigate = useNavigate();
  // const showToast = useShowToast();

  // useEffect(()=>{
  //   const getUserDetails = async () => {
  //     try {
  //       const userRes = await fetch(`/api/users/getuser/${user._id}`);
  //       if (!userRes) {
  //         showToast("Error", "User not found", "error");
  //         return;
  //       }
  //       const userData = await userRes.json();
  //       setUserDetails(userData);
  //     } catch (error) {
  //       showToast("Error", error.message, "error");
  //     }
  //   };
  //   getUserDetails();
  // },[showToast,user._id])

  // useEffect(() => {
  //   if (userDetails.isAdmin) {
  //     navigate('/');
  //   }
  // }, [userDetails.isAdmin, navigate]);


  return (
    <Flex flexDirection={"column"} align={"center"}>
      <Flex gap={2} my={5}>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={book ? "green.500" : ""}
          onClick={() => setBook(!book)}
        >
          USERS
        </Button>
        <Button
          boxShadow="0px 8px 20px rgba(0, 0, 0, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.2)"
          color={!book ? "green.500" : ""}
          onClick={() => setBook(!book)}
        >
          BOOKS
        </Button>
      </Flex>
      {book ? <Users /> : <Books />}
    </Flex>
  );
};

export default Dashboard;
