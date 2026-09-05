/**
 * InstaForge Storage Management & Curated Visual Style Library
 */

export interface BrandKit {
  brand: string;
  description: string;
  industry: string;
  audience: string;
  personality: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  typography: string;
  visual_style: string;
  photography_style: string;
  lighting_style: string;
  background_style: string;
  positioning: string;
  words_to_use: string;
  words_to_avoid: string;
  cta_language: string;
  visual_references: string;
  active: boolean;
}

export interface PromptHistoryItem {
  id: string;
  date: string;
  mode: string;
  modeName: string;
  title: string;
  brief: string;
  prompt: string;
  ratio: string;
  style: string;
  result?: Record<string, unknown>;
}

export type HistoryItem = PromptHistoryItem;

export interface UploadedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  name: string;
  size: number;
  aspectRatio: string;
  mode: string;
  promptTitle: string;
  promptText: string;
  tags: string[];
  createdAt: string;
  fileId?: string | undefined;
}

export interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
  privateKey: string;
  folder: string;
}

export interface VisualStylePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  modifiers: string;
  lighting: string;
  colorTone: string;
  aspectRatio: string;
  isCustom?: boolean | undefined;
  sampleUrl?: string | undefined;
}

export interface AppSettings {
  defaultProvider: "bandelbanget" | "gemini" | "groq";
  aiApiKey: string;
  aiBaseUrl: string;
  aiModel: string;
  geminiKeys: string;
  geminiModel: string;
  groqKeys: string;
  groqModel: string;
  redisUrl: string;
  redisToken: string;
  imagekit: ImageKitConfig;
}

const BRAND_KEY = "ics.brandkit";
const HISTORY_KEY = "ics.history";
const GALLERY_KEY = "ics.gallery";
const STYLES_KEY = "ics.styles";
const SETTINGS_KEY = "ics.settings";

const isBrowser = () => typeof window !== "undefined";

export const EMPTY_BRAND_KIT: BrandKit = {
  brand: "",
  description: "",
  industry: "",
  audience: "",
  personality: "",
  primary_color: "#FF4F55",
  secondary_color: "#651017",
  accent_color: "#FFF3F3",
  typography: "",
  visual_style: "",
  photography_style: "",
  lighting_style: "",
  background_style: "",
  positioning: "",
  words_to_use: "",
  words_to_avoid: "",
  cta_language: "",
  visual_references: "",
  active: true,
};

export const DEFAULT_IMAGEKIT: ImageKitConfig = {
  publicKey: "",
  urlEndpoint: "https://ik.imagekit.io/instagramstudio",
  privateKey: "",
  folder: "/instagram-studio",
};

export const DEFAULT_SETTINGS: AppSettings = {
  defaultProvider: "bandelbanget",
  aiApiKey: "",
  aiBaseUrl: "https://bandelbanget.xyz/v1",
  aiModel: "auto",
  geminiKeys: "",
  geminiModel: "gemini-2.5-flash",
  groqKeys: "",
  groqModel: "llama-3.3-70b-versatile",
  redisUrl: "",
  redisToken: "",
  imagekit: DEFAULT_IMAGEKIT,
};

/**
 * 40 Curated, Deduplicated Master Visual Styles across 7 Clean Core Categories
 */
