import { Route, Routes } from "react-router-dom";

import AppShell from "./components/AppShell";
import RequireAuth from "./auth/RequireAuth";
import Home from "./routes/Home";
import ListingDetail from "./routes/ListingDetail";
import PostListing from "./routes/PostListing";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route
          path="/post"
          element={
            <RequireAuth>
              <PostListing />
            </RequireAuth>
          }
        />
      </Routes>
    </AppShell>
  );
}
