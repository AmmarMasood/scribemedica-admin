import React from "react";
import MyLayout from "../layout/Layout";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { message, Button, Popconfirm } from "antd";
import axiosApiInstance from "../services/axios";
import { API_URL } from "../constants/constants";
import { auth } from "../services/firebase";

function UserDetail() {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [subscriptionDetails, setSubscriptionDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getUser();
  }, []);

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.delete(`${API_URL}/user/${id}`);
      // delete user from firebase
      // await auth.deleteUser(id);
      // console.log(res);
      messageApi.success("User deleted successfully");
      navigate("/user-list");
    } catch (err) {
      // console.log(err);
      messageApi.error("Unable to delete user");
    }
    setLoading(false);
  };

  const confirm = (e) => {
    deleteUser(e);
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(`${API_URL}/user/${id}`);
      // console.log(res);
      setUser(res.data.userDetail);
      setSubscriptionDetails(res.data.subscription);
    } catch (err) {
      // console.log(err);
      messageApi.error("Unable to fetch user");
    }
    setLoading(false);
  };

  return (
    <MyLayout currentNav={["2"]}>
      {contextHolder}
      {user && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Popconfirm
              title="Delete the note"
              description="Are you sure to delete this user?"
              onConfirm={() => confirm(user.userId)}
              onCancel={() => {
                // console.log("cancel")
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary">Delete</Button>
            </Popconfirm>
          </div>

          <div
            style={{
              marginTop: "2rem",
            }}
          >
            <h2>User Detail</h2>
            <p>
              <strong>User ID:</strong> {user.userId}
            </p>
            <p>
              <strong>Full Name:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phoneNumber}
            </p>
            <p>
              <strong>Country:</strong> {user.country}
            </p>
            <p>
              <strong>Profession:</strong> {user.profession}
            </p>
            <p>
              <strong>Speciality:</strong> {user.speciality}
            </p>
          </div>

          {subscriptionDetails && (
            <div
              style={{
                marginTop: "2rem",
              }}
            >
              <h2>Subscription Details</h2>
              <p>
                <strong>Id</strong> {subscriptionDetails._id}
              </p>
              <p>
                <strong>Plan Id:</strong> {subscriptionDetails.planId}
              </p>
              <p>
                <strong>Status:</strong> {subscriptionDetails.status}
              </p>
            </div>
          )}
        </>
      )}
    </MyLayout>
  );
}

export default UserDetail;
