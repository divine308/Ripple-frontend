import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Overview from "./pages/Overview";
import RippleMap from "./pages/RippleMap";
import Changes from "./pages/Changes";
import Verification from "./pages/Verification";
import Bob from "./pages/Bob";
import Agents from "./pages/Agents";
import Codebase from "./pages/Codebase";
import Demo from "./pages/Demo";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Full-screen cinematic demo */}
        <Route path="/demo" element={<Demo />} />

        {/* Main Ripple application */}
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Navigate to="/overview" replace />}
          />

          <Route
            path="/overview"
            element={<Overview />}
          />

          <Route
            path="/ripple-map"
            element={<RippleMap />}
          />

          <Route
            path="/changes"
            element={<Changes />}
          />

          <Route
            path="/verification"
            element={<Verification />}
          />

          <Route
            path="/bob"
            element={<Bob />}
          />

          <Route
            path="/agents"
            element={<Agents />}
          />

          <Route
            path="/codebase"
            element={<Codebase />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/overview" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}