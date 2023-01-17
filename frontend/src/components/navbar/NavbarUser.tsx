import React, { useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { PieChart, Settings, User } from "react-feather";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import useAuth from "../../hooks/useAuth";
import { logout, selectCurrentUser } from "../../redux/slices/authSlice";
import { useGetUserByIdQuery, useGetUsersQuery } from "../../redux/slices/userApiSlice";

const NavbarUser = () => {
  // const { signOut } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  //const { data: user, isLoading: isLoadingUser, isSuccess: isSuccessUser, isError: isErrorUser, error: errorUser } = useGetUserByIdQuery()

  useEffect(() => {

  }, [user])

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Dropdown className="nav-item" align="end">
      <span className="d-inline-block d-sm-none">
        <Dropdown.Toggle as="a" className="nav-link">
          <Settings size={18} className="align-middle" />
        </Dropdown.Toggle>
      </span>
      <span className="d-none d-sm-inline-block">
        <Dropdown.Toggle as="a" className="nav-link">
          {/* <img
            src={avatar1}
            className="avatar img-fluid rounded-circle me-1"
            alt={`${user && user.firstName} ${user && user.lastName}`}
          /> */}
          <User className="avatar img-fluid rounded-circle me-1" />
          <span className="text-dark">{user && user.firstName} {user && user.lastName}</span>
        </Dropdown.Toggle>
      </span>
      <Dropdown.Menu>
        {/* <Dropdown.Item>
          <Link to="/account" style={{ textDecoration: 'none', color: "inherit" }}>
            <User size={18} className="align-middle me-2" />
            Profile
          </Link>
        </Dropdown.Item>
        <Dropdown.Divider /> */}
        <Dropdown.Item>
          <Button onClick={handleLogout} size="lg">
            <User size={18} className="align-middle me-2" />
            Sign out
          </Button>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
