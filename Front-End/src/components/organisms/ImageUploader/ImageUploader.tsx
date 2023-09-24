import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [manufacturer, setManufacturer] = useState<string>("");
  const [device, setDevice] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileList = event.target.files;
      setImages(fileList);
    }
  };

  const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (images) {
      const formData = new FormData();
      formData.append("manufacturer", manufacturer);
      formData.append("device", device);
      for (const element of images) {
        formData.append("images", element);
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/images/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // TODO: implement Winston logging instead of console.log
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <form>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Device"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          />
          <div className="form-group">
            <button onClick={handleUpload} className="btn btn-primary">
              Upload
            </button>
          </div>
          {/* {uploadedImages.map((imagePath) => (
            <div key={imagePath}>
              <img src={imagePath} alt="Uploaded" />
            </div>
          ))} */}
        </form>
      </div>
    </div>
  );
};

export default ImageUploader;
