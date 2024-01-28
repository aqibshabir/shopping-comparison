import axios from "axios";
import Quagga from "quagga";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiURL } from "../../config";
import { selectProductData } from "../../redux/dataSlice";
import { setContent } from "../../redux/messageSlice";
import { findFirstProductBySku } from "../../utils/findProductBySku";
import "./BarcodeScanner.scss";

const DRAW_BOXES = true;

const BarcodeScanner = ({
  cameraActive,
  setCameraActive,
  handleSearch,
  setSearch,
}) => {
  const dispatch = useDispatch();
  const [barcode, setBarcode] = useState(null);
  const [product, setProduct] = useState(null);
  const searchResult = useSelector(selectProductData);
  const isInitialMount = useRef(true);

  const getSearchTermBySku = async (sku) => {
    try {
      const result = await axios.get(`${apiURL()}/scanner/${sku}`);
      // console.log("result", result);
      if (result.response?.status === 404) return false;
      await handleSearch(result.data.searchTerm);
      return true;
    } catch (error) {
      console.log("Error getting search term:", error);
    }
  };

  const initializeQuagga = () => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#camera"),
          constraints: {
            facingMode: "environment",
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ["ean_reader", "code_128_reader", "upc_reader"],
        },
        locate: true,
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
      },
      (err) => {
        if (err) {
          console.log("Error: ", err);
          dispatch(setContent({ text: err.toString(), type: "error" }));
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    if (DRAW_BOXES) drawBoundingBox();

    Quagga.onDetected(async (data) => {
      if (!data) return;
      const barcodeNumber = data.codeResult.code;

      // send the barcode to test agaist the data, if the data exists then save to state, stop scanning and show to the user
      // console.log(barcodeNumber);
      const result = await getSearchTermBySku(barcodeNumber);

      if (!result) return;

      Quagga.offDetected();
      setCameraActive(false);
    });
  };

  const drawBoundingBox = () => {
    // drawing the bounding box for debugging purposes
    Quagga.onProcessed((result) => {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            {
              color: "red",
              lineWidth: 3,
            }
          );
        }
      }
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (cameraActive) {
      initializeQuagga();
    } else {
      removeQuagga();
    }
  }, [cameraActive]);

  const removeQuagga = () => {
    Quagga.offDetected();
    Quagga.stop();
  };

  return (
    <div className={`camera-container ${cameraActive ? "camera-open" : ""}`}>
      <div id="camera" className="camera"></div>
    </div>
  );
};

export default BarcodeScanner;
