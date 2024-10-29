import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";



const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error in data:", data.error);
      }
      localStorage.removeItem("user-library");
      setUser(null)
      console.log("done");
    } catch (error) {
      console.log("Error in handleLogout:", error.message);
    }finally{
      setLoading(false)
    }
  };

  return {logout, loading};
};

export default useLogout;
