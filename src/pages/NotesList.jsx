import React from "react";
import MyLayout from "../layout/Layout";
import axiosApiInstance from "../services/axios";
import { message, Table, Space, Popconfirm, Input } from "antd";
import { API_URL } from "../constants/constants";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { format, set } from "date-fns";

const options = ["All", "Inpatient", "Outpatient", "Dictation"];

function NotesList() {
  const [messageApi, contextHolder] = message.useMessage();
  const [noteDetails, setNoteDetails] = React.useState({
    noteType: options[0],
    page: 1,
    limit: 100000000,
    search: "",
  });
  const [loading, setLoading] = React.useState(false);

  const notes = React.useRef([]);
  const [filteredNotes, setFilteredNotes] = React.useState([]);

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.delete(`${API_URL}/notes/${id}`);
      console.log(res);
      messageApi.success("Note deleted successfully");
      getNotes();
    } catch (err) {
      console.log(err);
      messageApi.error("Unable to delete note");
    }
    setLoading(false);
  };

  const confirm = (e) => {
    deleteNote(e);
  };

  const cancel = (e) => {
    console.log(e);
  };

  const columns = [
    {
      title: "User Id",
      dataIndex: "userId",
      key: "userId",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Note Id",
      dataIndex: "_id",
      key: "_id",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "User Name",
      dataIndex: "profile",
      key: "profile",
      render: (text) => <p>{text?.fullName}</p>,
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Note Type",
      dataIndex: "type",
      key: "type",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <p>{format(new Date(text), "MM/dd/yyyy")}</p>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/note-detail/${_._id}`}>Detail</Link>
          <Popconfirm
            title="Delete the note"
            description="Are you sure to delete this note?"
            onConfirm={() => confirm(_._id)}
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

  const getNotes = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(
        `${API_URL}/notes?noteType=${noteDetails.noteType.toLowerCase()}&page=${
          noteDetails.page
        }&limit=${noteDetails.limit}&search=${noteDetails.search}`
      );
      notes.current = res.data;
      setFilteredNotes(res.data);
    } catch (error) {
      console.log(error);
      messageApi.error(error.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    const filtered = notes.current.filter((note) => {
      return (
        note.patientName.toLowerCase().includes(value.toLowerCase()) ||
        note.profile?.fullName.toLowerCase().includes(value.toLowerCase())
      );
    });
    setFilteredNotes(filtered);
  };
  React.useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      {contextHolder}
      <Loading show={loading} />
      <MyLayout currentNav={["1"]}>
        <Input
          placeholder="Search with user name or patient name"
          onChange={handleSearch}
          style={{
            marginBottom: "20px",
          }}
        />
        <Table columns={columns} dataSource={filteredNotes} cl />
      </MyLayout>
    </>
  );
}

export default NotesList;
