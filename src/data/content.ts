import { getRandomCollection } from "./contentSet";

export const headerSection={
    title:" Discover Your Perfect Pair",
    description:"Explore our curated collection of stylish shoes and bags designed just for you. Find the perfect match for any occasion with our exclusive range of fashion-forward products.",
}

export const mobileHeaderSectionImages=[
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494246/prior/iqir3bzii2vkc4cv132y.jpg",
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494258/prior/xcgfoyxnixpbmzg09i92.jpg",
            "https://res.cloudinary.com/deajqyzno/image/upload/v1717494262/prior/cwzzn4mkcib8r4zye7uo.jpg",
          ];

export const productsSection = {
  heading: "Discover Elegant Women's Footwear & Handbags",
  description:
    "Step into elegance with our exquisite selection of women's footwear and handbags. Browse through our collection of classy shoes and stylish handbags to complete your look. Shop now!",
};

export const prices = ["Below 3000", "Below 4000", "Below 8000", "Below 10000"];

export const promotionTag = {
  heading: "Prior Your Priority",
  description:
    "Embrace grace and glamour with our women's shoes and handbags. Discover versatile styles that blend sophistication with comfort, curated for the modern woman.",
};

export const collectionTag = getRandomCollection();




export const newProductPageContent = {
 title:"New In Town",
    description:"Explore our curated collection of stylish shoes and bags designed just for you. Find the perfect match for any occasion with our exclusive range of fashion-forward products.",
};

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