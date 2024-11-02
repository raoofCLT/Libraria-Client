// import { createContext, useContext, useEffect, useState } from "react";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import PropTypes from "prop-types";



// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const user = useRecoilValue(userAtom);


//   useEffect(() => {

//     if (user) {

//       console.log("User logged in:", user);
 
//     } else {
//       console.log("No user logged in.");
//     }
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// AuthProvider.propTypes = {
//     children: PropTypes.node.isRequired,
//   };