import React from "react";
import MyLayout from "../layout/Layout";
import axiosApiInstance from "../services/axios";
import { message, Table, Space, Popconfirm, Input } from "antd";
import { API_URL } from "../constants/constants";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { format, set } from "date-fns";
import { auth } from "../services/firebase";

function UsersList() {
  const [messageApi, contextHolder] = message.useMessage();
  const [userDetails, setUserDetails] = React.useState({
    page: 1,
    limit: 100000000,
    search: "",
  });
  const [loading, setLoading] = React.useState(false);

  const users = React.useRef([]);
  const [filteredUsers, setFilteredUsers] = React.useState([]);

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.delete(`${API_URL}/user/${id}`);
      // console.log(res);
      // await auth.deleteUser(id);
      messageApi.success("User deleted successfully");
      getUsers();
    } catch (err) {
      // console.log(err);
      messageApi.error("Unable to delete user");
    }
    setLoading(false);
  };

  const confirm = (e) => {
    deleteUser(e);
  };

  const cancel = (e) => {
    // console.log(e);
  };

  const columns = [
    {
      title: "User Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "User Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Notes Created",
      dataIndex: "notesCount",
      key: "notesCount",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Notes Allowed",
      dataIndex: "notesAllowed",
      key: "notesAllowed",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Subscription Plan",
      dataIndex: "subscriptionDetail",
      key: "subscriptionDetail",
      render: (text) => <p>{text?.planId}</p>,
    },
    {
      title: "Subscription Status",
      dataIndex: "subscriptionDetail",
      key: "subscriptionDetail",
      render: (text) => <p>{text?.status}</p>,
    },
    {
      title: "Joined On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <p>{format(new Date(text), "MM/dd/yyyy")}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/user-detail/${_.userId}`}>Detail</Link>
          <Popconfirm
            title="Delete the user"
            description="Are you sure to delete this user?"
            onConfirm={() => confirm(_.userId)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <p
              style={{
                color: "red",
                cursor: "pointer",
              }}
            >
              Delete
            </p>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `${API_URL}/users?page=${userDetails.page}&limit=${userDetails.limit}&search=${userDetails.search}`
      );
      users.current = res.data;
      setFilteredUsers(res.data);
    } catch (error) {
      // console.log(error);
      messageApi.error(error.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const filtered = users.current.filter((user) => {
      return (
        user.fullName?.toLowerCase().includes(value.toLowerCase()) ||
        user.userId.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
    // console.log(value, "value", users.current, "users.current");
  };
  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {contextHolder}
      <Loading show={loading} />
      <MyLayout currentNav={["2"]}>
        <Input
          placeholder="Search with user name or user id"
          onChange={handleSearch}
          style={{
            marginBottom: "20px",
          }}
        />
        <Table columns={columns} dataSource={filteredUsers} cl />
      </MyLayout>
    </>
  );
}

export default UsersList;
