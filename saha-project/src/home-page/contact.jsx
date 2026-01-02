import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }
    alert(
      `Message sent!\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center gap-12 p-8 min-h-screen">
      <h1 className="text-white text-4xl font-bold">Contact</h1>

      <div className="flex flex-wrap items-start justify-center gap-8 max-w-6xl w-full">
        {/* Contact Information */}
        <div className="flex flex-col items-center bg-[#121212B0] backdrop-blur-sm w-full max-w-[531px] px-8 py-14 rounded-3xl">
          <h2 className="text-white text-3xl font-bold mb-14">Get in Touch</h2>

          <div className="flex flex-col items-start w-full gap-8">
            {/* Address */}
            <div className="flex items-start gap-4">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/0mre9l5y_expires_30_days.png"
                alt="Address icon"
                className="w-5 h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg font-bold">Address</span>
                <span className="text-gray-300 text-base leading-relaxed">
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
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/va6qjuk4_expires_30_days.png"
                alt="Email icon"
                className="w-6 h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg font-bold">Email</span>
                <div className="text-gray-300 text-base">
                  <a
                    href="mailto:hello@saha.nz"
                    className="hover:text-white transition-colors block"
                  >
                    hello@saha.nz
                  </a>
                  <a
                    href="mailto:support@saha.nz"
                    className="hover:text-white transition-colors block"
                  >
                    support@saha.nz
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <img
                src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/L7hCOf5rCg/v9se0alc_expires_30_days.png"
                alt="Phone icon"
                className="w-6 h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col gap-3">
                <span className="text-white text-lg font-bold">Phone</span>
                <a
                  href="tel:+6491234567"
                  className="text-gray-300 text-base hover:text-white transition-colors"
                >
                  +64 9 123 4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col items-center bg-[#121212B0] backdrop-blur-sm w-full max-w-[531px] p-8 rounded-3xl">
          <h2 className="text-white text-3xl font-bold mb-12">Send an Email</h2>

          <div className="flex flex-col w-full gap-6">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-white placeholder:text-gray-400 bg-[#0F0F0F] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none transition-colors"
            />

            <input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-white placeholder:text-gray-400 bg-[#0F0F0F] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none transition-colors"
            />

            <textarea
              placeholder="Your Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full text-white placeholder:text-gray-400 bg-[#0F0F0F] text-lg py-4 px-4 rounded-xl border border-gray-600 focus:border-white focus:outline-none resize-none transition-colors"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-white hover:bg-gray-100 text-black text-xl font-semibold py-4 rounded-xl transition-colors active:scale-95 transform"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
