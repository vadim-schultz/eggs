import { Route, Routes } from "react-router-dom";

import Home from "./routes/Home";
import ListingDetail from "./routes/ListingDetail";
import PostListing from "./routes/PostListing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/listings/:id" element={<ListingDetail />} />
      <Route path="/post" element={<PostListing />} />
    </Routes>
  );
}
