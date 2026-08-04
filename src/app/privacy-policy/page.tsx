"use client";

import {
  Shield,
  Database,
  Eye,
  Lock,
  Users,
  Clock,
  Settings,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      "Personal Information: When you place an order or contact us, we collect personal details such as your name, email address, phone number, shipping address, and payment details.",
      "Usage Data: We collect data on how you interact with our website, such as your IP address, browser type, operating system, pages visited, and the time spent on each page.",
      "Cookies: We use cookies to enhance your experience. Cookies help us remember your preferences and track your usage on our site.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      "To Process Orders: Your personal and payment information is used to process your orders, ship products, and send you order confirmations.",
      "Customer Support: We use your contact information to respond to your inquiries, including those made through our Facebook Messenger chat.",
      "Improve User Experience: We use cookies and usage data to improve our website's functionality and ensure that it meets your needs.",
      "Marketing: With your consent, we may send promotional emails and offers related to our products and services.",
    ],
  },
  {
    icon: Users,
    title: "Facebook Messenger Chat Integration",
    content: [
      "We use the Facebook Messenger chat plugin on our website to provide customer support and enhance communication with our visitors. By using the chat plugin, Facebook may collect certain information about your interaction with the chat, including your Facebook account details, and other data that Facebook may process.",
      "Information Collected via Facebook Messenger: Facebook may collect information such as your name, profile picture, and any messages you exchange with us via the chat. Please refer to Facebook's Data Policy for more information on how they handle your data.",
      "How We Use Facebook Messenger Data: We use the data collected through Facebook Messenger to provide timely customer service and answer any questions you may have. Your interaction with the Messenger chat is stored by Facebook, and we do not store your messages on our servers.",
    ],
  },
  {
    icon: Lock,
    title: "How We Protect Your Data",
    content: [
      "We take appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Despite these measures, no online data transmission is guaranteed to be 100% secure. We encourage you to take steps to protect your personal information, including using strong passwords and safeguarding your login credentials.",
    ],
  },
  {
    icon: Settings,
    title: "Third-Party Services",
    content: [
      "Our website may contain links to third-party websites, including social media platforms like Facebook. We are not responsible for the privacy practices of these third-party websites. We encourage you to review the privacy policies of any external sites you visit.",
    ],
  },
  {
    icon: Clock,
    title: "Data Retention",
    content: [
      "We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. For example, order information will be retained for accounting and legal compliance.",
    ],
  },
  {
    icon: Settings,
    title: "Your Rights",
    content: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your personal data, except when we are required to retain it for legal purposes.",
      "Opt-out of receiving promotional communications from us.",
    ],
  },
  {
    icon: Shield,
    title: "Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. Any changes will be posted on this page, and we will notify you of significant updates. We encourage you to review this Privacy Policy periodically.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero */}
      <div className="bg-neutral-900 text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide uppercase mb-4">
            Privacy Policy
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and
            protect your personal information.
          </p>
          <p className="text-sm text-neutral-500 font-serif tracking-wide mt-4">
            Last Updated: September 16, 2024
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-neutral-200 mb-8">
          <p className="text-neutral-700 font-serif leading-relaxed text-lg">
            Welcome to <strong>Prior</strong>, your priority in fashion. We value
            your trust and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and protect your
            data when you visit our website and use our services, including the
            Facebook Messenger chat feature.
          </p>
          <p className="text-neutral-700 font-serif leading-relaxed text-lg mt-4">
            By using our website and services, you agree to the collection and
            use of your information in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden"
              >
                <div className="flex items-center gap-3 p-6 border-b border-neutral-100 bg-neutral-50">
                  <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <div className="p-6">
                  {section.title === "Your Rights" ? (
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-neutral-700 font-serif"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-2 flex-shrink-0" />
                          <span>
                            <strong>{item.split(":")[0]}:</strong>
                            {item.split(":").slice(1).join(":")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-4">
                      {section.content.map((item, i) => (
                        <p
                          key={i}
                          className="text-neutral-700 font-serif leading-relaxed"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Info */}
        <div className="bg-neutral-900 rounded-lg p-8 lg:p-12 mt-12">
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide uppercase mb-6 text-center">
            Contact Us
          </h2>
          <p className="text-neutral-400 font-serif tracking-wide text-center mb-8">
            If you have any questions or concerns regarding this Privacy Policy
            or our data practices, feel free to contact us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <Mail className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-white mb-1">
                Email
              </p>
              <p className="text-xs font-serif text-neutral-400">
                prior.retailshop.info.bd@gmail.com
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <Phone className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-white mb-1">
                Phone
              </p>
              <p className="text-xs font-serif text-neutral-400">
                +880-1700534317
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-6 text-center">
              <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-white mb-1">
                Address
              </p>
              <p className="text-xs font-serif text-neutral-400">
                Dhanmondi 27, Genetic Plaza Shop No: 134, Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
