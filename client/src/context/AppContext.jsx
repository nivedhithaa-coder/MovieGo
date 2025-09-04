import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ---- State ----
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);

  // Persist role in localStorage
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // ---- Save role to server & localStorage ----
  const saveRole = async (selectedRole) => {
    try {
      await axios.post(
        "/api/auth/set-role",
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      setRole(selectedRole);
      localStorage.setItem("role", selectedRole); // persist role
      setShowRoleModal(false);
      toast.success("Role saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save role");
    }
  };

  // ---- Fetch isAdmin ----
  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not authorized to access admin dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---- Fetch Shows ----
  const fetchShows = async () => {
    setLoadingShows(true);
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingShows(false);
    }
  };

  // ---- Effects ----
  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();

      // Show role modal only if role is NOT set and user is not on /loading (Stripe redirect)
      if (!role && !location.pathname.startsWith("/loading")) {
        setShowRoleModal(true);
      }
    }
  }, [user, role, location.pathname]);

  // ---- Context Value ----
  const value = {
    axios,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    loadingShows,
    image_base_url,
    role,
    setRole,
    saveRole,
    showRoleModal,
    setShowRoleModal,
    fetchShows,
    fetchIsAdmin,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
