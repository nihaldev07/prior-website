"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Facebook,
  Send,
} from "lucide-react";
import { createContactInfo, IContact } from "@/services/contactService";
import Swal from "sweetalert2";

const contactCards = [
  {
    icon: Phone,
    title: "Call Us",
    detail: "+880-1700534317",
    href: "tel:+8801700534317",
    description: "Sat-Thu, 10AM - 8PM",
  },
  {
    icon: Mail,
    title: "Email Us",
    detail: "prior.retailshop.info.bd@gmail.com",
    href: "mailto:prior.retailshop.info.bd@gmail.com",
    description: "We reply within 24 hours",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Dhanmondi 27, Genetic Plaza",
    href: "https://maps.google.com/?q=Genetic+Plaza+Dhanmondi+27+Dhaka",
    description: "Shop No: 134, Dhaka",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    detail: "+880-1700534317",
    href: "https://wa.me/8801700534317",
    description: "Quick response",
  },
  {
    icon: Facebook,
    title: "Facebook",
    detail: "@Prioryourpriority",
    href: "https://www.facebook.com/Prioryourpriority",
    description: "Message us anytime",
  },
];

const businessHours = [
  { day: "Saturday - Thursday", hours: "10:00 AM - 8:00 PM" },
  { day: "Friday", hours: "Closed" },
];

const ContactUs = () => {
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
      const phoneNumber = formData.phone.replace(/^\+88/, "");
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
          title: "Message Sent!",
          text: "Thank you for reaching out. We'll get back to you soon.",
          icon: "success",
        }).then(() => {
          setFormData({ name: "", email: "", phone: "", message: "" });
          setErrors({ name: "", email: "", phone: "", message: "" });
        });
      } else {
        Swal.fire({
          title: "Oops!",
          text: "We're experiencing some issues. Please try again later.",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong!",
        text: "We encountered an error while processing your request. Please try again later.",
        icon: "error",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      sendContactInfo(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-16 lg:py-20 relative overflow-hidden">
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide uppercase mb-4">
            Contact Us
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out to us through any of the
            channels below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={index}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  card.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-neutral-800 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-neutral-900 tracking-wide text-sm mb-1">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-500 font-serif mb-2">
                  {card.description}
                </p>
                <p className="text-xs text-neutral-700 font-serif font-medium truncate">
                  {card.detail}
                </p>
              </a>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 border border-neutral-200">
            <h2 className="text-2xl font-serif font-bold text-neutral-900 tracking-wide uppercase mb-2">
              Send a Message
            </h2>
            <p className="text-neutral-600 font-serif mb-6">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-serif font-medium text-neutral-700 mb-1.5">
                    Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-serif">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-serif font-medium text-neutral-700 mb-1.5">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-serif">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-serif font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <Input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+880-XXXXXXXXXX"
                  className="border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 font-serif">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-serif font-medium text-neutral-700 mb-1.5">
                  Message
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="How can we help you?"
                  rows={5}
                  className="border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400 resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1 font-serif">
                    {errors.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800 font-serif font-bold tracking-wide uppercase"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-serif font-bold text-neutral-900 tracking-wide">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-3">
                {businessHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0"
                  >
                    <span className="text-sm font-serif text-neutral-600">
                      {schedule.day}
                    </span>
                    <span className="text-sm font-serif font-bold text-neutral-900">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200">
              <h3 className="font-serif font-bold text-neutral-900 tracking-wide mb-4">
                Follow Us
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.facebook.com/Prioryourpriority"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-serif font-bold text-neutral-900">
                      Facebook
                    </p>
                    <p className="text-xs font-serif text-neutral-500">
                      @Prioryourpriority
                    </p>
                  </div>
                </a>
                <a
                  href="https://wa.me/8801700534317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-serif font-bold text-neutral-900">
                      WhatsApp
                    </p>
                    <p className="text-xs font-serif text-neutral-500">
                      +880-1700534317
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-neutral-200">
              <h3 className="font-serif font-bold text-neutral-900 tracking-wide mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "FAQ", href: "/faq" },
                  { label: "Shipping Info", href: "/shipping" },
                  { label: "Returns & Exchange", href: "/returns" },
                  { label: "Payment Methods", href: "/payments" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-serif text-neutral-600 hover:text-neutral-900 transition-colors duration-200 py-1.5"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="font-serif font-bold text-neutral-900 tracking-wide">
              Our Location
            </h3>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.7721996343375!2d90.37059247606526!3d23.755501488579057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf536d1cf7bb%3A0x9ba1b02f4265d430!2sGenetic%20Plaza!5e0!3m2!1sen!2sbd!4v1726519259387!5m2!1sen!2sbd"
            width="100%"
            height="400"
            className="border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