export const DEFAULT_VISUAL_STYLES: VisualStylePreset[] = [
  // 🏡 Home & Real Estate (5)
  {
    id: "luxury_twilight_villa",
    name: "Luxury Twilight Villa & Pool",
    category: "Home & Real Estate",
    description:
      "Multi-angle architectural composition of high-end eco villa with illuminated pool deck and twilight horizon.",
    modifiers:
      "High-end luxury travel editorial, twilight blue hour sky, illuminated infinity pool, bamboo architecture, cyan neon HUD accents.",
    lighting: "Warm 3000K interior architectural lights contrasting with deep blue hour dusk",
    colorTone: "Twilight blue, warm amber interior, cyan neon glow",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_001.jpg",
    isCustom: false,
  },
  {
    id: "japandi_walnut_table",
    name: "Japandi Solid Walnut Dining Table",
    category: "Home & Real Estate",
    description:
      "American walnut dining table in sunlit Japandi curved arch room with 3 frosted glass specs and leather CTA.",
    modifiers:
      "Architectural interior photography, solid walnut wood grain, travertine curved arch, morning sunbeams, frosted glass cards.",
    lighting: "Warm golden morning sun streaming through large floor-to-ceiling arch",
    colorTone: "American walnut brown (#5D4037), warm sand beige, cognac leather",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_008.jpg",
    isCustom: false,
  },
  {
    id: "scandinavian_real_estate_split",
    name: "Scandinavian Real Estate Split View",
    category: "Home & Real Estate",
    description:
      "Vertical split showing Japandi 2-story home exterior at twilight and sun-drenched warm furnished interior living room.",
    modifiers:
      "Architectural photography, warm interior light spill, slatted wood facade, warm beige linen sofa, Scandinavian round coffee table.",
    lighting: "Golden hour exterior dusk transition + warm 3000K interior recessed lighting",
    colorTone: "Warm architectural terracotta, Scandinavian blonde wood, cream linen",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_018.jpg",
    isCustom: false,
  },
  {
    id: "slow_living_tableware",
    name: "Slow Living Stoneware & Brass Cutlery",
    category: "Home & Real Estate",
    description:
      "4-quadrant grid showing stoneware bowl stack, ceramic mug on rattan, matte brass cutlery, and folded linen napkin with rosemary.",
    modifiers:
      "Slow living tabletop editorial, speckled stoneware hand-thrown ceramic, brushed brass cutlery, folded natural flax linen.",
    lighting: "Soft warm morning natural window sun casting delicate dried flower shadows",
    colorTone: "Earthy oatmeal beige, stoneware cream, matte brass gold (#CA8A04)",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_022.jpg",
    isCustom: false,
  },
  {
    id: "island_cruise_open_trip",
    name: "Raja Ampat Island Cruise Diorama",
    category: "Home & Real Estate",
    description:
      "Miniature 3D floating island with white-and-teal boat tour cruising crystal turquoise coral reef water on a marble pedestal.",
    modifiers:
      "3D commercial travel diorama, ultra-clear cross-section turquoise ocean water, vibrant living coral reef, tropical karst islands.",
    lighting: "Bright tropical midday sunshine glistening on turquoise ocean surface",
    colorTone: "Turquoise lagoon (#06B6D4), deep sea emerald (#0F766E), white marble",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_031.jpg",
    isCustom: false,
  },

  // 💄 Beauty & Skincare (6)
  {
    id: "problem_solution_serum",
    name: "Dermatology Problem-Solution Serum",
    category: "Beauty & Skincare",
    description:
      "Korean model holding cheek with glowing serum bottle, orange slice, and 3 macro skin texture callout circles.",
    modifiers:
      "Commercial skincare ad, radiant skin finish, amber glass dropper bottle, backlit orange vesicles, dashed zoom-in skin callouts.",
    lighting: "Soft warm morning studio beauty lighting with backlit citrus translucency",
    colorTone: "Warm honey orange (#F97316), cream white, peach blush",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_002.jpg",
    isCustom: false,
  },
  {
    id: "floating_serum_ring",
    name: "Luxury Serum with Glowing Glass Ring",
    category: "Beauty & Skincare",
    description:
      "Floating amber dropper bottle with glowing glass refraction torus ring, water droplets, and fresh citrus slices.",
    modifiers:
      "Cosmetic beauty commercial render, floating amber glass bottle, illuminated pink glass refraction torus, fresh blood orange slices.",
    lighting: "High-key radiant beauty softbox lighting with glowing rim refractions",
    colorTone: "Rose gold pink (#F43F5E), amber serum glow, fresh citrus orange",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_021.jpg",
    isCustom: false,
  },
  {
    id: "sunscreen_serum_water_ripple",
    name: "Sunscreen Serum on Water Caustics",
    category: "Beauty & Skincare",
    description:
      "Sunscreen serum dropper bottle covered in water droplets resting on round terrazzo pedestal in clear shimmering pool water.",
    modifiers:
      "Sunscreen commercial photography, water droplets on glass bottle, aquatic caustics water ripples, green tropical leaves.",
    lighting: "Bright tropical midday sunlight creating caustics light patterns underwater",
    colorTone: "Cyan pool turquoise (#14B8A6), fresh leaf green, clear glass",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_035.jpg",
    isCustom: false,
  },
  {
    id: "luxury_silk_jewelry",
    name: "Carrara Marble & Lilac Silk Jewelry",
    category: "Beauty & Skincare",
    description:
      "Chunky 925 silver chain, braided leather bracelet, and acetate sunglasses on Carrara marble slab with lilac silk drapery.",
    modifiers:
      "High jewelry editorial, polished sterling silver specular highlights, genuine Carrara marble slab, flowing violet silk drapery.",
    lighting: "Soft high-end beauty diffusion with crisp pinpoint silver highlights",
    colorTone: "Pastel lilac violet (#8B5CF6), polished chrome silver, Carrara white marble",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_016.jpg",
    isCustom: false,
  },
  {
    id: "facial_features_analysis",
    name: "Facial Aesthetics & Hijab Infographic",
    category: "Beauty & Skincare",
    description:
      "Portrait of smiling Indonesian woman wearing soft beige hijab with 6 callout pointer boxes detailing facial features.",
    modifiers:
      "Aesthetic clinic infographic, realistic Indonesian model in batik and beige hijab, clean line pointers, minimalist feature cards.",
    lighting: "Bright soft daylight beauty illumination with clean facial highlights",
    colorTone: "Soft warm cream, oat beige, golden batik pattern",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_032.jpg",
    isCustom: false,
  },
  {
    id: "herbal_supplement_apothecary",
    name: "Natural Herbal Immunity Apothecary",
    category: "Beauty & Skincare",
    description:
      "Amber glass supplement jar with kraft paper label surrounded by fresh ginger root, turmeric slices, and herbal roots on linen.",
    modifiers:
      "Natural wellness apothecary photography, amber glass bottle with gold cap, fresh sliced turmeric rhizomes, dried herbal root bowl.",
    lighting: "Soft warm morning botanical sunlight filtering through fresh basil leaves",
    colorTone: "Botanical green (#16A34A), turmeric orange (#F59E0B), ginger root tan",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_040.jpg",
    isCustom: false,
  },

  // 🍽️ Food & Beverage (8)
  {
    id: "grid_aqiqah_catering",
    name: "9-Grid Bento & Aqiqah Catering Feast",
    category: "Food & Beverage",
    description:
      "Unified 9-post campaign showing top-down bento boxes, lamb satay skewers, sheep plush mascot, and 4.9/5 reviews.",
    modifiers:
      "Top-down food photography, rich Indonesian catering bento box, steaming satay, terracotta brand branding, 9-grid narrative.",
    lighting: "Bright warm ambient dining room lighting with natural soft shadows",
    colorTone: "Terracotta red (#C0392B), cream linen, fresh green herbs, warm gold",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_003.jpg",
    isCustom: false,
  },
  {
    id: "grid_fried_chicken_franchise",
    name: "9-Grid Fried Chicken Franchise Ad",
    category: "Food & Beverage",
    description:
      "Mouthwatering golden crunchy fried chicken overflowing from yellow box, smartphone mockup, and 25 JT investment hook.",
    modifiers:
      "Fast food commercial photography, ultra-crispy golden fried chicken skin, steam wisps, bright red and yellow appetite colors.",
    lighting: "Warm directional studio spotlight on golden fried chicken textures",
    colorTone: "Firetruck red (#DC2626), cheddar yellow (#F59E0B), crispy golden brown",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_006.jpg",
    isCustom: false,
  },
  {
    id: "traditional_culinary_poster",
    name: "Betawi Heritage Culinary Feast Poster",
    category: "Food & Beverage",
    description:
      "Dark crimson background with gold Betawi batik borders, Soto Betawi, Nasi Uduk, Sate Kambing, and vertical price list.",
    modifiers:
      "Indonesian culinary commercial poster, rich soto broth, charred sate skewers with peanut sauce, gold batik filigree corners.",
    lighting: "Warm appetizing overhead studio food lighting with rich saucy highlights",
    colorTone: "Deep crimson red (#881337), antique gold (#EAB308), rich coconut white",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_009.jpg",
    isCustom: false,
  },
  {
    id: "artisanal_cafe_croissant",
    name: "Iced Matcha Latte & Butter Croissant",
    category: "Food & Beverage",
    description:
      "Layered iced matcha latte in clear cup, hot cappuccino with latte art, and flaky golden butter croissant on rustic ceramic plate.",
    modifiers:
      "Artisanal food and beverage photography, vibrant green Uji matcha gradient, flaky laminated croissant pastry layers, warm morning cafe.",
    lighting: "Bright morning cafe window sun casting organic plant leaf shadows",
    colorTone: "Matcha forest green (#15803D), golden baked pastry crust, warm cafe cream",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_020.jpg",
    isCustom: false,
  },
  {
    id: "superfood_healthy_bowls",
    name: "Superfood Quinoa Bowls & Smoothies",
    category: "Food & Beverage",
    description:
      "Quinoa power bowl with sliced avocado and chickpeas, caesar salad, and vibrant green detox + berry booster smoothies.",
    modifiers:
      "Modern clean eating menu photography, fan-sliced ripe avocado, roasted sweet potato cubes, refreshing glass smoothies with berries.",
    lighting: "Bright natural window sunlight with crisp shadow lines on white marble",
    colorTone: "Fresh avocado green (#65A30D), berry purple (#7E22CE), clean white marble",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_033.jpg",
    isCustom: false,
  },
  {
    id: "artisan_cookies_pastry",
    name: "Artisan Nastar & Fudgy Brownies",
    category: "Food & Beverage",
    description:
      "A mouthwatering luxury artisanal bakery presentation featuring premium clear crystal jar tubs of glistening golden butter nastar cookies with shiny glossy egg wash and whole clove studs, crunchy kastengel topped with shredded aged Dutch Edam cheese flakes, snowy powdered sugar putri salju, dense ultra-fudgy dark chocolate brownies with shiny crinkly top crust cut into thick squares, alongside moist layered lapis surabaya cake slices, styled on a rustic reclaimed teak wood board dusted with organic wheat flour.",
    modifiers:
      "Master food photography shot on Hasselblad H6D-100c with HC 100mm f/2.2 lens at f/2.8, ISO 64, 1/125s shutter. Ultra-crisp macro focus revealing buttery flaky cookie textures, melted gooey chocolate chunks inside brownie crevices, fine grated edam cheese browned to perfection, soft ambient bakery kitchen backdrop with copper baking trays and floating flour dust particles, hyper-realistic reflections on glass containers, 8k resolution, cinematic commercial culinary advertisement.",
    lighting:
      "Warm 3200K golden morning sunlight streaming through vintage bakery window with soft dappled shadows, dual softbox rim-lighting highlighting glistening egg wash and rich chocolate sheen, gentle hot aromatic steam rising from fresh baked brownies",
    colorTone:
      "Warm golden buttery yellow (#F59E0B), deep cocoa espresso brown (#3E2723), snowy powdered white (#F8FAFC), warm kraft beige and dark walnut wood",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_034.jpg",
    isCustom: false,
  },
  {
    id: "specialty_coffee_kraft_pouch",
    name: "Specialty Coffee Single Origin Kraft Pouch",
    category: "Food & Beverage",
    description:
      "Matte brown kraft coffee pouch with gold foil Artisan Roast badge hovering above brass podium with floating roasted coffee beans.",
    modifiers:
      "Specialty coffee packaging commercial, foil stamped gold branding, floating roasted arabica beans with motion blur, warm sunbeam.",
    lighting: "Dramatic warm golden hour spotlight from upper left, catching coffee bean oils",
    colorTone: "Roasted coffee brown (#78350F), kraft tan (#D97706), metallic gold",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_036.jpg",
    isCustom: false,
  },
  {
    id: "nasi_goreng_sizzling_platter",
    name: "Sizzling Beef Nasi Goreng with Fried Egg",
    category: "Food & Beverage",
    description:
      "Cast iron plate of fragrant beef fried rice topped with sunny-side up egg with runny yolk, kerupuk, cucumber, and iced sweet tea.",
    modifiers:
      "Mouthwatering Indonesian food photography, tender beef cubes in fried rice, crispy fried shallots on golden egg yolk, tall iced tea glass.",
    lighting: "Warm directional restaurant spotlight accentuating rice grain glistening",
    colorTone: "Chili red (#EF4444), golden yolk yellow, savory dark soy brown",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_037.jpg",
    isCustom: false,
  },
  {
    id: "frozen_food_dimsum_ice",
    name: "Frozen Dimsum Packaging on Crushed Ice",
    category: "Food & Beverage",
    description:
      "Glossy white and blue stand-up pouch of Chicken & Shrimp Dimsum resting on crushed ice crystals with cold vapor frost wisps.",
    modifiers:
      "Commercial frozen food packaging, glistening crushed ice cubes, swirling cold vapor mist, bamboo steamer with steamed dimsum graphic.",
    lighting: "Crisp cool high-key commercial freezer lighting with sparkling ice reflections",
    colorTone: "Frost ice blue (#0284C7), bamboo tan, fresh shrimp orange",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_039.jpg",
    isCustom: false,
  },

  // 👗 Fashion & Apparel (8)
  {
    id: "quiet_luxury_menswear",
    name: "Quiet Luxury Linen Menswear Lookbook",
    category: "Fashion & Apparel",
    description:
      "Chambray shirt on wooden hanger, crisp white tee, and folded linen trousers on travertine stone steps with palm shadows.",
    modifiers:
      "Editorial menswear lookbook, natural 100% linen weave macro texture, diagonal window palm shadows, travertine stone steps.",
    lighting:
      "Natural afternoon sunlight streaming through wooden louvers with soft palm leaf silhouettes",
    colorTone: "Chambray denim blue, ecru cream, warm limestone beige",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_013.jpg",
    isCustom: false,
  },
  {
    id: "dynamic_athletic_runner",
    name: "Levitating Athletic Chunky Trail Runner",
    category: "Fashion & Apparel",
    description:
      "Levitating chunky trail running shoe with kinetic dirt particles, carbon plate sole, and mountain ridge sunrise backdrop.",
    modifiers:
      "Dynamic commercial footwear photography, floating sneaker, kinetic motion particles, breathable knit mesh detail, carbon fiber plate.",
    lighting: "High-contrast golden hour sun on mountain peak, dramatic backlight",
    colorTone: "Coral red (#EF4444), sandy beige knit, warm mountain sunrise",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_014.jpg",
    isCustom: false,
  },
  {
    id: "heritage_leather_goods",
    name: "Vintage Leather Messenger Bag Multiview",
    category: "Fashion & Apparel",
    description:
      "Vintage brown leather messenger bag on rustic wood crate with 3 macro inset cutouts of laptop slot and brass buckles.",
    modifiers:
      "Artisanal leathercraft photography, full-grain distressed leather patina, YKK brass hardware reflections, vintage film camera.",
    lighting: "Warm cinematic directional studio window light with rich shadow falloff",
    colorTone: "Cognac leather brown (#78350F), antique brass gold, dark rustic wood",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_015.jpg",
    isCustom: false,
  },
  {
    id: "dark_ceramic_chrono",
    name: "Black Ceramic Chronograph & Rose Gold",
    category: "Fashion & Apparel",
    description:
      "Black ceramic chronograph watch with rose gold sub-dials resting on black gold-veined marble slab and raw golden rock.",
    modifiers:
      "Master horology commercial photography, razor-sharp anti-reflective sapphire crystal, brushed rose gold pushers, raw golden rock.",
    lighting: "Dramatic dark moody low-key lighting with focused razor-sharp rim lights",
    colorTone: "Midnight obsidian black, 18k rose gold (#D97706), dark gold marble veins",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_017.jpg",
    isCustom: false,
  },
  {
    id: "silk_midi_dress",
    name: "Butter Yellow Silk Midi Dress Fit",
    category: "Fashion & Apparel",
    description:
      "Flowy pastel butter-yellow silk midi dress showing front cowl-neck and back strappy cutout floating in soft studio.",
    modifiers:
      "3D ghost mannequin apparel photography, fluid silk drape highlights, cowl neck detail, strappy open back, pastel pink room.",
    lighting: "Gentle diffused studio sunlight with soft romantic shadows",
    colorTone: "Butter yellow pastel (#FEF08A), lavender violet (#A855F7), soft blush",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_023.jpg",
    isCustom: false,
  },
  {
    id: "modest_raya_abaya",
    name: "Modest Raya Linen Abaya & Silk Hijab",
    category: "Fashion & Apparel",
    description:
      "Flowing oat-beige linen abaya on wooden hanger with pleated olive green silk hijab draped from brass rail against Islamic arch.",
    modifiers:
      "Luxury modest fashion lookbook, floating pleated silk drape, textured linen abaya, sage green architectural Islamic arch.",
    lighting: "Soft ambient architectural daylight with clean shadows",
    colorTone: "Sage olive green (#4D7C0F), oat linen beige, brushed brass gold",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_024.jpg",
    isCustom: false,
  },
  {
    id: "nude_block_heel_pump",
    name: "Italian Nude Leather Block-Heel Pumps",
    category: "Fashion & Apparel",
    description:
      "Nude blush Italian leather 5cm block-heel pumps (one levitating, one on round Carrara marble riser) with falling cherry petals.",
    modifiers:
      "High fashion footwear commercial, smooth Italian calfskin leather, Carrara marble riser with gold rim, floating cherry blossom petals.",
    lighting: "Soft pink high-key studio beauty lighting with specular marble sheen",
    colorTone: "Nude blush pink (#FBCFE8), warm rose gold, Carrara white",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_027.jpg",
    isCustom: false,
  },
  {
    id: "parisian_quilted_bag",
    name: "Parisian Quilted Ivory Luxury Handbag",
    category: "Fashion & Apparel",
    description:
      "Quilted ivory white leather bag with polished gold chain on marble table with soft-focus Eiffel Tower window view.",
    modifiers:
      "Parisian luxury fashion, quilted diamond calfskin, polished gold chain reflections, pink luxury gift box, Eiffel tower bokeh.",
    lighting: "Soft romantic Parisian afternoon window light with golden hour warmth",
    colorTone: "Ivory white, luxury pink (#F472B6), burgundy wine velvet (#881337)",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_028.jpg",
    isCustom: false,
  },
  {
    id: "streetwear_oversized_flatlay",
    name: "Streetwear 320gsm Heavyweight Flatlay",
    category: "Fashion & Apparel",
    description:
      "Heavyweight 320gsm oatmeal cotton shirt, flowing skirt, silk scarf, leather sandals, pearl earrings, and luxury perfume bottle on linen.",
    modifiers:
      "Editorial fashion flatlay, 320gsm heavyweight cotton texture, draped silk scarf ring, leather slides, luxury glass fragrance bottle.",
    lighting: "Moody directional window raking light casting deep fabric fold shadows",
    colorTone: "Oatmeal beige (#D7CCC8), warm leather tan, rich amber perfume",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_038.jpg",
    isCustom: false,
  },

  // 📱 Tech & Gadgets (5)
  {
    id: "cyberpunk_oled_tv",
    name: "Cyberpunk OLED 4K Smart TV Launch",
    category: "Tech & Gadgets",
    description:
      "Ultra-thin 65-inch OLED TV displaying cosmic nebula on glowing neon podium with 4 HUD spec boxes and 12 JT CTA.",
    modifiers:
      "Futuristic tech render, frameless OLED display, glowing neon cyan platform rings, cosmic HDR screen wallpaper, HUD overlay.",
    lighting:
      "Dark room low-key lighting with vibrant neon cyan ground glow and HDR screen luminance",
    colorTone: "Obsidian black, electric cyan (#06B6D4), cosmic violet",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_010.jpg",
    isCustom: false,
  },
  {
    id: "workspace_productivity_bundle",
    name: "Desk Setup & Productivity 4-Quadrant Bundle",
    category: "Tech & Gadgets",
    description:
      "Modern clean desk setup with slim laptop, mechanical RGB keyboard, ergo mouse, and cable box with 01-04 pill badges.",
    modifiers:
      "Clean desk setup, oak wood tabletop, glowing RGB LED keyboard accents, crisp macro angles, 01-04 numbered badges.",
    lighting: "Soft warm overhead studio lighting with subtle desktop LED glows",
    colorTone: "Warm terracotta orange (#E65100), natural birch wood, matte black",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_011.jpg",
    isCustom: false,
  },
  {
    id: "genz_pastel_accessories",
    name: "Gen-Z Pastel Phone & AirPods Accessories",
    category: "Tech & Gadgets",
    description:
      "Cute phone case, pearl charm strap, sage MagSafe charger, and AirPods case on soft cylindrical pastel podiums.",
    modifiers:
      "Pastel aesthetic product photography, pearl beads reflections, frosted translucent jelly textures, floating circular risers.",
    lighting: "Bright high-key soft daylight with delicate sunlit shadows",
    colorTone: "Matcha sage green (#84CC16), cream white, translucent crystal",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_012.jpg",
    isCustom: false,
  },
  {
    id: "y2k_vintage_pop",
    name: "Y2K Nostalgic Pop & Retro Audio Tech",
    category: "Tech & Gadgets",
    description:
      "Mint green turntable, pink Polaroid OneStep 2 camera, Sony Walkman, and vinyl record on pastel geometric pop risers.",
    modifiers:
      "Y2K retro pop aesthetic, authentic Crosley turntable, glossy pastel geometric steps, restored Polaroid OneStep, Duran Duran tape.",
    lighting: "Bright playful studio pop lighting with crisp graphic shadows",
    colorTone: "Pastel bubblegum pink (#EC4899), mint turquoise (#14B8A6), vinyl jet black",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_019.jpg",
    isCustom: false,
  },
  {
    id: "automotive_hologram_sedan",
    name: "Sports Sedan on Glowing Cyan HUD Platform",
    category: "Tech & Gadgets",
    description:
      "Glossy obsidian black sports sedan hovering on glowing cyan neon circular HUD platform in futuristic night city.",
    modifiers:
      "High-end car commercial render, gloss black body reflections, glowing cyan HUD platform rings, neon rain-slicked asphalt.",
    lighting: "Dark night cyberpunk lighting with electric cyan neon ground reflections",
    colorTone: "Obsidian black, electric neon cyan (#06B6D4), midnight blue",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_029.jpg",
    isCustom: false,
  },

  // 🧸 Baby & Kids (4)
  {
    id: "grid_baby_fleece_jacket",
    name: "9-Grid Baby Fleece & Cozy Apparel",
    category: "Baby & Kids",
    description:
      "Soft cream teddy bear aesthetic showing fleece hooded jackets, baby model smiles, polaroids, and 25% promo tags.",
    modifiers:
      "Soft nursery e-commerce layout, ultra-soft teddy fleece macro texture, wooden buttons, baby polaroid frames, strikethrough price.",
    lighting: "High-key soft morning nursery window light",
    colorTone: "Oatmeal beige (#D7CCC8), warm cream, soft dusty rose",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_004.jpg",
    isCustom: false,
  },
  {
    id: "grid_joyful_daycare",
    name: "9-Grid Daycare & Early Child Education",
    category: "Baby & Kids",
    description:
      "Playful building blocks, smiling nursery teacher with toddlers, colorful learning cards, and 20% discount badge.",
    modifiers:
      "Playful educational photography, vibrant wooden building blocks, cheerful preschool atmosphere, pastel badge stickers.",
    lighting: "Bright cheerful natural classroom daylight",
    colorTone: "Primary blue, warm sunshine yellow, mint green, coral pink",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_007.jpg",
    isCustom: false,
  },
  {
    id: "baby_knitwear_giftbox",
    name: "Nursery Knit Cardigan & Bunny Plush Gift Set",
    category: "Baby & Kids",
    description:
      "Dusty pink chunky knit baby cardigan with wood buttons, canvas mini sneakers, socks, gift box, and knit bunny plushie.",
    modifiers:
      "Cozy baby nursery flatlay, chunky organic cotton knit, wooden buttons, blush pink gift box with satin bow, knit bunny toy.",
    lighting: "Soft warm overhead nursery diffusion lighting",
    colorTone: "Dusty pink (#F472B6), soft cream, natural wood brown",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_025.jpg",
    isCustom: false,
  },
  {
    id: "eco_baby_wood_pedestal",
    name: "Organic Baby Glass Bottle & Koala Teether",
    category: "Baby & Kids",
    description:
      "BPA-free glass baby bottle, rolled bamboo swaddle blanket, and natural beechwood koala teether on round wood pedestal.",
    modifiers:
      "Organic baby product photography, crystal clear glass bottle scale, soft muslin bamboo pattern, natural beechwood teether.",
    lighting: "Bright warm morning sun with fresh botanical leaf shadows",
    colorTone: "Natural beechwood, bamboo green, warm terracotta orange (#FB923C)",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_026.jpg",
    isCustom: false,
  },

  // 📊 Styling & Infographic (2)
  {
    id: "personal_color_infographic",
    name: "Personal Color Analysis & Wardrobe Board",
    category: "Styling & Infographic",
    description:
      "Personal color analysis board with warm autumn swatch circles, outfit simulation cards, and capsule wardrobe flatlay.",
    modifiers:
      "Professional styling infographic, warm neutral skin tone portrait, 24 color swatch circles, textile pattern samples, flatlay wardrobe.",
    lighting: "Even, clean studio beauty portrait lighting with neutral color fidelity",
    colorTone: "Warm autumn palette (terracotta, mustard, sage, olive, warm navy)",
    aspectRatio: "4:5",
    sampleUrl: "/samples/sample_030.jpg",
    isCustom: false,
  },
  {
    id: "grid_express_laundry",
    name: "Modern Service Checklist & Linen Branding",
    category: "Styling & Infographic",
    description:
      "Vibrant royal blue drawstring bags on clean marble with folded dress shirts, service checklist, and 7.000/kg tag.",
    modifiers:
      "Commercial service branding, clean crisp folded dress shirts, electric royal blue laundry bags, polished white marble, minimal icons.",
    lighting: "Clean high-key commercial studio light with crisp reflections",
    colorTone: "Electric royal blue (#1E40AF), pure white, crisp sky blue",
    aspectRatio: "1:1",
    sampleUrl: "/samples/sample_005.jpg",
    isCustom: false,
  },
];

