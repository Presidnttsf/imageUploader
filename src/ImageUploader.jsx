import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import ImageCard from "./ImgCard"

export default function ImageUpload() {
  const { register, handleSubmit, reset, watch } = useForm();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const imageFile = watch("image");
  const previewUrl = imageFile && imageFile[0] ? URL.createObjectURL(imageFile[0]) : null;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:5001/images");
        setImages(response.data);
        console.log("checking rd", response.data)
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

      setMessage("✅ Image uploaded successfully!");
      setTimeout(()=>setMessage(""), 1000)
      reset();
      setImages((prevImages) => [...prevImages, response.data]);
    } catch (error) {
      setMessage("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Upload Image</h2>
      {message && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register("name", { required: true })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full p-2 border rounded mb-2"
        />
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: true })}
          className="w-full p-2 border rounded mb-4"
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover mb-4 rounded" />
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 p-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
      <button onClick={()=>setShow(!show)}>{show ? "Click to hide images" : "Click to see images"}</button>
      
{show ? <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>

  {images.slice().reverse().map((image) => (
    
    <div key={image._id}>
      <ImageCard image={image} />
    </div>
  ))}
</div> : null }

      </div>
    
  );
}
