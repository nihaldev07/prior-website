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


const seoPoetryMessagesList1 = [
  {
    header: "Timeless Styles for Every Occasion",
    description: "Find the perfect blend of elegance and comfort with our versatile footwear and handbags, designed to accompany you through every moment of your life.",
  },
  {
    header: "Walk in Comfort, Shine in Style",
    description: "Let your feet revel in comfort while you make a fashion statement. Our curated collection of shoes offers both elegance and ease for the modern woman.",
  },
  {
    header: "Luxury Handbags That Speak Elegance",
    description: "Carry your world in style with our stunning handbags, where elegance meets functionality. Discover pieces that are as unique as you.",
  },
  {
    header: "Heels That Elevate, Flats That Soothe",
    description: "From glamorous heels that make you stand tall to comfy flats that bring ease to your steps, find shoes that match your every mood.",
  },
  {
    header: "Fashion That Inspires Confidence",
    description: "Discover shoes and handbags that not only elevate your outfit but boost your confidence, making you feel your best with every step.",
  },
  {
    header: "A Shoe for Every Story You Tell",
    description: "Whether you're headed to a gala or a casual outing, our collection ensures there's a shoe for every chapter of your life.",
  },
  {
    header: "The Perfect Handbag for Every Journey",
    description: "Explore handbags designed to complement your everyday adventures, each one crafted to add elegance to your travels near and far.",
  },
  {
    header: "Grace Meets Glamour in Every Step",
    description: "Step into a world where grace and glamour go hand in hand, with footwear that reflects your poise and personality.",
  },
  {
    header: "Find Your Dream Pair Today",
    description: "Fall in love with shoes that are as comfortable as they are beautiful. Discover your dream pair and step into a world of style.",
  },
  {
    header: "Handbags to Cherish, Designs to Love",
    description: "Adorn your shoulder with handbags that speak to your heart. Elegant, functional, and forever fashionable.",
  },
  {
    header: "A Style Journey Begins with the Perfect Shoe",
    description: "Your style journey starts with us. Find the perfect pair that aligns with your unique sense of style and completes your every look.",
  },
  {
    header: "Handbags for the Bold & Beautiful",
    description: "For the bold, beautiful, and unstoppable woman—our handbag collection is designed to turn heads and hold everything you need.",
  },
  {
    header: "Footwear for All-Day Elegance",
    description: "Whether you're conquering the boardroom or dancing through the night, our footwear ensures all-day comfort and elegance.",
  },
  {
    header: "Unleash Your Inner Diva with Our Footwear",
    description: "Slip into shoes that not only reflect your style but let your inner diva shine. Every step is a statement.",
  },
  {
    header: "The Art of Craftsmanship in Every Handbag",
    description: "Indulge in handbags that showcase the art of craftsmanship. Each piece is a testament to timeless design and enduring quality.",
  },
  {
    header: "Step Into Fashion, Step Into You",
    description: "Our footwear isn't just about fashion; it's about stepping into the best version of yourself with each stride.",
  },
  {
    header: "Elegant Handbags for Your Everyday Adventures",
    description: "From workdays to weekends, our handbags are designed to carry your essentials in style, no matter where life takes you.",
  },
  {
    header: "Shoes That Whisper Comfort, Shout Style",
    description: "Feel the comfort with every step and showcase your style with every glance. Discover shoes that balance both perfectly.",
  },
  {
    header: "The Handbag That Complements Your Aura",
    description: "Find a handbag that doesn’t just carry your essentials but complements your aura and adds to your chic presence.",
  },
  {
    header: "Shoes Designed to Fit Every Chapter of Life",
    description: "From your first step into the office to an evening out, our collection is here to support and enhance every chapter of your journey.",
  },
];