/* Brand Kit Storage */
export function loadBrandKit(): BrandKit | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(BRAND_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveBrandKit(kit: BrandKit): void {
  if (!isBrowser()) return;
  localStorage.setItem(BRAND_KEY, JSON.stringify(kit));
}

export function clearBrandKit(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(BRAND_KEY);
}

export function brandKitPayload(): Record<string, string> | null {
  const kit = loadBrandKit();
  if (!kit || !kit.active || !kit.brand.trim()) return null;
  return {
    brand: kit.brand,
    description: kit.description,
    industry: kit.industry,
    audience: kit.audience,
    personality: kit.personality,
    primary_color: kit.primary_color,
    secondary_color: kit.secondary_color,
    accent_color: kit.accent_color,
    typography: kit.typography,
    visual_style: kit.visual_style,
    photography_style: kit.photography_style,
    lighting_style: kit.lighting_style,
    background_style: kit.background_style,
    positioning: kit.positioning,
    words_to_use: kit.words_to_use,
    words_to_avoid: kit.words_to_avoid,
    cta_language: kit.cta_language,
    visual_references: kit.visual_references,
  };
}

/* History Storage */
export function loadHistory(): PromptHistoryItem[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map((item: any) => {
      const res = (item.result || {}) as any;
      const rawDate = item.date || item.createdAt || res.generated_at || new Date().toISOString();
      const validDate = isNaN(new Date(rawDate).getTime()) ? new Date().toISOString() : rawDate;

      return {
        id: item.id || crypto.randomUUID(),
        date: validDate,
        mode: item.mode || "design_grafis",
        modeName: item.modeName || item.mode || "Instagram Studio",
        title:
          item.title ||
          item.briefTitle ||
          res.headline ||
          res.product ||
          item.modeName ||
          "Production Prompt",
        brief:
          item.brief ||
          item.briefSnippet ||
          res.creative_direction ||
          res.copy ||
          "",
        prompt:
          item.prompt ||
          item.finalPrompt ||
          res.final_prompt ||
          "Commercial AI Studio Prompt",
        ratio: item.ratio || res.instagram_format || "1:1",
        style: item.style || "Commercial Ad",
        result: item.result || res,
      };
    });
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: Partial<PromptHistoryItem> & Record<string, any>): void {
  if (!isBrowser()) return;
  const existing = loadHistory();

  const res = (item.result || {}) as any;
  const rawDate = item.date || item.createdAt || res.generated_at || new Date().toISOString();
  const validDate = isNaN(new Date(rawDate).getTime()) ? new Date().toISOString() : rawDate;

  const normalized: PromptHistoryItem = {
    id: item.id || crypto.randomUUID(),
    date: validDate,
    mode: item.mode || "design_grafis",
    modeName: item.modeName || item.mode || "Instagram Studio",
    title:
      item.title ||
      item.briefTitle ||
      res.headline ||
      res.product ||
      item.modeName ||
      "Production Prompt",
    brief:
      item.brief ||
      item.briefSnippet ||
      res.creative_direction ||
      res.copy ||
      "",
    prompt:
      item.prompt ||
      item.finalPrompt ||
      res.final_prompt ||
      "Commercial AI Studio Prompt",
    ratio: item.ratio || res.instagram_format || "1:1",
    style: item.style || "Commercial Ad",
    result: item.result || res,
  };

  const filtered = existing.filter((i) => i.id !== normalized.id);
  const updated = [normalized, ...filtered].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:history"));
  }
}

