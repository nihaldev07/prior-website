import { title } from "process";
import { getRandomCollection, getRandomSeoFromFirstSetCollection, getRandomSeoFromHeaderSetCollection, getRandomSeoFromSecondSetCollection, getRandomSeoFromThridSetCollection } from "./contentSet";

export const headerSection= {title:getRandomSeoFromHeaderSetCollection().title,description:getRandomSeoFromHeaderSetCollection().description};

export const mobileHeaderSectionImages=[
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494246/prior/iqir3bzii2vkc4cv132y.jpg",
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494258/prior/xcgfoyxnixpbmzg09i92.jpg",
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494262/prior/cwzzn4mkcib8r4zye7uo.jpg",
          ];

export const productsSection = {heading:getRandomSeoFromSecondSetCollection().header,description:getRandomSeoFromSecondSetCollection().description};

export const prices = ["Below 3000", "Below 4000", "Below 8000", "Below 10000"];

export const promotionTag = {
  heading: "Prior Your Priority",
  description:
    getRandomCollection().description
};

export const collectionTag = getRandomCollection();




export const newProductPageContent = {title:getRandomSeoFromFirstSetCollection().header,description:getRandomSeoFromFirstSetCollection().description};

export const footerData = {
  description:
    "Dhaka, Dhanmondi 27, Genetic Plaza, Shop no : 134\nMobile: +8801700534317\nEmail: prior.retailshop.info.bd@gmail.com",
  footerLinks: [
    {
      title: "Main Pages",
      links: [
        { href: "/home", name: "Home" },
        { href: "/collections", name: "Collections" },
        { href: "/cart", name: "Cart" },
        { href: "/checkout", name: "Checkout" },
      ],
    },
    // {
    //   title: "Single Pages",
    //   links: [
    //     { href: "/product/yellowLow", name: "Product Single" },
    //     {
    //       href: "/blog/the-evolution-of-sneaker-culture-a-historical-perspective",
    //       name: "Blog Single",
    //     },
    //   ],
    // },
    {
      title: "Contact Us",
      links: [{ href: "/rt", name: "Not Found" }],
    },
    {
      title: "Term & Conditions",
      links: [
        { href: "/faq", name: "FAQS" },
        // { href: "/contact", name: "Contact" },
        // { href: "/forgot-pass", name: "Forgot Password" },
        // { href: "/login", name: "Login" },
        // { href: "/signup", name: "Signup" },
      ],
    },
  ],
};

export const footerBannerData = {
  heading: "BRINGING YOU TO UPDATE WITH FANTASTIC FOOTWEAR",
  description:
    "View all brands of our collection, there is another collection. Please check it out, like seriously",
};