import React, { createContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

export const MapContextMapbox = new createContext();

export const Mapbox = ({ children, zoom, center }) => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  mapboxgl.accessToken =
    "pk.eyJ1IjoicmFodWxzZHMiLCJhIjoiY2p3YTd5NzVpMDA5MDN5bzE0Z3YzNW1rZiJ9.GUqAHdwGlesoO4MpewcKNg";

  useEffect(() => {
    const options = {
      style: "mapbox://styles/rahulsds/ckybe0c2d2sn815ny81kt1tn5",
      container: mapRef.current,
      projection:"mercator",
      zoom,
      center,
    };

    const mapObj = new mapboxgl.Map(options);
    setMap(mapObj);

    return () => setMap(null);
  }, [zoom, center]);

  //   zoom change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setZoom(zoom);
  }, [map, zoom]);

  //   center change handler
  useEffect(() => {
    if (!map) {
      return;
    }
    map.setCenter(center);
  }, [center, map]);

  return (
    <MapContextMapbox.Provider value={{ map }}>
      <div ref={mapRef} className="mapbox-container">
        {children}
      </div>
    </MapContextMapbox.Provider>
  );
};