export function deleteHistoryItem(id: string): void {
  if (!isBrowser()) return;
  const existing = loadHistory();
  const updated = existing.filter((i) => i.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(HISTORY_KEY);
}

/* Admin Promo History Storage Interface */
export interface AdminPromoHistoryItem {
  id: string;
  date: string;
  format: "tiktok_reels_video" | "instagram_carousel" | "single_feed_banner" | "viral_thread";
  campaignTopic: string;
  targetAudience?: string | undefined;
  toneStyle?: string | undefined;
  callToAction?: string | undefined;
  imageUrl?: string | undefined;
  result: any;
}

const ADMIN_PROMO_HISTORY_KEY = "ics.admin.promo_history";

export function loadAdminPromoHistory(): AdminPromoHistoryItem[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(ADMIN_PROMO_HISTORY_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getAdminPromoHistoryItem(id: string): AdminPromoHistoryItem | undefined {
  if (!isBrowser()) return undefined;
  const list = loadAdminPromoHistory();
  return list.find((item) => item.id === id);
}

export function saveAdminPromoHistoryItem(item: AdminPromoHistoryItem): void {
  if (!isBrowser()) return;
  const existing = loadAdminPromoHistory();
  const filtered = existing.filter((i) => i.id !== item.id);
  const updated = [item, ...filtered].slice(0, 100);
  localStorage.setItem(ADMIN_PROMO_HISTORY_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:admin_promo_history"));
  }
}

export function deleteAdminPromoHistoryItem(id: string): void {
  if (!isBrowser()) return;
  const existing = loadAdminPromoHistory();
  const updated = existing.filter((i) => i.id !== id);
  localStorage.setItem(ADMIN_PROMO_HISTORY_KEY, JSON.stringify(updated));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:admin_promo_history"));
  }
}

export function clearAdminPromoHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ADMIN_PROMO_HISTORY_KEY);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:admin_promo_history"));
  }
}

