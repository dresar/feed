export interface GalleryExample {
  title: string;
  type: "raw_ai" | "final_design" | "showcase";
  category: string;
  imagePath: string;
  description: string;
}

export interface EngineGuide {
  engineId: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  aspectRatio: string;
  primaryUseCases: string[];
  advertisingBenefits: string[];
  recommendedModels: {
    name: string;
    description: string;
  }[];
  promptFormulaTips: string[];
  samplePrompt: string;
  galleryExamples?: GalleryExample[];
}

export const ENGINE_GUIDES: Record<string, EngineGuide> = {
  "design-grafis": {
    engineId: "design-grafis",
    title: "Design Grafis & Komersial Ads (Universal All-Niche)",
    badge: "Universal Graphics Engine",
    tagline: "Meracik visual desain grafis serbaguna untuk Produk Fisik, Jasa, Event, Kuliner, Fashion, dan Banner Iklan Komersial.",
    description:
      "Engine ini dirancang fleksibel untuk SEMUA JENIS KEBUTUHAN PROMOSI: Produk Fisik (Skincare, Gadget, F&B), Jasa/Layanan (Konsultan, Salon, Cuci Sepatu, Otomotif), Event & Webinar, Pengumuman Bisnis, hingga Diskon Musiman. Fokus pada komposisi ruang negatif (negative space) bersih untuk penempatan teks headline di Canva/Photoshop, hierarki visual tajam, dan pencahayaan studio komersial tingkat tinggi.",
    aspectRatio: "1:1 (Square Feed) atau 4:5 (Portrait Feed) atau 9:16 (Story/Reels)",
    primaryUseCases: [
      "🛍️ Produk Fisik & E-Commerce: Skincare, Elektronik, Fashion, Herbal, & Retail",
      "🛠️ Promosi Jasa & Layanan: Bengkel, Salon/Barbershop, Cuci Sepatu, Fotografi, Agensi",
      "☕ Kuliner & F&B: Cafe, Resto, Artisan Bakery, Menu Promo & Minuman Kekinian",
      "🎟️ Event & Komunitas: Webinar, Workshop, Konser Musik, Pameran & Open Recruitment",
      "🏷️ Kampanye Diskon: Flash Sale, Promo Gajian, Harbolnas, Ramadan & Akhir Tahun",
    ],
    advertisingBenefits: [
      "Menyediakan ruang kosong bersih (negative space) terukur tanpa distraksi untuk teks headline & logo",
      "Menghasilkan prompt berstandar studio profesional dengan instruksi detail pencahayaan & material",
      "Teks headline dan copywriting divalidasi dengan format tanda kutip jelas untuk meminimalisir kesalahan AI",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Sangat tajam dalam merender detail objek, tekstur grafis, dan pencahayaan presisi." },
      { name: "Midjourney v6.1", description: "Paling unggul dalam estetika sinematik, komposisi warna artistik, dan layout fotorealistik." },
      { name: "ChatGPT DALL-E 3", description: "Unggul dalam memahami instruksi teks kompleks, ejaan kata, dan komposisi spatial yang rapi." },
    ],
    promptFormulaTips: [
      "Sebutkan focal point subjek (produk/jasa/figur) dan tata letaknya di awal kalimat.",
      "Gunakan instruksi: 'clean minimalist negative space on left/top section reserved for commercial typography'.",
      "Sertakan teks promosi di dalam tanda kutip ganda dan tentukan material atau pencahayaan studio komersial.",
    ],
    samplePrompt:
      "High-end commercial graphic design poster for a luxury beauty & wellness brand. An elegant cosmetic bottle resting on a frosted acrylic cylindrical pedestal with subtle warm reflections. Soft pastel beige and champagne satin fabric draping smoothly in the background. Generous, clean negative space on the left side specifically calibrated for advertising headline typography and benefit icons. Studio softbox key lighting, 85mm portrait lens, ultra-crisp 8K ray-traced rendering --ar 4:5 --v 6.1 --stylize 250",
    galleryExamples: [
      {
        title: "Poster Skincare Glow Serum (Final Design)",
        type: "final_design",
        category: "Skincare / Beauty",
        imagePath: "/design-grafis/1.png",
        description: "Contoh desain grafis final lengkap dengan teks headline, poin manfaat, dan icon promo di ruang kosong.",
      },
      {
        title: "Template Canvas Ruang Kosong Skincare",
        type: "raw_ai",
        category: "Skincare / Beauty",
        imagePath: "/design-grafis/1B.png",
        description: "Hasil render mentah AI dengan komposisi negative space di sebelah kiri untuk tempat teks.",
      },
      {
        title: "Poster Komersial Premium Set 2 (Final)",
        type: "final_design",
        category: "Product & Retail",
        imagePath: "/design-grafis/2.png",
        description: "Layout desain grafis elegan dengan tipografi modern dan penataan visual hierarki produk.",
      },
      {
        title: "Template Canvas Set 2 (Raw AI)",
        type: "raw_ai",
        category: "Product & Retail",
        imagePath: "/design-grafis/2B.png",
        description: "Output visual AI dengan ruang bersih siap edit di Canva / Photoshop.",
      },
      {
        title: "Poster Komersial Modern Set 3 (Final)",
        type: "final_design",
        category: "Commercial Branding",
        imagePath: "/design-grafis/3.png",
        description: "Contoh poster promosi komersial dengan hierarki elemen visual seimbang.",
      },
      {
        title: "Template Canvas Set 3 (Raw AI)",
        type: "raw_ai",
        category: "Commercial Branding",
        imagePath: "/design-grafis/3B.png",
        description: "Render visual produk dengan ruang lega untuk pesan promosi.",
      },
      {
        title: "Poster Iklan Kampanye Set 4 (Final)",
        type: "final_design",
        category: "Advertising Campaign",
        imagePath: "/design-grafis/4.png",
        description: "Desain poster kampanye promosi dengan daya tarik visual tinggi.",
      },
      {
        title: "Template Canvas Set 4 (Raw AI)",
        type: "raw_ai",
        category: "Advertising Campaign",
        imagePath: "/design-grafis/4B.png",
        description: "Visual staging berkelas dengan sudut kamera studio profesional.",
      },
      {
        title: "Poster Desain Grafis Set 5 (Final)",
        type: "final_design",
        category: "Event & Branding",
        imagePath: "/design-grafis/5.png",
        description: "Contoh aplikasi desain grafis lengkap untuk materi promosi digital.",
      },
      {
        title: "Template Canvas Set 5 (Raw AI)",
        type: "raw_ai",
        category: "Event & Branding",
        imagePath: "/design-grafis/5A.png",
        description: "Template background visual siap pasang teks dan logo brand.",
      },
    ],
  },
  "grid-9": {
    engineId: "grid-9",
    title: "9-Grid Consistent Feed Engine",
    badge: "9-Grid Mastery",
    tagline: "Membangun 9 postingan feed Instagram yang saling menyambung dengan konsistensi warna & style 100%.",
    description:
      "Engine 9-Grid menghasilkan 9 prompt terstruktur yang dirancang untuk diunggah berurutan di profil Instagram. Memastikan tema warna, sudut pandang kamera, dan kesinambungan visual antar-grid tetap harmonis dari postingan 1 hingga 9.",
    aspectRatio: "1:1 (Square Grid per Postingan)",
    primaryUseCases: [
      "Revitalisasi tampilan profil Instagram (Feed Makeover) brand",
      "Kampanye peluncuran produk baru (Mega Launching)",
      "Portofolio agensi & brand identity showcase berkelas",
    ],
    advertisingBenefits: [
      "Meningkatkan Follower Conversion Rate saat audiens mengunjungi profil Anda",
      "Menciptakan kesan brand besar, profesional, dan terkelola dengan matang",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Gunakan parameter --sref atau --cref untuk konsistensi warna 9 kotak." },
      { name: "Flux 1.1 Pro", description: "Menjaga konsistensi pencahayaan dan material antar slide." },
    ],
    promptFormulaTips: [
      "Jaga palet warna inti (misal: Deep Emerald & Gold Accents) di seluruh 9 prompt.",
      "Kombinasikan foto produk close-up, foto lifestyle, dan elemen tipografi abstrak.",
    ],
    samplePrompt:
      "Panel 1/9 Grid aesthetic: Minimalist macro photography of artisan coffee beans cascading onto ceramic counter, warm morning rays, cohesive espresso warm amber palette --ar 1:1",
  },
  "feed-square": {
    engineId: "feed-square",
    title: "Square Feed (1:1 Ratio)",
    badge: "Classic 1:1 Feed",
    tagline: "Visual feed Instagram rasio 1080x1080px yang tajam, seimbang, dan eye-catching.",
    description:
      "Rasio klasik Instagram yang mengutamakan komposisi simetris, pusat perhatian kuat di tengah, dan detail visual yang langsung menarik mata saat scrolling explore feed.",
    aspectRatio: "1:1 (1080 x 1080 px)",
    primaryUseCases: [
      "Postingan feed reguler harian",
      "Katalog produk e-commerce & retail",
      "Testimoni singkat & kutipan motivasi brand",
    ],
    advertisingBenefits: [
      "Tampil sempurna di grid profil tanpa terpotong",
      "Fokus visual maksimal pada satu produk inti",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Detail objek dan tekstur material sangat tajam pada rasio persegi." },
      { name: "Midjourney v6.1", description: "Komposisi framing simetris paling natural." },
    ],
    promptFormulaTips: [
      "Gunakan 'centered composition, geometric balance' untuk kestabilan visual 1:1.",
    ],
    samplePrompt:
      "Square 1:1 commercial photography of artisan ceramic coffee mug on marble slab, gentle steam rising, soft morning window light, high detail --ar 1:1 --v 6.1",
  },
  "feed-portrait": {
    engineId: "feed-portrait",
    title: "Portrait Feed (4:5 Ratio)",
    badge: "High-Engagement 4:5",
    tagline: "Rasio vertikal 1080x1350px yang mendominasi layar ponsel dan memaksimalkan retensi audiens.",
    description:
      "Rasio 4:5 adalah format paling direkomendasikan untuk postingan feed Instagram karena menutupi ruang layar 25% lebih luas dibanding 1:1, menahan perhatian audiens lebih lama saat scrolling.",
    aspectRatio: "4:5 (1080 x 1350 px)",
    primaryUseCases: [
      "Foto model fashion & OOTD",
      "Foto produk bertingkat / komposisi vertikal",
      "Iklan feed berbayar dengan stop-scrolling effect tinggi",
    ],
    advertisingBenefits: [
      "Mengambil area layar HP paling maksimal di feed utama",
      "Meningkatkan engagement rate hingga 35% lebih tinggi dari rasio kotak",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Parameter --ar 4:5 menghasilkan proporsi estetika fashion terbaik." },
      { name: "Flux 1.1 Pro", description: "Pencahayaan editorial dan detail kain pakaian sangat natural." },
    ],
    promptFormulaTips: [
      "Tentukan komposisi vertikal: foreground di bawah, focal point di tengah, background di atas.",
    ],
    samplePrompt:
      "Editorial 4:5 lookbook photo of streetwear hoodie with holographic embroidery, model in urban twilight alley, cinematic anamorphic lens flare, sharp depth of field --ar 4:5",
  },
  "carousel": {
    engineId: "carousel",
    title: "Multi-Slide Instagram Carousel",
    badge: "Carousel Storytelling",
    tagline: "Meracik prompt beruntun 3-10 slide dengan alur cerita (Hook, Body, Solution, CTA) yang memikat.",
    description:
      "Engine Carousel menghasilkan seri prompt yang saling menyambung secara tematis untuk konten edukasi, tutorial, studi kasus, atau peluncuran fitur produk secara bertahap.",
    aspectRatio: "4:5 (Portrait) atau 1:1 (Square)",
    primaryUseCases: [
      "Konten edukasi bisnis & carousel microblog",
      "Before-After transformasi produk",
      "Breakdown fitur produk dalam 5-7 slide beruntun",
    ],
    advertisingBenefits: [
      "Format dengan algoritma paling disukai Instagram untuk meningkatkan Saves & Shares",
      "Memberikan kesempatan kedua bagi audiens yang belum swipe di tampilan pertama",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Menjaga kontinuitas tema warna antar slide." },
      { name: "ChatGPT DALL-E 3", description: "Mudah menginterpretasikan variasi langkah per slide." },
    ],
    promptFormulaTips: [
      "Slide 1 wajib memiliki visual 'Hook' dramatis.",
      "Slide akhir fokus pada elemen 'Call to Action' dengan negative space untuk ajakan bertindak.",
    ],
    samplePrompt:
      "Slide 1 Hook: Dramatic macro shot of shattered smartphone screen floating in mid-air, neon glowing circuits, high octane visual punch for tech repair service --ar 4:5",
  },
  "ads": {
    engineId: "ads",
    title: "Commercial Instagram & Meta Ads",
    badge: "High ROAS Ads",
    tagline: "Formula visual iklan langsung (Direct-Response Ads) yang menghentikan scroll dan memicu konversi.",
    description:
      "Dikhususkan untuk materi iklan berbayar (Meta Ads). Engine ini menggabungkan psikologi visual iklan, penekanan benefit utama produk, dan kontras warna tajam yang menarik perhatian instan.",
    aspectRatio: "1:1 (Feed Ads) atau 4:5 (Instagram Ads) atau 9:16 (Reels/Story Ads)",
    primaryUseCases: [
      "Iklan Instagram & Facebook Ads berbayar",
      "Promosi diskon Flash Sale, Harbolnas, & Promo Terbatas",
      "Lead generation & kampanye retargeting",
    ],
    advertisingBenefits: [
      "Menurunkan Cost Per Click (CPC) dan meningkatkan Return on Ad Spend (ROAS)",
      "Visual dirancang dengan kontras warna kuat agar lolos ad review dan menarik klik",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Kontras dinamis tinggi dan kejernihan objek komersial." },
      { name: "Midjourney v6.1", description: "Nuansa iklan mewah (luxury commercial look)." },
    ],
    promptFormulaTips: [
      "Gunakan kata kunci pencahayaan dramatis: 'high contrast commercial lighting, crisp product focal point'.",
    ],
    samplePrompt:
      "High-converting commercial advertisement visual for wireless noise-canceling headphones, hovering in dark studio with soundwave energy particles, striking neon accents, 8K ultra-detailed --ar 4:5",
  },
  "stories": {
    engineId: "stories",
    title: "Stories & Reels Visual (9:16 Ratio)",
    badge: "Full-Screen 9:16",
    tagline: "Visual layar penuh 1080x1920px untuk Instagram Story, Reels Cover, dan TikTok.",
    description:
      "Menghasilkan prompt visual format vertikal penuh (9:16). Sangat ideal untuk cover video Reels, background Story interaktif, polling stickers, dan materi iklan Stories.",
    aspectRatio: "9:16 (1080 x 1920 px Full Screen)",
    primaryUseCases: [
      "Background Instagram Stories harian & kuis interaktif",
      "Cover Thumbnail untuk Instagram Reels & TikTok",
      "Vertikal Video Story Ads",
    ],
    advertisingBenefits: [
      "Pengalaman imersif 100% layar HP tanpa distraksi elemen feed lain",
      "Meningkatkan swipe-up / link sticker click rate",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Parameter --ar 9:16 sangat stabil untuk portrait penuh." },
      { name: "Flux 1.1 Pro", description: "Pencahayaan atmosferik vertikal yang sangat kaya." },
    ],
    promptFormulaTips: [
      "Hindari meletakkan objek penting di 15% bagian atas dan bawah (area profil & UI Instagram).",
    ],
    samplePrompt:
      "Full-screen 9:16 vertical background for beverage story ad, iced sparkling mocktail with lime slices splashing fresh water droplets, vibrant tropical sunbeams, ample central space --ar 9:16",
  },
  "try-on-produk": {
    engineId: "try-on-produk",
    title: "Virtual Model & Product Try-On",
    badge: "AI Fashion Model",
    tagline: "Memvisualisasikan pakaian, aksesoris, sepatu, dan produk fashion pada model manusia AI realistis.",
    description:
      "Menghemat biaya sesi photoshoot model mahal. Engine ini meracik prompt untuk menampilkan produk fashion atau pakaian pada model manusia dengan berbagai etnis, pose editorial, dan latar runway atau perkotaan.",
    aspectRatio: "4:5 (Portrait Lookbook) atau 9:16 (Story/Reels)",
    primaryUseCases: [
      "Lookbook katalog busana wanita/pria",
      "Showcase aksesoris perhiasan, jam tangan, kacamata, dan tas",
      "Visual e-commerce fashion brand",
    ],
    advertisingBenefits: [
      "Membantu calon pembeli membayangkan produk saat dipakai di kehidupan nyata",
      "Mengurangi biaya produksi foto model studio hingga 90%",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Menghasilkan anatomi jari, wajah, dan tekstur kain paling natural tanpa glitch." },
      { name: "Midjourney v6.1", description: "Pose model fashion internasional sekelas majalah Vogue." },
    ],
    promptFormulaTips: [
      "Sebutkan detail bahan: 'ribbed cotton knit', 'genuine grain leather', 'matte silk finish'.",
    ],
    samplePrompt:
      "Fashion editorial shot of Indonesian female model wearing oversized beige linen blazer and gold minimalist hoop earrings, natural makeup, soft studio morning light, 8K photorealistic --ar 4:5",
  },
  "review-produk": {
    engineId: "review-produk",
    title: "UGC & Influencer Product Review",
    badge: "Authentic UGC",
    tagline: "Visual gaya User-Generated Content (UGC) otentik yang membangun kepercayaan pembeli seketika.",
    description:
      "Audiens masa kini sering mengabaikan iklan yang terlalu kaku. Engine ini meracik prompt bernuansa testimoni asli, unboxing meja kamar, atau selfie influencer kasual yang terasa natural dan meyakinkan.",
    aspectRatio: "1:1 atau 4:5 atau 9:16",
    primaryUseCases: [
      "Materi iklan UGC review di Instagram & TikTok",
      "Visual testimoni & unboxing produk",
      "Endorsement style visual",
    ],
    advertisingBenefits: [
      "Membangun social proof instan dan rasa percaya tinggi",
      "Format iklan UGC terbukti memiliki rasio konversi lebih tinggi daripada iklan studio kaku",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Gunakan parameter --style raw untuk efek kamera smartphone yang otentik." },
      { name: "Flux 1.1 Pro", description: "Pencahayaan natural ruangan kamar yang tidak berlebihan." },
    ],
    promptFormulaTips: [
      "Gunakan kata kunci: 'candid smartphone camera perspective, natural room lighting, authentic unboxing table setup'.",
    ],
    samplePrompt:
      "Candid UGC unboxing perspective: Hands holding freshly opened premium serum glass dropper over modern wood vanity desk, natural ambient room light, authentic lifestyle review vibe --ar 4:5 --style raw",
  },
  "logo-produk": {
    engineId: "logo-produk",
    title: "Branding & 3D Logo Mockups",
    badge: "3D Branding Asset",
    tagline: "Menghasilkan logo 3D premium, emblem timbul, dan mockup kemasan produk mewah.",
    description:
      "Meracik prompt logo bertekstur 3D, emboss emas/silver pada kertas kraft, akrilik neon menyala, hingga mockup kemasan produk mewah yang siap dipamerkan di feed brand.",
    aspectRatio: "1:1 (Square Emblem) atau 16:9 (Landscape Banner)",
    primaryUseCases: [
      "Mockup branding kemasan produk (box packaging, cup, pouch)",
      "Foto profil Instagram brand dengan efek 3D timbul",
      "Presentasi identitas visual brand kepada klien",
    ],
    advertisingBenefits: [
      "Meningkatkan perceived value (harga jual) produk di mata konsumen",
      "Memberikan tampilan brand kelas premium sejak impresi pertama",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Ketajaman material kaca, metalik, dan embossed paper sangat nyata." },
      { name: "Midjourney v6.1", description: "Paling estetik untuk pencahayaan 3D render cinema4D/octane." },
    ],
    promptFormulaTips: [
      "Tentukan material logo: 'frosted glass with gold foil stamp', 'matte black embossed metal'.",
    ],
    samplePrompt:
      "3D luxury logo mockup embossed with metallic champagne gold foil on heavyweight matte textured charcoal paper, elegant shallow depth of field, dramatic angled macro studio lighting --ar 1:1",
  },
  "typography-ads": {
    engineId: "typography-ads",
    title: "Typography & Poster Ad Visuals",
    badge: "Creative Typography",
    tagline: "Visual iklan yang memadukan tipografi 3D artistik dengan latar belakang tematik.",
    description:
      "Engine untuk meracik teks artistik menyatu dengan objek, balon foil 3D, neon teks menyala di dinding bata, atau pahatan batu futuristik yang menjadi headline utama iklan.",
    aspectRatio: "4:5 (Portrait Ads) atau 1:1 (Square)",
    primaryUseCases: [
      "Headline iklan kampanye promo besar (contoh: SALE 50%, NEW ERA)",
      "Quote motivasi visual estetik",
      "Cover acara musik atau event pameran kreatif",
    ],
    advertisingBenefits: [
      "Pesan promosi langsung tersampaikan dalam 1 detik pertama tanpa perlu membaca caption panjang",
    ],
    recommendedModels: [
      { name: "ChatGPT DALL-E 3", description: "Paling akurat dalam merender ejaan teks bahasa Inggris di dalam gambar." },
      { name: "Flux 1.1 Pro", description: "Sangat baik merender teks pendek dan material 3D huruf." },
    ],
    promptFormulaTips: [
      "Tuliskan teks di dalam tanda kutip ganda dan tentukan material hurufnya.",
    ],
    samplePrompt:
      "Creative typography poster featuring bold 3D inflated chrome metallic letters spelling 'SUMMER DROP' floating above crystal clear turquoise water ripple, sunny pool lighting, ultra-crisp 4K --ar 4:5",
  },
  "youtube-thumbnail": {
    engineId: "youtube-thumbnail",
    title: "High-CTR Video & YouTube Thumbnail",
    badge: "High-CTR Visual",
    tagline: "Visual rasio 16:9 dengan ekspresi emosional tajam, kontras dramatis, dan komposisi thumbnail pemenang klik.",
    description:
      "Engine spesialis rasio 16:9 untuk thumbnail YouTube, banner landscape website, atau cover video horizontal dengan saturasi warna kontras tinggi yang terbukti mendongkrak Click-Through Rate.",
    aspectRatio: "16:9 (1920 x 1080 px Widescreen)",
    primaryUseCases: [
      "Thumbnail video YouTube & podcast",
      "Banner hero header website & marketplace",
      "Landscape display ads di Google & Meta Network",
    ],
    advertisingBenefits: [
      "Memaksimalkan rasio klik (CTR) video hingga 2-3x lipat dibanding thumbnail biasa",
    ],
    recommendedModels: [
      { name: "Midjourney v6.1", description: "Ekspresi wajah dramatis dan pencahayaan edge rim light yang menonjol." },
      { name: "Flux 1.1 Pro", description: "Ketajaman latar belakang dan pemisahan subjek yang luar biasa." },
    ],
    promptFormulaTips: [
      "Tambahkan 'vibrant saturated colors, dramatic rim light on subject, expressive reaction face'.",
    ],
    samplePrompt:
      "High-CTR YouTube thumbnail visual: Tech reviewer looking amazed at a glowing holographic smartphone, split contrasting background of electric blue and neon orange, dramatic rim light, 8K --ar 16:9",
  },
  "copy-writing": {
    engineId: "copy-writing",
    title: "AI Advertising Copywriting Engine",
    badge: "Sales Copywriting",
    tagline: "Meracik headline iklan, naskah promosi berformula AIDA / PAS, dan caption Instagram persuasif.",
    description:
      "Engine copywriting menghasilkan teks promosi yang menggugah emosi, lengkap dengan Headline Pemikat, Penjelasan Benefit, Call-To-Action (CTA) tegas, dan rekomendasi Hashtag tertarget.",
    aspectRatio: "Text Output (Caption & Script)",
    primaryUseCases: [
      "Caption postingan Instagram & carousel",
      "Copywriting teks iklan Meta Ads & TikTok Ads",
      "Broadcast pesan promosi WhatsApp & email newsletter",
    ],
    advertisingBenefits: [
      "Mengubah penonton visual menjadi pembeli aktif dengan trigger psikologi persuasi",
    ],
    recommendedModels: [
      { name: "DeepSeek v3 / GPT-4o", description: "Pemahaman bahasa Indonesia kasual, persuasif, dan relevan dengan tren lokal." },
    ],
    promptFormulaTips: [
      "Sertakan target audiens dan pain point terbesar mereka dalam brief.",
    ],
    samplePrompt:
      "Tuliskan caption Instagram formula PAS (Problem, Agitate, Solution) untuk serum wajah pencerah jerawat, gaya bahasa santai Gen-Z tapi meyakinkan, akhiri dengan promo diskon 30% dan ajakan klik link bio.",
  },
  "menu-fnb": {
    engineId: "menu-fnb",
    title: "Food & Beverage Commercial Photography",
    badge: "F&B Commercial",
    tagline: "Foto makanan & minuman menggiurkan (mouth-watering) sekelas iklan resto bintang lima.",
    description:
      "Spesialis meracik prompt visual kuliner dengan detail kelezatan tinggi: efek kuah berkilau, keju meleleh, embun dingin di gelas minuman, asap hangat mengepul, dan pencahayaan studio warm.",
    aspectRatio: "1:1 atau 4:5",
    primaryUseCases: [
      "Foto buku menu digital resto & cafe",
      "Postingan promosi kuliner di Instagram, GoFood, & GrabFood banner",
      "Iklan launching menu baru cafe & artisan bakery",
    ],
    advertisingBenefits: [
      "Memicu nafsu makan seketika (appetite appeal) yang mendorong keputusan pembelian cepat",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Tekstur minyak, saus, butiran gula, dan kesegaran sayur sangat nyata." },
      { name: "Midjourney v6.1", description: "Pencahayaan dramatis warm golden hour kuliner terbaik." },
    ],
    promptFormulaTips: [
      "Gunakan kata sensorik: 'sizzling smoke, glistening sauce, crispy golden brown texture, macro food lens'.",
    ],
    samplePrompt:
      "Mouth-watering commercial food photography of artisan wagyu smash burger with melting cheddar cheese dripping onto dark slate board, fresh crisp lettuce, steam rising, warm studio rim lighting --ar 4:5 --v 6.1",
  },
  "face-card-analysis": {
    engineId: "face-card-analysis",
    title: "Model Face-Card & Portrait Analysis",
    badge: "AI Portrait Vision",
    tagline: "Analisis fitur wajah, lighting ratio, dan proporsi fotografi potret model komersial.",
    description:
      "Engine untuk menghasilkan prompt potret wajah model berkarakter kuat (face-card), beauty shot kecantikan, dan fotografi close-up kosmetik dengan tekstur kulit mikro yang sempurna.",
    aspectRatio: "4:5 atau 1:1",
    primaryUseCases: [
      "Iklan produk skincare, makeup, dan kecantikan wajah",
      "Foto potret profesional profil & editorial majalah",
    ],
    advertisingBenefits: [
      "Menampilkan tekstur kulit pori-pori natural tanpa efek plastik / animasi palsu",
    ],
    recommendedModels: [
      { name: "Flux 1.1 Pro", description: "Menjaga realisme tekstur kulit manusia (pores, freckles, micro-wrinkles) nomor satu di industri." },
    ],
    promptFormulaTips: [
      "Sebutkan: 'macro beauty portrait, detailed skin texture with visible pores, catchlight in eyes'.",
    ],
    samplePrompt:
      "Macro beauty portrait of Southeast Asian woman applying hydrating facial mist, dewy glass skin texture with fine pores, soft natural beauty lighting, 85mm lens f/1.8, razor sharp focus --ar 4:5",
  },
  "video-storyboard": {
    engineId: "video-storyboard",
    title: "Video Scene & Storyboard Prompts",
    badge: "Video Storyboard",
    tagline: "Prompt adegan per-scene terstruktur untuk video generator AI (Runway Gen-3, Kling, Luma).",
    description:
      "Engine yang meracik prompt berurutan per-scene (Opening, Action, Product Reveal, Closing) dengan instruksi pergerakan kamera sinematik (dolly zoom, pan, drone shot) yang siap di-copy ke tool AI video.",
    aspectRatio: "16:9 (Landscape Video) atau 9:16 (Vertical Reels)",
    primaryUseCases: [
      "Storyboard video iklan TVC dan Reels komersial",
      "Konsep konten video sinematik untuk brand storytelling",
    ],
    advertisingBenefits: [
      "Mempercepat proses pra-produksi video promosi dari hitungan hari menjadi menit",
    ],
    recommendedModels: [
      { name: "Runway Gen-3 / Kling AI / Luma", description: "Menerjemahkan instruksi gerak kamera dan transisi scene secara halus." },
    ],
    promptFormulaTips: [
      "Sertakan instruksi gerak kamera: 'slow smooth drone flyover', 'fast cinematic whip pan transition'.",
    ],
    samplePrompt:
      "Scene 1/4: Dynamic low-angle tracking shot of a matte black sports car drifting through neon-lit futuristic street, volumetric tire smoke, raindrops reflecting streetlights, 4K cinematic video prompt",
  },
};

/**
 * Universal resolver to match engine ID regardless of dash or underscore formatting
 */
export function getEngineGuide(id: string | undefined): EngineGuide | undefined {
  if (!id) return undefined;
  const clean = id.toLowerCase().trim();
  const withDash = clean.replace(/_/g, "-");
  const withUnderscore = clean.replace(/-/g, "_");

  return ENGINE_GUIDES[withDash] || ENGINE_GUIDES[withUnderscore] || ENGINE_GUIDES[clean];
}

