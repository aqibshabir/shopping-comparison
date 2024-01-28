import React from "react";
import { FaBarcode } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function ScannerButton({ cameraActive, setCameraActive }) {
  return (
    <div
      type="button"
      className="camera-button"
      onClick={() => {
        setCameraActive(!cameraActive);
      }}
    >
      {cameraActive ? (
        <IoClose title="Close Scanner" />
      ) : (
        <FaBarcode title="Scan Barcode" />
      )}
    </div>
  );
}

export default ScannerButton;
