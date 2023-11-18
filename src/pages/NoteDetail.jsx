import React from "react";
import MyLayout from "../layout/Layout";
import { format } from "date-fns";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import { message, Button, Popconfirm } from "antd";
import axiosApiInstance from "../services/axios";
import { API_URL } from "../constants/constants";

function NoteDetail() {
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getNote();
  }, []);

  const deleteNote = async (id) => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.delete(`${API_URL}/notes/${id}`);
      console.log(res);
      messageApi.success("Note deleted successfully");
      navigate("/note-list");
    } catch (err) {
      console.log(err);
      messageApi.error("Unable to delete note");
    }
    setLoading(false);
  };

  const confirm = (e) => {
    deleteNote(e);
  };

  const getNote = async () => {
    setLoading(true);
    try {
      const res = await axiosApiInstance.get(`${API_URL}/notes/${id}`);
      console.log(res);
      setNote({
        ...res.data,
        note: {
          ...res.data.note,
          createdAt: format(new Date(res.data.note?.createdAt), "dd/MM/yyyy"),
        },

        noteDetail: {
          ...res.data.noteDetail,
          createdAt: format(
            new Date(res.data.noteDetail.createdAt),
            "dd/MM/yyyy"
          ),
        },
      });
    } catch (err) {
      console.log(err);
      messageApi.error("Unable to fetch note");
    }
    setLoading(false);
  };

  return (
    <>
      {contextHolder}
      <Loading show={loading} />
      <MyLayout currentNav={["1"]}>
        {note && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Popconfirm
                title="Delete the note"
                description="Are you sure to delete this note?"
                onConfirm={() => confirm(note.note?._id)}
                onCancel={() => console.log("cancel")}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary">Delete</Button>
              </Popconfirm>
            </div>
            <div>
              <h2>Overview</h2>
              <div>
                <p>
                  <b>Note Id:</b> {note.note?._id}
                </p>
                <p>
                  <b>Note Type:</b> {note.note?.type}
                </p>
                <p>
                  <b>Created At:</b> {note.note?.createdAt}
                </p>
                <p>
                  <b>Patient Name:</b> {note.note?.patientName}
                </p>
                <p>
                  <b>Recording Length:</b> {note.note?.recordingLength / 10000}{" "}
                  mins
                </p>
                <p>
                  <b>Transcript</b>
                </p>
                <p style={{ marginTop: "-10px" }}>{note.note?.transcription}</p>
              </div>
            </div>

            <div>
              <p>
                <b>Created By</b>
              </p>
              <div
                style={{
                  marginTop: "-10px",
                }}
              >
                <p>
                  <b>User Id:</b> {note.userDetail?.userId}
                </p>
                <p>
                  <b>Full Name</b> {note.userDetail?.fullName}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "50px",
              }}
            >
              <h2>Details</h2>
              <div>
                <p>
                  <b>Assessment Type</b> {note.noteDetail?.noteType}
                </p>
                <p>
                  <b>Medical Note</b>
                </p>
                <p style={{ marginTop: "-10px" }}>
                  {note.noteDetail?.medicalNote}
                </p>
              </div>
            </div>
          </>
        )}
      </MyLayout>
    </>
  );
}

export default NoteDetail;
