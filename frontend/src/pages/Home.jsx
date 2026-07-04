import React from "react";
import { Hero,LatestCollection,BestSeller,OurPolicy,NewsLetter } from "../components/index.js";
const Home = () => {
  return (
    <>
      <Hero />
      <LatestCollection/>
      <BestSeller/>
      <OurPolicy/>
      <NewsLetter/>
    </>
  );
};

export default Home;
