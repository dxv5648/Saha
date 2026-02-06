import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth.js";
import supabase from "../supabase-client";

export default function PersonalDetails() {
  const [timezone, setTimezone] = useState("Auckland (GMT +13:00)");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Fetch existing personal details
  useEffect(() => {
    const fetchPersonalDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("personal_details")
          .select("time_zone, email")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is fine for new users
          console.error("Error fetching personal details:", error);
        } else if (data) {
          // Convert stored timetz format back to display format
          // timetz format: "00:00:00+11:00" -> extract "+11:00"
          let storedTz = data.time_zone || "00:00:00+13:00";
          let offset = "+13:00"; // default
          
          if (typeof storedTz === "string") {
            // Extract timezone offset from timetz format (HH:MM:SS+TZ or HH:MM:SS-TZ)
            const offsetMatch = storedTz.match(/([+-]\d{1,2}):00$/);
            if (offsetMatch) {
              offset = offsetMatch[1] + ":00";
            } else {
              // Try alternative format
              const altMatch = storedTz.match(/([+-]\d{1,2}):(\d{2})$/);
              if (altMatch) {
                offset = altMatch[1] + ":" + altMatch[2];
              }
            }
          }
          
          // Map timezone offset to display format
          const tzMap = {
            "+13:00": "Auckland (GMT +13:00)",
            "+11:00": "Sydney (GMT +11:00)",
            "+09:00": "Tokyo (GMT +9:00)",
            "+08:00": "Singapore (GMT +8:00)",
            "+04:00": "Dubai (GMT +4:00)",
            "+00:00": "London (GMT +0:00)",
            "-05:00": "New York (GMT -5:00)",
            "-08:00": "Los Angeles (GMT -8:00)",
          };
          setTimezone(tzMap[offset] || "Auckland (GMT +13:00)");
          setEmail(data.email || "");
        }
      } catch (error) {
        console.error("Unexpected error fetching personal details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalDetails();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save personal details");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      alert("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    setSaving(true);

    try {
      // Extract timezone offset from display string and convert to timetz format
      // timetz format: "00:00:00+11:00" (time with timezone)
      const tzMatch = timezone.match(/GMT\s*([+-]?\d{1,2}):00/);
      let timezoneTimetz = "00:00:00+13:00"; // default
      if (tzMatch && tzMatch[1]) {
        const offset = tzMatch[1];
        // Ensure proper format: +11:00 or -05:00
        let offsetStr;
        if (offset.startsWith("+") || offset.startsWith("-")) {
          offsetStr = offset + ":00";
        } else {
          // Handle positive offsets without + sign
          offsetStr = "+" + offset + ":00";
        }
        // Format as timetz: "00:00:00+offset"
        timezoneTimetz = `00:00:00${offsetStr}`;
      }

      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from("personal_details")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is fine
        console.error("Error checking personal details:", checkError);
        alert("Error checking details: " + checkError.message);
        setSaving(false);
        return;
      }

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("personal_details")
          .update({
            time_zone: timezoneTimetz,
            email: trimmedEmail,
          })
          .eq("user_id", user.id);

        if (updateError) {
          console.error("Error updating personal details:", updateError);
          alert("Error saving details: " + updateError.message);
        } else {
          alert("Personal details saved successfully!");
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("personal_details")
          .insert([
            {
              user_id: user.id,
              time_zone: timezoneTimetz,
              email: trimmedEmail,
            },
          ]);

        if (insertError) {
          console.error("Error inserting personal details:", insertError);
          alert("Error saving details: " + insertError.message);
        } else {
          alert("Personal details saved successfully!");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      className="flex flex-col items-start bg-[#161616F0] rounded-[40px] w-full max-w-150 mx-auto inter-regular"
      style={{ padding: "clamp(20px, 3vw, 30px)" }}
    >
      <span
        className="text-white mb-0.75 inter-semi-bold"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.125rem)",
          marginTop: "clamp(7px, 1.5vw, 7px)",
        }}
      >
        {"Personal Details"}
      </span>

      <span
        className="text-white mb-1.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Time Zone"}
      </span>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-3.25 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666] cursor-pointer"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      >
        <option value="Auckland (GMT +13:00)">Auckland (GMT +13:00)</option>
        <option value="Sydney (GMT +11:00)">Sydney (GMT +11:00)</option>
        <option value="Tokyo (GMT +9:00)">Tokyo (GMT +9:00)</option>
        <option value="Singapore (GMT +8:00)">Singapore (GMT +8:00)</option>
        <option value="Dubai (GMT +4:00)">Dubai (GMT +4:00)</option>
        <option value="London (GMT +0:00)">London (GMT +0:00)</option>
        <option value="New York (GMT -5:00)">New York (GMT -5:00)</option>
        <option value="Los Angeles (GMT -8:00)">Los Angeles (GMT -8:00)</option>
      </select>

      <span
        className="text-white mb-1.5"
        style={{ fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)" }}
      >
        {"Email"}
      </span>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-[#1C1C1CB0] text-[#D1D1D1] w-full mb-1.5 rounded-[10px] border border-solid border-[#434343] outline-none focus:border-[#666]"
        style={{
          fontSize: "clamp(0.75rem, 1.5vw, 0.875rem)",
          padding: "clamp(12px, 2vw, 15px)",
        }}
      />

      <button
        className="bg-white text-black w-full rounded-[10px] border-0 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        style={{
          fontSize: "clamp(1rem, 2vw, 1.125rem)",
          padding: "clamp(8px, 1.5vw, 10px)",
          marginTop: "clamp(8px, 1.5vw, 13px)",
        }}
        onClick={handleSave}
        disabled={loading || saving}
      >
        {saving ? "Saving..." : "Save Details"}
      </button>
    </div>
  );
}
