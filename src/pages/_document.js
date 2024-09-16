// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';
import Script from "next/script";

export default function Document() {
   useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "3457721097853933", // Replace with your Facebook App ID
        xfbml: true,
        version: "v16.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);
  return (
    <Html>
      <Head>
        {/* Messenger Chat Plugin Code */}
        {/* The Facebook Messenger Chat Plugin */}
        <Script
          id="fb-customer-chat"
          dangerouslySetInnerHTML={{
            __html: `
              var chatbox = document.getElementById('fb-customer-chat');
              chatbox.setAttribute("page_id", "101545885029757"); // Replace with your Page ID
              chatbox.setAttribute("attribution", "biz_inbox");
            `,
          }}
        />

        {/* Chat Plugin Code */}
        <div id="fb-root"></div>
        <div id="fb-customer-chat" className="fb-customerchat"></div>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
