import React, { useState } from "react";
import emailjs from "@emailjs/browser";

interface ContactFormProps {   onSubmit?: (data: { name: string; email: string; message: string }) => void;}

export const ContactForm: React.FC<ContactFormProps> = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send(
        "service_w7kv4vw", // Replace with your EmailJS Service ID
        "template_36x541j", // Replace with your EmailJS Template ID
        templateParams,
        "8ziQfIImJeqyuF-oG" // Replace with your EmailJS Public Key
      )
      .then(
        () => {
          console.log("Email successfully sent!");
          setStatus("success");
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          console.error("Error sending email:", error);
          setStatus("error");
        }
      );
  };

  return (
    <div
    className="flex justify-start ml-[30rem] p-3 rounded-2xl bg-[#719191] w-[32rem] shadow-lg"
    >
  
      <form
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="w-full ml-7 text-white items-start justify-start flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-lg font-medium mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-[27rem] px-16 py-2 rounded-2xl border focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-lg font-medium mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-[27rem] px-16 py-2 rounded-2xl border focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-lg font-medium mb-2">
            Message:
          </label>
          <textarea
            id="message"
            rows={6}
            placeholder="Write your message here..."
            className="w-[27rem] px-16 py-2 rounded-lg border text-black focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-[11rem] ml-[8rem] -mt-3 px-4 py-2 rounded-2xl bg-[#cadada] text-[#485e5e] hover:bg-[#4e7074] hover:text-white transform transition-transform duration-200 hover:scale-105"
        >
          Submit
        </button>

        {status === "success" && (
          <p className="mt-4 text-green-500">Your message was sent successfully!</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-500">
            There was an error sending your message. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

export default ContactForm;
