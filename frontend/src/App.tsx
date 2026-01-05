import { ThemeProvider } from "@tritonse/tse-constellation";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { About, Home, TaskDetail } from "src/pages";
import "src/globals.css";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/task/:id" element={<TaskDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
