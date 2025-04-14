import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  console.log(file);
  console.log("Current user:", currentUser);

  // this will trigger only when there will be change in file
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const data = new FormData();

    data.append("file", file);
    console.log(import.meta.env.VITE_UPLOAD_PRESET);
    console.log(import.meta.env.VITE_CLOUD_NAME);

    data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://api.cloudinary.com/v1_1/day0vpx3d/image/upload");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setProfileImage(response.url);
        setFormData({ ...formData, avatar: response.url });
        setUploadError(null);
      } else {
        setUploadError("Upload failed with status: " + xhr.status);
      }
      setProgress(0);
    };

    xhr.onerror = () => {
      setUploadError("An error occurred during the upload.");
      setProgress(0);
    };

    xhr.send(data);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 ">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={profileImage}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 "
        />

        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-slate-700">{`Uploading ${progress}%`}</span>
          ) : progress === 100 ? (
            <span className="text-green-700">Image Successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer ">Delete account</span>
        <span className="text-red-700 cursor-pointer ">Sign out</span>
      </div>
    </div>
  );
}
