import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";



const useLogout = () => {
    const setUser = useSetRecoilState(userAtom)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const showToast = useShowToast()

  const logout = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/users/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();
        if (data.error) {
            showToast("Error", data.error, "error");
        } else {
            localStorage.removeItem("user-library");
            setUser(null);
            navigate("/auth");
            showToast("Success", "Logged out successfully", "success");
        }
    } catch (error) {
        showToast("Error", error.message, "error");
    } finally {
        setLoading(false);
    }
};

  return {logout, loading};
};

export default useLogout;
