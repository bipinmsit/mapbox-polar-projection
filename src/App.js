import React from "react";
import { Mapbox } from "./Map/Mapbox";
import PolarLine from "./Map/Layers/PolarLine";

const App = () => {
  return (
    <Mapbox center={[10, 10]} zoom={2}>
      <PolarLine />
    </Mapbox>
  );
};

export default App;
