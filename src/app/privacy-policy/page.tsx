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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] sm:h-[60vh] bg-neutral-950 overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(11,51,147,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(80,40,120,0.3) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 border border-blue-400/30 backdrop-blur-sm rounded-full">
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-[11px] font-serif tracking-[0.3em] uppercase text-white/70">
              Your Data
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[0.9]">
            Privacy{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
              Policy
            </span>
          </h1>
          <p className="text-neutral-400 font-serif tracking-wide max-w-2xl mx-auto text-base sm:text-lg">
            Your privacy is important to us. Learn how we collect, use, and
            protect your personal information.
          </p>
          <p className="text-sm text-neutral-500 font-serif tracking-wide mt-4">
            Last Updated: September 16, 2024
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-blue-50 p-8 mb-8">
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
                className="group bg-white rounded-2xl border border-blue-50 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-500 overflow-hidden"
              >
                <div className="flex items-center gap-4 p-6 sm:p-8 border-b border-blue-50 bg-gradient-to-r from-blue-50/80 to-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0b3393] to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-serif font-bold text-neutral-900 tracking-wide">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <div className="p-6 sm:p-8">
                  {section.title === "Your Rights" ? (
                    <ul className="space-y-3">
                      {section.content.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-neutral-700 font-serif"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0b3393] mt-2 flex-shrink-0 opacity-40" />
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
        <div className="bg-gradient-to-br from-[#0b3393] via-blue-900 to-blue-950 rounded-2xl p-8 lg:p-12 mt-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide uppercase mb-6 text-center">
              Contact Us
            </h2>
            <p className="text-blue-200/70 font-serif tracking-wide text-center mb-8">
              If you have any questions or concerns regarding this Privacy Policy
              or our data practices, feel free to contact us.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <Mail className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-sm font-serif font-bold text-white mb-1">
                  Email
                </p>
                <p className="text-xs font-serif text-blue-200/60">
                  prior.retailshop.info.bd@gmail.com
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-sm font-serif font-bold text-white mb-1">
                  Phone
                </p>
                <p className="text-xs font-serif text-blue-200/60">
                  +880-1700534317
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <MapPin className="w-8 h-8 text-white mx-auto mb-3" />
                <p className="text-sm font-serif font-bold text-white mb-1">
                  Address
                </p>
                <p className="text-xs font-serif text-blue-200/60">
                  Dhanmondi 27, Genetic Plaza Shop No: 134, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
