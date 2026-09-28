import { Route, Routes } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import AuthButton from "./auth/AuthButton";
import RequireAuth from "./auth/RequireAuth";
import Home from "./routes/Home";
import ListingDetail from "./routes/ListingDetail";
import PostListing from "./routes/PostListing";

export default function App() {
  return (
    <>
      <Flex as="header" justify="flex-end" p="4">
        <AuthButton />
      </Flex>
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
    </>
  );
}
