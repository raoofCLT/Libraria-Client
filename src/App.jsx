import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import BookPage from "./pages/BookPage";
import UserPage from "./pages/userPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import UpdateBook from "./pages/UpdateBook";
import CreateBook from "./pages/CreateBook";
import UserAdmin from "./pages/UserAdmin";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <>
      <Router>
      {user && <Navbar />}
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/book/:id"
            element={user ? <BookPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/user/:id"
            element={user ? <UserPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/admin"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/book/:id"
            element={user ? <UpdateBook /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/createbook"
            element={user ? <CreateBook /> : <Navigate to="/" />}
          />
          <Route
            path="/admin/user/:id"
            element={user ? <UserAdmin /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
