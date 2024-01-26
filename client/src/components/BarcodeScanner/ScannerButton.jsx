import React from "react";
import { BsUpcScan } from "react-icons/bs";
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
      {cameraActive ? <IoClose /> : <BsUpcScan />}
    </div>
  );
}

export default ScannerButton;
