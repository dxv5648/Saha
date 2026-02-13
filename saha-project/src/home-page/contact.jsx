import { useState } from "react";

export default function Contact() {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleSubmit = async () => {
    if (!subject || !email || !message) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setIsSending(true);
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, email, message }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      alert("Message sent!");
      // Reset form
      setSubject("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Contact form error:", error);
      alert(error.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 p-8 min-h-screen">
      <h1 className="text-white text-4xl poppins-bold">Contact</h1>

      <div className="flex flex-wrap items-start justify-center gap-8 max-w-6xl w-full">
        {/* Contact Information */}
        <div className="flex flex-col items-center bg-[#0F0F0FB5] backdrop-blur-sm w-full max-w-132.75 px-8 py-14 rounded-3xl">
          <h2 className="text-white text-3xl poppins-bold mb-14">
            Get in Touch
          </h2>

          <div className="flex flex-col items-start w-full gap-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg inter-semi-bold">
                  Address
                </span>
                <span className="text-gray-300 inter-regular leading-relaxed">
                  123 Queen Street
                  <br />
                  Auckland CBD
                  <br />
                  Auckland 1010, New Zealand
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg inter-semi-bold">
                  Email
                </span>
                <div className="text-gray-300 inter-regular">
                  <a
                    href="mailto:business@saha.co.nz"
                    className="hover:text-white transition-colors block"
                  >
                    business@saha.co.nz
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg inter-semi-bold">
                  Phone
                </span>
                <a
                  href="tel:+6491234567"
                  className="text-gray-300 inter-regular hover:text-white transition-colors"
                >
                  +64 9 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col items-center bg-[#0F0F0FB5] backdrop-blur-sm w-full max-w-132.75 p-8 rounded-3xl">
          <h2 className="text-white text-3xl poppins-bold mb-12">
            Send an Email
          </h2>

          <div className="flex flex-col w-full gap-6">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full inter-regular text-white placeholder:text-gray-400 bg-[#0f0f0f] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none transition-colors"
            />

            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full inter-regular text-white placeholder:text-gray-400 bg-[#0F0F0F] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none transition-colors"
            />

            <textarea
              placeholder="Your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full inter-regular text-white placeholder:text-gray-400 bg-[#0F0F0F] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none resize-none transition-colors"
            />

            <button
              onClick={handleSubmit}
              disabled={isSending}
              className="w-full inter-semi-bold bg-white hover:bg-gray-100 text-black text-xl font-semibold py-4 rounded-xl transition-colors active:scale-95 transform"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
