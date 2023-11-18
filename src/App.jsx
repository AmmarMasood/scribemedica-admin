import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Login from "./pages/Login";
import NotesList from "./pages/NotesList";
import NoteDetail from "./pages/NoteDetail";
import UserDetail from "./pages/UserDetail";
import UsersList from "./pages/UsersList";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          index
          path={"/"}
          element={
            <ProtectedRoute
              component={() => <Login />}
              authValidator={!localStorage.getItem("auth")}
              navigateTo={"/note-list"}
            />
          }
        />

        <Route
          path={"/note-list"}
          element={
            <ProtectedRoute
              component={() => <NotesList />}
              authValidator={localStorage.getItem("auth")}
              navigateTo={"/"}
            />
          }
        />

        <Route
          path={"/note-detail/:id"}
          element={
            <ProtectedRoute
              component={() => <NoteDetail />}
              authValidator={localStorage.getItem("auth")}
              navigateTo={"/"}
            />
          }
        />

        <Route
          path={"/user-list"}
          element={
            <ProtectedRoute
              component={() => <UsersList />}
              authValidator={localStorage.getItem("auth")}
              navigateTo={"/"}
            />
          }
        />

        {/* <Route
          path={"/user-detail/:id"}
          element={
            <ProtectedRoute
              component={() => <UserDetail />}
              authValidator={localStorage.getItem("auth")}
              navigateTo={"/"}
            />
          }
        /> */}

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Wrong Route, There is nothing here</p>
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