/* User-Isolated Gallery Storage (Strict Separation between Admin and Regular Users) */
export function getGalleryStorageKey(userId?: string, isAdmin?: boolean): string {
  if (isAdmin) {
    return `${GALLERY_KEY}.admin`;
  }
  if (userId) {
    return `${GALLERY_KEY}.user_${userId}`;
  }
  return `${GALLERY_KEY}.guest`;
}

export function loadGallery(userId?: string, isAdmin?: boolean): UploadedImage[] {
  if (!isBrowser()) return [];
  const key = getGalleryStorageKey(userId, isAdmin);
  let raw = localStorage.getItem(key);
  
  // Backward compatibility fallback for admin
  if (!raw && isAdmin) {
    raw = localStorage.getItem(GALLERY_KEY);
  }

  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGalleryImage(image: UploadedImage, userId?: string, isAdmin?: boolean): void {
  if (!isBrowser()) return;
  const key = getGalleryStorageKey(userId, isAdmin);
  const existing = loadGallery(userId, isAdmin);

  // Clean image to avoid storing massive Base64 strings in localStorage
  const cleanImage: UploadedImage = {
    ...image,
    thumbnailUrl:
      image.thumbnailUrl?.startsWith("data:") && image.thumbnailUrl.length > 5000
        ? image.url
        : image.thumbnailUrl,
  };

  const filtered = existing.filter((i) => i.id !== cleanImage.id);
  const updated = [cleanImage, ...filtered].slice(0, 50);

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.warn("[saveGalleryImage] Quota exceeded, pruning old base64 cache:", err);
    try {
      // Emergency pruning: strip all large base64 data and keep only top 20 items
      const pruned = updated.slice(0, 20).map((img) => ({
        ...img,
        url: img.url?.startsWith("data:") && img.url.length > 2000 ? "" : img.url,
        thumbnailUrl:
          img.thumbnailUrl?.startsWith("data:") && img.thumbnailUrl.length > 2000
            ? ""
            : img.thumbnailUrl,
      }));
      localStorage.setItem(key, JSON.stringify(pruned));
    } catch {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:gallery"));
  }
}

export function deleteGalleryImage(id: string, userId?: string, isAdmin?: boolean): void {
  if (!isBrowser()) return;
  const key = getGalleryStorageKey(userId, isAdmin);
  const existing = loadGallery(userId, isAdmin);
  const updated = existing.filter((i) => i.id !== id);
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ics:gallery"));
  }
}

