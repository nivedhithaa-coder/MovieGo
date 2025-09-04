// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth, useUser } from "@clerk/clerk-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [shows, setShows] = useState([]);

//   const image_base_url=import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

//   const { user } = useUser();
//   const { getToken } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const fetchIsAdmin = async () => {
//     try {
//       const { data } = await axios.get("/api/admin/is-admin", {
//         headers: {
//           Authorization: `Bearer ${await getToken()}`,
//         },
//       });
//       setIsAdmin(data.isAdmin);
//       if (!data.isAdmin && location.pathname.startsWith("/admin")) {
//         navigate("/");
//         toast.error("You are not authorized to access admin dashboard");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchShows = async () => {
//     try {
//       const { data } = await axios.get("/api/show/all");
//       if (data.success) {
//         setShows(data.shows);
        
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchShows();
//   }, []);

//   useEffect(() => {
//     if (user) {
//       fetchIsAdmin();
//     }
//   }, [user]);
//   const value = {
//     axios,
//     fetchIsAdmin,
//     user,
//     getToken,
//     navigate,
//     isAdmin,
//     shows,image_base_url
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

//export const useAppContext = () => useContext(AppContext);
// import { createContext, useContext, useState, useEffect } from "react";
// import { useUser, useAuth } from "@clerk/clerk-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const { user, getToken } = useUser();
//   const auth = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [role, setRole] = useState(null);
//   const [showRoleModal, setShowRoleModal] = useState(false);

//   axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

//   const saveRole = async (selectedRole) => {
//     try {
//       await axios.post("/api/auth/set-role", { role }, {
//         headers: {
//           Authorization: `Bearer ${await getToken()}`,
//         },
//       });
      
//       setRole(selectedRole);
//       setShowRoleModal(false);
//       toast.success("Role saved successfully");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save role");
//     }
//   };

//   useEffect(() => {
//     if (user && !role) {
//       setShowRoleModal(true);
//     }
//   }, [user, role]);

//   return (
//     <AppContext.Provider
//       value={{
//         role,
//         setRole,
//         saveRole,
//         showRoleModal,
//         setShowRoleModal,
//         axios,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => useContext(AppContext);
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
  const [role, setRole] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  // ---- Save role to Clerk ----
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
      if (!role) setShowRoleModal(true); // popup only when role not set
    }
  }, [user, role]);

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
