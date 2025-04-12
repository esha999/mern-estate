import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom"; // to see the child of PrivateRouter present in App.jsx

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
