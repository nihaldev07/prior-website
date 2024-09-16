import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-10 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

      <p className="text-center mb-4 text-gray-600">
        Last Updated: September 16, 2024
      </p>

      <p className="mb-6">
        Welcome to <strong>Prior</strong>, your priority in fashion. We value
        your trust and are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and protect your data
        when you visit our website and use our services, including the Facebook
        Messenger chat feature.
      </p>
      <p className="mb-6">
        By using our website and services, you agree to the collection and use
        of your information in accordance with this Privacy Policy.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p className="mb-6">
        We may collect the following information when you interact with our
        website:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <strong>Personal Information</strong>: When you place an order or
          contact us, we collect personal details such as your name, email
          address, phone number, shipping address, and payment details.
        </li>
        <li>
          <strong>Usage Data</strong>: We collect data on how you interact with
          our website, such as your IP address, browser type, operating system,
          pages visited, and the time spent on each page.
        </li>
        <li>
          <strong>Cookies</strong>: We use cookies to enhance your experience.
          Cookies help us remember your preferences and track your usage on our
          site.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">
        2. How We Use Your Information
      </h2>
      <p className="mb-6">
        We use the information we collect for the following purposes:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <strong>To Process Orders</strong>: Your personal and payment
          information is used to process your orders, ship products, and send
          you order confirmations.
        </li>
        <li>
          <strong>Customer Support</strong>: We use your contact information to
          respond to your inquiries, including those made through our Facebook
          Messenger chat.
        </li>
        <li>
          <strong>Improve User Experience</strong>: We use cookies and usage
          data to improve our website’s functionality and ensure that it meets
          your needs.
        </li>
        <li>
          <strong>Marketing</strong>: With your consent, we may send promotional
          emails and offers related to our products and services.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">
        3. Facebook Messenger Chat Integration
      </h2>
      <p className="mb-6">
        We use the <strong>Facebook Messenger</strong> chat plugin on our
        website to provide customer support and enhance communication with our
        visitors. By using the chat plugin, Facebook may collect certain
        information about your interaction with the chat, including your
        Facebook account details, and other data that Facebook may process.
      </p>
      <p className="mb-6">
        <strong>Information Collected via Facebook Messenger</strong>:{" "}
        {`Facebook
        may collect information such as your name, profile picture, and any
        messages you exchange with us via the chat. Please refer to Facebook's`}{" "}
        <a
          href="https://www.facebook.com/policy.php"
          target="_blank"
          className="text-blue-500 underline"
        >
          Data Policy
        </a>{" "}
        for more information on how they handle your data.
      </p>
      <p className="mb-6">
        <strong>How We Use Facebook Messenger Data</strong>: We use the data
        collected through Facebook Messenger to provide timely customer service
        and answer any questions you may have. Your interaction with the
        Messenger chat is stored by Facebook, and we do not store your messages
        on our servers.
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        4. How We Protect Your Data
      </h2>
      <p className="mb-6">
        We take appropriate security measures to protect your personal
        information from unauthorized access, alteration, disclosure, or
        destruction. Despite these measures, no online data transmission is
        guaranteed to be 100% secure. We encourage you to take steps to protect
        your personal information, including using strong passwords and
        safeguarding your login credentials.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
      <p className="mb-6">
        Our website may contain links to third-party websites, including social
        media platforms like Facebook. We are not responsible for the privacy
        practices of these third-party websites. We encourage you to review the
        privacy policies of any external sites you visit.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
      <p className="mb-6">
        We retain your personal data only for as long as necessary to fulfill
        the purposes outlined in this Privacy Policy or as required by law. For
        example, order information will be retained for accounting and legal
        compliance.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
      <p className="mb-6">As a user, you have the right to:</p>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <strong>Access</strong> the personal data we hold about you.
        </li>
        <li>
          <strong>Request correction</strong> of inaccurate or incomplete
          information.
        </li>
        <li>
          <strong>Request deletion</strong> of your personal data, except when
          we are required to retain it for legal purposes.
        </li>
        <li>
          <strong>Opt-out</strong> of receiving promotional communications from
          us.
        </li>
      </ul>

      <p className="mb-6">
        To exercise any of these rights, please contact us at{" "}
        <strong>support@priorbd.com</strong>.
      </p>

      <h2 className="text-2xl font-semibold mb-4">
        8. Changes to This Privacy Policy
      </h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or legal obligations. Any changes will be posted on
        this page, and we will notify you of significant updates. We encourage
        you to review this Privacy Policy periodically.
      </p>

      <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
      <p className="mb-6">
        If you have any questions or concerns regarding this Privacy Policy or
        our data practices, feel free to contact us at:
      </p>
      <ul className="list-disc pl-6 mb-6">
        <li>
          <strong>Email</strong>: prior.retailshop.info.bd@gmail.com
        </li>
        <li>
          <strong>Phone</strong>: +880-1700534317
        </li>
        <li>
          <strong>Address</strong>: Dhanmondi 27, Genetic Plaza shop no: 134,
          Dhaka, Bangladesh
        </li>
      </ul>
    </div>
  );
};

export default PrivacyPolicy;
