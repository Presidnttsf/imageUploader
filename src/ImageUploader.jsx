import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import ImageCard from "./ImgCard";

export default function ImageUpload() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const imageFile = watch("image");
  const previewUrl = imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/images");
        setImages(response.data.reverse());
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const onSubmit = async (data) => {
    if (!data.image[0]) {
      setMessage("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", data.image[0]);

    try {
      const response = await axios.post("http://localhost:5001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setTimeout(() => setMessage(""), 1000);
      reset();
      setImages((prevImages) => [response.data, ...prevImages]);
    } catch (error) {
        console.log("checking error", )
      setMessage(error.response.data.message);
    }
  };

  const removeImage = () => {
    setValue("image", null);
  };

  const deleteImage = async (id) => {
    try {
        await axios.delete(`http://localhost:5001/delete/${id}`);
        setImages((prevImages) => prevImages.filter((img) => img._id !== id));
    } catch (error) {
        console.error("Error deleting image:", error.response?.data?.message || error.message);
    }
};


  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="mb-3">Upload Image</h2>
        {message && <p className="text-danger">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Name" {...register("name", { required: true })} className="form-control mb-2" />
          <input type="email" placeholder="Email" {...register("email", { required: true })} className="form-control mb-2" />
          <input type="file" accept="image/*" {...register("image", { required: true })} className="form-control mb-3" />
          {previewUrl && (
            <div className="position-relative mb-3">
              <img src={previewUrl} alt="Preview" className="img-fluid rounded" />
              <button type="button" onClick={removeImage} className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">
                ✖
              </button>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">Upload</button>
        </form>
        <button onClick={() => setShow(!show)} className="btn btn-secondary mt-3 w-100">
          {show ? "Click to hide images" : "Click to see images"}
        </button>
        {show && (
          <div className="mt-3 d-flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={image._id}>
                <ImageCard image={image} deleteImage={deleteImage} index={index}/>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
