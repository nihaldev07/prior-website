"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { createContactInfo, IContact } from "@/services/contactService";
import Swal from "sweetalert2";
import useAnalytics from "@/hooks/useAnalytics";

const ContactUs = () => {
  useAnalytics();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Validate the form data
  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", message: "" };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "Name is required.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else {
      // Remove the optional country code (+880)
      const phoneNumber = formData.phone.replace(/^\+88/, "");

      // Validate phone number length after removing the country code
      if (!/^\d{11}$/.test(phoneNumber)) {
        newErrors.phone =
          "Phone number format is invalid. It should be 10 digits.";
        isValid = false;
      }
    }

    if (!formData.message) {
      newErrors.message = "Message is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendContactInfo = async (data: IContact) => {
    try {
      const res = await createContactInfo(data);

      if (res) {
        Swal.fire({
          title: "Thanks for Reaching Out! 😊",
          text: "We've received your message and will get back to you as soon as possible. 🚀",
          icon: "success",
        }).then(() => {
          setFormData({ name: "", email: "", phone: "", message: "" });
          setErrors({ name: "", email: "", phone: "", message: "" });
        });
      } else {
        Swal.fire({
          title: "Oops! 😔",
          text: "We’re experiencing a bit of a traffic jam. Please try sending your message again later.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong! 😞",
        text: "We encountered an error while processing your request. Please try again later.",
        icon: "error",
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Perform the form submission logic here
      sendContactInfo(formData);
      // Reset form fields after submission
    }
  };

  return (
    <div className="container mx-auto my-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-start">
        {/* Left Side - Contact Information */}
        <div className="w-full md:w-1/2  p-6 mx-4 rounded-lg mb-8 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
          <div className="flex items-center mb-4">
            <Mail className="text-gray-600 mr-3 size-5" />
            <p className="text-lg text-left">
              prior.retailshop.info.bd@gmail.com
            </p>
          </div>
          <div className="flex items-center mb-4">
            <Phone className="text-gray-600 mr-3 size-5" />
            <p className="text-lg text-left">+880-1700534317</p>
          </div>
          <div className="flex items-center mb-4">
            <MapPin className="text-gray-600 mr-3 size-5" />
            <p className="text-lg text-left">
              Dhanmondi 27, Genetic Plaza shop no: 134, Dhaka, Bangladesh
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.7721996343375!2d90.37059247606526!3d23.755501488579057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf536d1cf7bb%3A0x9ba1b02f4265d430!2sGenetic%20Plaza!5e0!3m2!1sen!2sbd!4v1726519259387!5m2!1sen!2sbd"
            width="600"
            height="450"
            className="border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">We Value Your Feedback</h2>
          <p className="text-gray-600 mb-4">
            Your thoughts and opinions help us improve. Whether you have a
            suggestion, complaint, or just want to share your experience, we’d
            love to hear from you. Please fill out the form below, and we’ll get
            back to you as soon as possible. Thank you for helping us serve you
            better!
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Enter your message"
                rows={4}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
