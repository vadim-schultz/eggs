import { Route, Routes } from "react-router-dom";

import AppShell from "@/features/shell/containers/AppShell";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />} />
      <Route path="/listings/:id" element={<AppShell />} />
      <Route path="/post" element={<AppShell />} />
    </Routes>
  );
}
