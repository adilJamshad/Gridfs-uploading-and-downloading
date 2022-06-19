import logo from "./logo.svg";
import { Box } from "@mui/material";
import "./App.css";
import DropZone from "./components/Dropzone";
import Files from "./components/Files";

function App() {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <DropZone />
      <Box my={5}>
        <Files />
      </Box>
    </Box>
  );
}

export default App;