const seoPoetryMessagesList2 = [
  {
    header: "Feel Chic, Stay Comfortable",
    description: "Who says you can't have it all? Our chic yet comfortable collection of shoes proves that style and ease can go hand in hand.",
  },
  {
    header: "Exquisite Handbags for the Elegant Woman",
    description: "Crafted for elegance and designed for utility, our handbags redefine luxury. Explore pieces that add grace to your day.",
  },
  {
    header: "Shoes That Celebrate Every Woman",
    description: "From high heels to comfy flats, celebrate your unique style with shoes that are made for every woman, every day.",
  },
  {
    header: "Carry Confidence, Wear Elegance",
    description: "Step into confidence with shoes and handbags that elevate your everyday wardrobe and make you feel unstoppable.",
  },
  {
    header: "Sophisticated Shoes for Every Mood",
    description: "From playful to polished, our footwear collection caters to every mood, occasion, and outfit in your wardrobe.",
  },
  {
    header: "Handbags that Mirror Your Elegance",
    description: "Explore handbags that are not just fashion statements but reflections of your elegance and sophistication.",
  },
  {
    header: "Heels That Lift You Higher, Flats That Ground You",
    description: "Discover footwear that empowers you—whether it's the height of a heel or the comfort of a flat, you’re always grounded in style.",
  },
  {
    header: "Fashion-Forward Shoes for the Modern Woman",
    description: "Embrace fashion-forward designs that keep you ahead of the style curve while ensuring unmatched comfort.",
  },
  {
    header: "Bags that Carry More Than Just Your Essentials",
    description: "Our handbags are designed to carry more than just your essentials—they carry your confidence, grace, and personal flair.",
  },
  {
    header: "Shoes That Make Every Step Count",
    description: "Walk through life with shoes that blend beauty, comfort, and elegance. Every step you take will be your favorite.",
  },
  {
    header: "Every Handbag, a New Story to Tell",
    description: "Let each handbag tell a story of sophistication, elegance, and effortless charm—crafted for every woman’s unique narrative.",
  },
  {
    header: "Comfort in Every Sole, Style in Every Stitch",
    description: "Discover footwear that is intricately crafted for comfort without compromising on style. Every sole tells a story.",
  },
  {
    header: "Your Journey Begins with the Perfect Handbag",
    description: "Start every adventure with a handbag that carries your essentials and exudes elegance in every thread.",
  },
  {
    header: "Shoes That Speak Volumes About Your Style",
    description: "Find footwear that speaks volumes about who you are—elegant, bold, and undeniably stylish.",
  },
  {
    header: "Handbags as Unique as You Are",
    description: "Carry handbags that reflect your individuality, each one designed with careful attention to detail and elegance.",
  },
  {
    header: "A Shoe Collection That Transforms Your Wardrobe",
    description: "Step up your fashion game with shoes that transform any outfit into a head-turning ensemble.",
  },
  {
    header: "Embrace the Beauty of a Well-Crafted Handbag",
    description: "Feel the beauty of craftsmanship with handbags that add a touch of elegance to your everyday life.",
  },
  {
    header: "Footwear That Takes You from Day to Night",
    description: "Our versatile footwear collection is designed to seamlessly take you from day to night in style and comfort.",
  },
  {
    header: "Handbags That Define Effortless Elegance",
    description: "Effortless elegance comes naturally with our handbags—crafted for the modern woman who loves style and practicality.",
  },
  {
    header: "Shoes That Fit Like a Dream",
    description: "Find shoes that don’t just fit your feet but fit your dreams, perfectly balancing comfort and sophistication.",
  },
];


