import { useContext, useEffect, useState } from "react";
import { userAuthorContextObj } from "../../contexts/userAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Set user basic info into context without overwriting role
  useEffect(() => {
    if (isLoaded && user) {
      setCurrentUser((prev) => ({
        ...prev,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.emailAddresses[0].emailAddress,
        profileImageUrl: user?.imageUrl,
      }));
    }
  }, [isLoaded]);

  // Handle role selection
  async function onSelectRole(e) {
    setError("");
    const selectedRole = e.target.value;
    const updatedUser = { ...currentUser, role: selectedRole };

    try {
      let res = null;

      if (selectedRole === "author") {
        res = await axios.post("http://localhost:3000/author-api/author", updatedUser);
      } else {
        res = await axios.post("http://localhost:3000/user-api/user", updatedUser);
      }

      const { message, payload } = res.data;

      if (message === selectedRole) {
        setCurrentUser({ ...updatedUser, ...payload });
      } else {
        setError(message);
      }
    } catch (err) {
      console.error("Axios error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  // Navigate based on role after it's updated
  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser?.role, error]);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: "720px" }}>
        {!isSignedIn && (
          <div className="bg-light p-4 rounded shadow-sm text-secondary">
            <h2 className="mb-3 text-center text-dark">Welcome to the Platform</h2>
            <p className="lead">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia deleniti dicta voluptatem? Possimus odit temporibus ipsum pariatur repudiandae...
            </p>
            <p className="lead">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, accusantium...
            </p>
            <p className="lead">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Praesentium, ab minus...
            </p>
          </div>
        )}

        {isSignedIn && (
          <div className="bg-white p-4 rounded shadow">
            <div className="text-center mb-4">
              <img
                src={user.imageUrl}
                alt="Profile"
                width="100"
                height="100"
                className="rounded-circle border border-3"
              />
              <h3 className="mt-3 mb-1">{user.firstName} {user.lastName}</h3>
              <p className="text-muted">{user.emailAddresses[0].emailAddress}</p>
            </div>

            <div className="text-center">
              <p className="fw-bold mb-2">Choose your role</p>
              {error.length !== 0 && (
                <p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }}>{error}</p>
              )}
              <div className="d-flex justify-content-center gap-4">
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="author"
                    id="author"
                    onChange={onSelectRole}
                  />
                  <label htmlFor="author" className="form-check-label">
                    Author
                  </label>
                </div>

                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="role"
                    value="user"
                    id="user"
                    onChange={onSelectRole}
                  />
                  <label htmlFor="user" className="form-check-label">
                    User
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