/* Visual Styles Storage */
export function loadVisualStyles(): VisualStylePreset[] {
  if (!isBrowser()) return DEFAULT_VISUAL_STYLES;
  const raw = localStorage.getItem(STYLES_KEY);
  if (!raw) {
    localStorage.setItem(STYLES_KEY, JSON.stringify(DEFAULT_VISUAL_STYLES));
    return DEFAULT_VISUAL_STYLES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 10) {
      // Auto upgrade old storage cache with full 40 curated presets
      localStorage.setItem(STYLES_KEY, JSON.stringify(DEFAULT_VISUAL_STYLES));
      return DEFAULT_VISUAL_STYLES;
    }
    return parsed;
  } catch {
    return DEFAULT_VISUAL_STYLES;
  }
}

export function saveVisualStyles(styles: VisualStylePreset[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STYLES_KEY, JSON.stringify(styles));
}

export function resetVisualStyles(): void {
  if (!isBrowser()) return;
  localStorage.setItem(STYLES_KEY, JSON.stringify(DEFAULT_VISUAL_STYLES));
}

export const loadGalleryImages = loadGallery;

export function writeHistory(items: PromptHistoryItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function saveVisualStyle(style: VisualStylePreset): void {
  const existing = loadVisualStyles();
  const filtered = existing.filter((s) => s.id !== style.id);
  saveVisualStyles([style, ...filtered]);
}

export function deleteVisualStyle(id: string): void {
  const existing = loadVisualStyles();
  const filtered = existing.filter((s) => s.id !== id);
  saveVisualStyles(filtered);
}

/* App Settings Storage */
export function loadAppSettings(): AppSettings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings): void {
  if (!isBrowser()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("ics:settings"));
}