const seoPoetryMessagesList3 = [
  {
    header: "Carry Your World in Style",
    description: "Discover handbags that are designed to carry your world in style, blending luxury, functionality, and elegance.",
  },
  {
    header: "Heels That Lift You Higher, Flats That Ground You",
    description: "Discover footwear that empowers you—whether it's the height of a heel or the comfort of a flat, you’re always grounded in style.",
  },
  {
    header: "Chic Handbags for Every Occasion",
    description: "From casual outings to special occasions, our handbags are crafted to complement every moment of your life.",
  },
  {
    header: "Fashion That Inspires Confidence",
    description: "Discover shoes and handbags that not only elevate your outfit but boost your confidence, making you feel your best with every step.",
  },
  {
    header: "The Handbag That Complements Your Aura",
    description: "Find a handbag that doesn’t just carry your essentials but complements your aura and adds to your chic presence.",
  },
  {
    header: "Find Your Dream Pair Today",
    description: "Fall in love with shoes that are as comfortable as they are beautiful. Discover your dream pair and step into a world of style.",
  },
  {
    header: "A Shoe for Every Story You Tell",
    description: "Whether you're headed to a gala or a casual outing, our collection ensures there's a shoe for every chapter of your life.",
  },
  {
    header: "Timeless Styles for Every Occasion",
    description: "Find the perfect blend of elegance and comfort with our versatile footwear and handbags, designed to accompany you through every moment of your life.",
  },
  {
    header: "Celebrate Every Step You Take",
    description: "Our shoes encourage you to celebrate every step you take, offering both comfort and chic style for the modern woman.",
  },
  {
    header: "Discover Fashion That Defines You",
    description: "Let our handbags and shoes reflect your individuality, creating a signature style that defines who you are.",
  },
  {
    header: "Elegance Meets Comfort in Our Collection",
    description: "Experience the perfect harmony of elegance and comfort with our beautifully crafted footwear and handbags.",
  },
  {
    header: "The Perfect Accessories for Every Outfit",
    description: "Complete your look with our stunning range of footwear and handbags—your perfect style companions.",
  },
  {
    header: "Step into Fashion, Step into You",
    description: "Our footwear isn't just about fashion; it's about stepping into the best version of yourself with each stride.",
  },
  {
    header: "Explore Handbags That Make a Statement",
    description: "Find handbags that not only hold your essentials but also make a bold fashion statement, expressing your unique style.",
  },
  {
    header: "Heels That Celebrate Your Spirit",
    description: "Dance through life in heels that celebrate your spirit and style, offering both grace and strength.",
  },
  {
    header: "Fashion Forward Footwear for the Modern Woman",
    description: "Stay ahead of the trends with footwear that blends fashion-forward designs with all-day comfort.",
  },
  {
    header: "Handbags That Carry Your Essence",
    description: "Our handbags are designed to carry your essence—practical, stylish, and uniquely you.",
  },
  {
    header: "Elevate Your Everyday with Our Handbags",
    description: "Transform your daily routine into a stylish experience with handbags that elevate every outfit effortlessly.",
  },
  {
    header: "Where Comfort Meets Chic",
    description: "Discover the ultimate fusion of comfort and chic style with footwear that makes you feel fabulous, all day long.",
  },
  {
    header: "Every Handbag, a New Story to Tell",
    description: "Let each handbag tell a story of sophistication, elegance, and effortless charm—crafted for every woman’s unique narrative.",
  },
  {
    header: "Step Up Your Style Game",
    description: "Explore our curated collection of footwear and handbags designed to elevate your style game, making every outfit extraordinary.",
  },
];


export const getRandomCollection = () => {
  const randomIndex = Math.floor(Math.random() * collections.length);
  return collections[randomIndex];
};

export const getRandomSeoFromFirstSetCollection = () => {
  const randomIndex = Math.floor(Math.random() * seoPoetryMessagesList1.length);
  return seoPoetryMessagesList1[randomIndex];
};

export const getRandomSeoFromSecondSetCollection = () => {
  const randomIndex = Math.floor(Math.random() * seoPoetryMessagesList2.length);
  return seoPoetryMessagesList2[randomIndex];
};


export const getRandomSeoFromThridSetCollection = () => {
  const randomIndex = Math.floor(Math.random() * seoPoetryMessagesList3.length);
  return seoPoetryMessagesList3[randomIndex];
};