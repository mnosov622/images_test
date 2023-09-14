import React from "react";
import Header from "./components/Header/Header";
import Container from "./components/Container/Container";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <>
      <Header />
      <Container>
        <Home />
      </Container>
      <Footer />
    </>
  );
};

export default App;
