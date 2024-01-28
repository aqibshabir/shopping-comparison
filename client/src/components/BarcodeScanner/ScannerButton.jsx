import React from "react";
import { IoBarcode } from "react-icons/io5";
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
        <IoBarcode title="Scan Barcode" />
      )}
    </div>
  );
}

export default ScannerButton;
