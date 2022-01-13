import { useContext, useEffect } from "react";
import { MapContextMapbox } from "../Mapbox";
// import data1 from "../../Data/CO_ROUTE_DATA_4326_3995_3857_4326.geojson";
import { data1, data2 } from "./PolarData";
import proj4 from "proj4";
import * as turf from "@turf/turf";

const PolarLine = () => {
  const { map } = useContext(MapContextMapbox);

  // Reproject the coordinates to sit on polar map
  const reprojectCoord = (coord, crs) => {
    // Arctic Polar Stereographic
    proj4.defs(
      "EPSG:3995",
      "+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
    );

    // Antarctic Polar Stereographic
    proj4.defs(
      "EPSG:3031",
      "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
    );

    return proj4("EPSG:3857", "EPSG:4326", proj4(crs, coord));
  };

  // Reporject the line geojson to sit on polar map
  const reprojectGeojson = (geojson, crs) => {
    let tempArr1 = [];

    turf.featureEach(geojson, (feature) => {
      tempArr1.push(turf.getCoords(feature));
    });

    let routes = [];
    for (let i = 0; i < tempArr1.length; i++) {
      routes.push(
        turf.lineString([
          reprojectCoord(tempArr1[i][0], crs),
          reprojectCoord(tempArr1[i][1], crs),
        ])
      );
    }

    return turf.featureCollection(routes);
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    // map.on("mousemove", (e) => {
    //   console.log(e.lngLat.lng);
    // });

    let point1 = reprojectCoord([-73.77166, 40.63333], "EPSG:3995");
    let point2 = reprojectCoord([114.03, 22.21944], "EPSG:3995");

    map.on("load", () => {
      map.addSource("polarLine", {
        type: "vector",
        url: "mapbox://rahulsds.7eu5n5tc",
      });
      map.addLayer({
        id: "polarLine",
        type: "line",
        source: "polarLine",
        "source-layer": "CO_ROUTE_DATA_4326_3995_mapbo-39ti11",
        layout: { visibility: "none" },
        paint: { "line-color": "red", "line-width": 2 },
      });

      map.addSource("polarLine2", {
        type: "geojson",
        data: data1,
      });
      map.addLayer({
        id: "polarLine2",
        type: "line",
        source: "polarLine2",
        layout: { visibility: "none" },
        paint: {},
      });

      map.addSource("polarLine3", {
        type: "geojson",
        data: reprojectGeojson(data2, "EPSG:3995"),
      });
      map.addLayer({
        id: "polarLine3",
        type: "line",
        source: "polarLine3",
        layout: { visibility: "visible" },
        paint: {},
      });

      map.addSource("route", {
        type: "geojson",
        data: turf.lineString([point1, point2]),
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {},
        paint: {},
      });
    });
  }, [map]);

  return null;
};

export default PolarLine;