/* ==================== BRAND LOGOS & WATERMARK STORAGE ==================== */
export interface BrandLogoPreset {
  id: string;
  name: string;
  cdnUrl: string;
  fileId?: string;
  aspectRatio?: string;
  placement:
    | "top_left"
    | "top_right"
    | "top_center"
    | "bottom_left"
    | "bottom_right"
    | "bottom_center"
    | "center_watermark";
  scale: "subtle" | "standard" | "prominent";
  treatment:
    "original" | "white_monochrome" | "dark_monochrome" | "embossed_3d" | "glassmorphism_badge";
  opacity: number; // e.g. 100, 80, 50, 30
  visionAnalysis?: {
    shape?: string;
    colors?: string[];
    typographyStyle?: string;
    aestheticPrompt?: string;
  };
  isDefault?: boolean;
  createdAt: string;
}

const LOGOS_KEY = "ics.logos";

export const DEFAULT_LOGOS: BrandLogoPreset[] = [
  {
    id: "logo_minimalist_white",
    name: "Minimalist Clean Monogram (White)",
    cdnUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='40' fill='%23111827'/%3E%3Cpath d='M60 140V60h45a25 25 0 0 1 25 25c0 14-11 25-25 25H85v30H60z' fill='%23FFFFFF'/%3E%3C/svg%3E",
    placement: "top_right",
    scale: "subtle",
    treatment: "white_monochrome",
    opacity: 100,
    visionAnalysis: {
      shape: "Clean geometric vector monogram",
      colors: ["#FFFFFF"],
      typographyStyle: "Geometric sans-serif uppercase",
      aestheticPrompt:
        "Crisp vector geometry, razor-sharp edges, perfectly rendered vector silhouette, luxury modern branding.",
    },
    isDefault: true,
    createdAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "logo_luxury_gold_crest",
    name: "Luxury Gold Crest & Serif",
    cdnUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='40' fill='%230b0914'/%3E%3Cpolygon points='100,35 140,80 125,145 75,145 60,80' fill='none' stroke='%23D4AF37' stroke-width='8'/%3E%3Ccircle cx='100' cy='95' r='18' fill='%23D4AF37'/%3E%3C/svg%3E",
    placement: "top_center",
    scale: "standard",
    treatment: "embossed_3d",
    opacity: 100,
    visionAnalysis: {
      shape: "Ornate royal heraldic crest with serif wordmark",
      colors: ["#D4AF37", "#FFFFFF"],
      typographyStyle: "High-contrast Didone serif",
      aestheticPrompt:
        "3D embossed metallic gold sheen, subtle specular highlight, haute couture luxury atelier branding.",
    },
    isDefault: false,
    createdAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "logo_glassmorphic_badge",
    name: "Frosted Glass Floating Badge",
    cdnUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect x='20' y='50' width='160' height='100' rx='25' fill='%232563eb' fill-opacity='0.3' stroke='%2360a5fa' stroke-width='4'/%3E%3Ctext x='100' y='110' fill='%23FFFFFF' font-size='24' font-family='sans-serif' font-weight='bold' text-anchor='middle'%3ESTUDIO%3C/text%3E%3C/svg%3E",
    placement: "bottom_right",
    scale: "standard",
    treatment: "glassmorphism_badge",
    opacity: 90,
    visionAnalysis: {
      shape: "Rounded rectangle pill with translucent frosted glass backing",
      colors: ["#FFFFFF", "rgba(255,255,255,0.2)"],
      typographyStyle: "Modern humanist sans",
      aestheticPrompt:
        "Frosted acrylic glassmorphism badge, 20px blur, 1px specular white border, floating above background.",
    },
    isDefault: false,
    createdAt: "2026-08-20T00:00:00.000Z",
  },
  {
    id: "logo_subtle_watermark",
    name: "Diagonal Proof Watermark (Subtle)",
    cdnUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ctext x='100' y='115' fill='%23FFFFFF' fill-opacity='0.4' font-size='26' font-family='sans-serif' font-weight='bold' text-anchor='middle' transform='rotate(-30 100 100)'%3EFEEDAI%3C/text%3E%3C/svg%3E",
    placement: "center_watermark",
    scale: "prominent",
    treatment: "white_monochrome",
    opacity: 30,
    visionAnalysis: {
      shape: "Repeating diagonal grid watermark stamp",
      colors: ["rgba(255,255,255,0.3)"],
      typographyStyle: "Monospace stamp uppercase",
      aestheticPrompt:
        "Subtle translucent security watermark overlay at 30% opacity, seamless blend without obscuring product.",
    },
    isDefault: false,
    createdAt: "2026-08-20T00:00:00.000Z",
  },
];

export function loadBrandLogos(): BrandLogoPreset[] {
  if (!isBrowser()) return DEFAULT_LOGOS;
  const raw = localStorage.getItem(LOGOS_KEY);
  if (!raw) {
    localStorage.setItem(LOGOS_KEY, JSON.stringify(DEFAULT_LOGOS));
    return DEFAULT_LOGOS;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(LOGOS_KEY, JSON.stringify(DEFAULT_LOGOS));
      return DEFAULT_LOGOS;
    }
    return parsed;
  } catch {
    return DEFAULT_LOGOS;
  }
}

export function saveBrandLogo(logo: BrandLogoPreset): void {
  if (!isBrowser()) return;
  const existing = loadBrandLogos();
  const filtered = existing.filter((l) => l.id !== logo.id);
  const updated = [logo, ...filtered];
  localStorage.setItem(LOGOS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("ics:logos"));
}

export function deleteBrandLogo(id: string): void {
  if (!isBrowser()) return;
  const existing = loadBrandLogos();
  const filtered = existing.filter((l) => l.id !== id);
  localStorage.setItem(LOGOS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("ics:logos"));
}
