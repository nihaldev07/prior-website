const collections = [
  {
    title: "Discover Your Perfect Pair",
    description: "Explore our curated collection of stylish shoes and bags designed just for you. Find the perfect match for any occasion with our exclusive range of fashion-forward products.",
  },
  {
    title: "Step Into Elegance",
    description: "With each step, embrace the elegance that adorns your feet, as our stunning collection whispers tales of beauty and grace.",
  },
  {
    title: "Chase Your Dreams",
    description: "Unleash your spirit with our whimsical shoes and bags, crafted to inspire adventures and ignite your passion for fashion.",
  },
  {
    title: "The Art of Styling",
    description: "Each piece tells a story; let our stylish shoes and bags be the brushstrokes on your canvas of creativity.",
  },
  {
    title: "Sculpted for You",
    description: "Discover the artistry of design in our collection, where every shoe and bag is sculpted to accentuate your unique beauty.",
  },
  {
    title: "Dance Through Life",
    description: "Find the rhythm of style with our delightful shoes and bags, perfect for twirling through life’s joyous moments.",
  },
  {
    title: "A Touch of Glamour",
    description: "Elevate your ensemble with our exquisite selection, where each piece sparkles with the allure of a starry night.",
  },
  {
    title: "Embrace Your Inner Goddess",
    description: "Step confidently in our collection that celebrates the divine femininity within you, making every day a catwalk.",
  },
  {
    title: "Chic and Unique",
    description: "Stand out with our bold and beautiful designs, curated for the trendsetter who dares to be different.",
  },
  {
    title: "Whispers of Nature",
    description: "Let the beauty of nature inspire your style with our collection that embodies the essence of earthy elegance.",
  },
  {
    title: "Timeless Treasures",
    description: "Discover shoes and bags that transcend time, becoming cherished pieces in your fashion journey.",
  },
  {
    title: "Find Your Signature Style",
    description: "Let our collection guide you in crafting a style that speaks volumes, celebrating your individuality.",
  },
  {
    title: "Journey in Comfort",
    description: "Experience the perfect blend of comfort and chic with our thoughtfully designed shoes, crafted for every adventure.",
  },
  {
    title: "Radiate Confidence",
    description: "Step out with poise and confidence, wearing our collection that enhances your natural allure.",
  },
  {
    title: "Playful Patterns",
    description: "Unleash your fun side with our vibrant shoes and bags, designed to add a splash of joy to your day.",
  },
  {
    title: "Elegance Redefined",
    description: "Reimagine sophistication with our modern takes on classic styles, blending tradition with contemporary flair.",
  },
  {
    title: "Unveil Your Charm",
    description: "Let our enchanting collection draw out your charm, making every outfit a delightful expression of who you are.",
  },
  {
    title: "Forever in Bloom",
    description: "Celebrate the beauty of femininity with our floral-inspired shoes and bags, a perfect match for any occasion.",
  },
  {
    title: "Sparkle in Every Step",
    description: "Add a twinkle to your stride with our dazzling designs, perfect for those who love to shine.",
  },
  {
    title: "Your Go-To Collection",
    description: "Find the perfect essentials that seamlessly blend style and function, making them your everyday favorites.",
  },
  {
    title: "Elegance Meets Adventure",
    description: "Step boldly into the unknown, equipped with our stylish shoes and bags designed for the modern explorer.",
  },
  {
    title: "A Symphony of Style",
    description: "Compose your unique style with our harmonious collection, where each piece resonates with elegance.",
  },
  {
    title: "Fashion’s Embrace",
    description: "Let our warm and inviting collection wrap you in fashion’s embrace, making every moment memorable.",
  },
  {
    title: "A Dance of Colors",
    description: "Express yourself with our colorful collection, a delightful dance of hues that brighten your wardrobe.",
  },
  {
    title: "Moments of Joy",
    description: "Capture life’s sweetest moments with our collection, designed to add joy and style to your everyday adventures.",
  },
  {
    title: "Whimsical Wonders",
    description: "Explore our whimsical shoes and bags, crafted for those who dare to dream and delight in fashion.",
  },
  {
    title: "Charming Curations",
    description: "Each piece is a charm waiting to add a sprinkle of magic to your outfit, making you feel enchanting.",
  },
  {
    title: "Classic Yet Contemporary",
    description: "Find the perfect balance between classic charm and modern elegance in our curated collection.",
  },
  {
    title: "Elegance in Motion",
    description: "Discover styles that move with you, embodying elegance and grace in every step you take.",
  },
  {
    title: "Celebrate Your Uniqueness",
    description: "Find pieces that reflect your individuality, celebrating the beauty of being uniquely you.",
  },
  {
    title: "Fashion-Forward Finds",
    description: "Stay ahead of the trends with our carefully selected collection that speaks to the modern woman.",
  },
  {
    title: "Step into Serenity",
    description: "Embrace tranquility with our serene styles, designed to bring peace and harmony to your wardrobe.",
  },
  {
    title: "Chic Comfort",
    description: "Experience the perfect harmony of style and comfort, ensuring you feel fabulous all day long.",
  },
  {
    title: "Inspired by You",
    description: "Our collection is a reflection of your desires, inspired by the woman who knows her worth.",
  },
  {
    title: "A Touch of Whimsy",
    description: "Add a playful twist to your style with our charming designs that are sure to make you smile.",
  },
  {
    title: "Curate Your Dream Wardrobe",
    description: "Let our collection be the stepping stones in curating a wardrobe that fulfills your fashion dreams.",
  },
  {
    title: "Enchanting Essentials",
    description: "Discover essential pieces that enchant and elevate your style for any occasion.",
  },
  {
    title: "Style with Heart",
    description: "Wear your heart on your sleeve, and let your style reflect the beauty within you.",
  },
  {
    title: "Fashion Meets Function",
    description: "Find the perfect blend of practicality and style, ensuring you never have to compromise.",
  },
  {
    title: "Bloom with Confidence",
    description: "Let your style blossom, radiating confidence and grace with each step you take.",
  },
  {
    title: "Timeless Trends",
    description: "Stay stylish with our collection that merges timeless trends with contemporary flair.",
  },
  {
    title: "Glistening Dreams",
    description: "Let your dreams sparkle with our dazzling collection, designed for the woman who loves to shine.",
  },
  {
    title: "Style Beyond Seasons",
    description: "Find versatile pieces that transcend seasons, becoming staples in your wardrobe.",
  },
  {
    title: "Your Style Story",
    description: "Craft your unique style story with our carefully curated collection, celebrating your journey.",
  },
  {
    title: "A Canvas of Colors",
    description: "Paint your world with our vibrant collection, where each piece adds a splash of color to your life.",
  },
  {
    title: "Sculpt Your Style",
    description: "Let your style take shape with our sculpted designs, tailored to enhance your elegance.",
  },
  {
    title: "Effortless Chic",
    description: "Embrace effortless elegance with our collection, making stylish living easy and enjoyable.",
  },
  {
    title: "A Dreamy Collection",
    description: "Lose yourself in our dreamy collection, designed to evoke feelings of joy and enchantment.",
  },
  {
    title: "Every Step Matters",
    description: "Each step tells a story; make yours unforgettable with our stunning footwear and bags.",
  },
  {
    title: "Cherished Choices",
    description: "Find your cherished choices in our collection, where each piece is selected with love and care.",
  },
  {
    title: "Unleash Your Style",
    description: "Unleash your inner fashionista with our collection, empowering you to express your unique style.",
  },
  {
    title: "The Essence of You",
    description: "Our collection captures the essence of you, enhancing your natural beauty with each piece.",
  },
];

export const getRandomCollection = () => {
  const randomIndex = Math.floor(Math.random() * collections.length);
  return collections[randomIndex];
};