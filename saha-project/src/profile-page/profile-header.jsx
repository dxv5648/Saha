import { useState, useRef } from "react";
import Face from "../assets/Face.jpg";

export default function ProfileHeader() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("John Williams");
  const [location, setLocation] = useState("Auckland, New Zealand");
  const [profileImage, setProfileImage] = useState(Face);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className="flex flex-col items-center self-stretch gap-10"
      style={{ padding: "clamp(30px, 5vw, 62px) clamp(20px, 3vw, 30px)" }}
    >
      <div
        className="flex flex-col items-center bg-[#161616F0] rounded-[40px] w-full max-w-225"
        style={{ padding: "clamp(20px, 3vw, 30px)" }}
      >
        <div className="relative">
          <img
            src={profileImage}
            className="object-cover rounded-full mb-3.25"
            style={{
              width: "clamp(80px, 12vw, 128px)",
              height: "clamp(80px, 12vw, 128px)",
              marginTop: "clamp(10px, 2vw, 21px)",
            }}
          />
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center cursor-pointer border-2 border-black hover:bg-gray-100"
              style={{ marginBottom: "clamp(13px, 2vw, 13px)" }}
            >
              ✎
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {isEditing ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-white mb-3.25 text-center poppins-bold bg-transparent border-b-2 border-white outline-none"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          />
        ) : (
          <span
            className="text-white mb-3.25 text-center poppins-bold"
            style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)" }}
          >
            {name}
          </span>
        )}

        {isEditing ? (
          <div className="flex items-center gap-2 mb-3.25">
            <span
              className="text-[#D1D1D1] inter-regular"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
            >
              Member •
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-[#D1D1D1] text-center inter-regular bg-transparent border-b-2 border-[#D1D1D1] outline-none"
              style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
            />
          </div>
        ) : (
          <span
            className="text-[#D1D1D1] mb-3.25 text-center inter-regular"
            style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
          >
            Member • {location}
          </span>
        )}

        <div
          className="flex flex-col sm:flex-row items-center w-full justify-center"
          style={{
            marginBottom: "clamp(30px, 4vw, 44px)",
            gap: "clamp(8px, 1.5vw, 10px)",
          }}
        >
          {isEditing ? (
            <>
              <button
                className="bg-white inter-regular text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                  padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 44px)",
                }}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-[#404040] inter-regular text-white rounded-[20px] border-0 cursor-pointer hover:bg-[#505050] w-full sm:w-auto"
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                  padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 44px)",
                }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-white inter-regular text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                  padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 44px)",
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="bg-white inter-regular text-black rounded-[20px] border-0 cursor-pointer hover:bg-gray-100 w-full sm:w-auto"
                style={{
                  fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
                  padding: "clamp(12px, 2vw, 16px) clamp(30px, 4vw, 51px)",
                }}
                onClick={() => alert("Pressed!")}
              >
                Settings
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
