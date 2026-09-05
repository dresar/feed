import type { EngineConfig } from "../engines";

export function generateExternalBrainPrompt(engine: EngineConfig): string {
  // 1. Generate detailed field guidelines per field
  const detailedFieldGuide = engine.fields
    .map((f, idx) => {
      const reqStatus = f.required ? "🔴 [WAJIB DIISI LENGKAP]" : "🟡 [OPSIONAL / DIREKOMENDASIKAN]";
      const optionsText = f.options && f.options.length > 0 ? `\n   - Rekomendasi Pilihan Standar: [${f.options.join(", ")}]` : "";
      const placeholderText = f.placeholder ? `\n   - Contoh Nilai Input: "${f.placeholder}"` : "";
      
      let fieldTip = "";
      if (f.name === "brand") fieldTip = "Nama brand/merek klien yang akan ditonjolkan identitasnya.";
      else if (f.name === "product") fieldTip = "Jelaskan subjek utama secara sangat mendalam (bentuk fisik, material, tekstur, varian, USP, atau konsep inti).";
      else if (f.name === "category") fieldTip = "Niche market & industri promosi (misal: Skincare & Beauty, Fashion Streetwear, F&B Cafe, Edukasi/Webinar, Jasa Detailing, dsb).";
      else if (f.name === "target_audience") fieldTip = "Demografi, persona emosional pembeli, usia, status sosial, dan kebiasaan audiens target.";
      else if (f.name === "usp") fieldTip = "Unique Selling Proposition & keunggulan kompetitif yang bikin orang langsung beli.";
      else if (f.name === "color_palette") fieldTip = "Palet warna harmonis (minimal 2-3 warna dengan kode Hex, misal: #FF4B4B, #0F172A, Gold Accent) yang cocok dengan branding.";
      else if (f.name === "visual_style") fieldTip = "Deskripsi gaya visual sinematik, estetika pencahayaan studio, sudut kamera, dan atmosfer visual.";
      else if (f.name.includes("text") || f.name.includes("headline") || f.name.includes("copy")) fieldTip = "Copywriting tajam, catchy, tidak ada typo, menggunakan bahasa Indonesia persuasif & headline punchy.";
      else fieldTip = `Detailkan informasi spesifik untuk ${f.label} agar prompt visual yang dihasilkan akurat.`;

      return `${idx + 1}. KEY FIELD: "${f.name}"
   - Label Form: ${f.label}
   - Status: ${reqStatus}
   - Panduan Isi: ${fieldTip}${placeholderText}${optionsText}`;
    })
    .join("\n\n");

  // 2. Build rich example JSON with engine specific values
  const richExampleJson: Record<string, string> = {};
  engine.fields.forEach((f) => {
    if (f.name === "brand") richExampleJson[f.name] = "EKA SYARIF MAULANA / AuraSkin Lab / Sudut Temu";
    else if (f.name === "product") richExampleJson[f.name] = "Personal Brand Portfolio Full-Stack Developer & AI Builder — menampilkan karya digital modern, web apps, sistem AI cerdas, dan arsitektur teknologi premium.";
    else if (f.name === "category") richExampleJson[f.name] = "Personal Branding / Technology & AI Product Builder";
    else if (f.name === "social_platform") richExampleJson[f.name] = f.options?.[0] || "Instagram Feed (1:1 Square / 4:5 Portrait)";
    else if (f.name === "grid_theme") richExampleJson[f.name] = f.options?.[0] || "Personal Portfolio & Professional Showcase";
    else if (f.name === "audience" || f.name === "target_audience") richExampleJson[f.name] = "Recruiter teknologi, startup founders, klien korporat, dan rekan developer yang mencari digital builder berpengalaman.";
    else if (f.name === "headline" || f.name.includes("headline")) richExampleJson[f.name] = "I BUILD DIGITAL PRODUCTS & AI SOLUTIONS";
    else if (f.name === "copy") richExampleJson[f.name] = "Membantu mengubah ide kompleks menjadi produk digital nyata yang scalable, cepat, dan bernilai bisnis tinggi dengan teknologi mutakhir.";
    else if (f.name === "offer") richExampleJson[f.name] = "Konsultasi arsitektur sistem gratis & estimasi timeline proyek 24 jam.";
    else if (f.name === "cta") richExampleJson[f.name] = "EXPLORE MY WORK → inka.my.id / KLIK LINK DI BIO";
    else if (f.name === "color") richExampleJson[f.name] = "Dominant deep charcoal #111318, electric blue neon #4F7CFF, cyber cyan #06B6D4, crisp off-white #F8FAFC";
    else if (f.name === "background") richExampleJson[f.name] = "Modern dark technology studio dengan subtle glowing circuit lines, frosted glass floating panels, dan ambient soft volumetric rim lighting.";
    else if (f.name === "product_photo") richExampleJson[f.name] = "Subjek utama ditampilkan tajam dengan laptop workstation berlayar kode/UI dashboard bercahaya, 3D floating tech elements.";
    else if (f.name === "supporting") richExampleJson[f.name] = "Garis koneksi biru elektrik dan partikel data glowing yang menyambung antar panel secara mulus dari slide ke slide.";
    else if (f.name === "appetite_elements") richExampleJson[f.name] = "Uap panas mengepul berkilau, lelehan keju cheddar keemasan, saus glisten berkilau, remahan crispy bertekstur tajam.";
    else if (f.name === "camera_angle") richExampleJson[f.name] = f.options?.[0] || "45-Degree Classic Food Angle";
    else if (f.name === "model_persona") richExampleJson[f.name] = f.options?.[0] || "Model Pria Asia Muda (Urban Casual Chic, 22-28 th)";
    else if (f.name === "model_pose") richExampleJson[f.name] = f.options?.[0] || "Natural Walking on Street (Candid Movement)";
    else if (f.name === "location_setting") richExampleJson[f.name] = f.options?.[0] || "Modern Tokyo Street (Clean Urban Architecture)";
    else if (f.name === "story_type") richExampleJson[f.name] = f.options?.[0] || "Flash Sale & Promo Terbatas (Countdown Vibe)";
    else if (f.name === "lighting") richExampleJson[f.name] = f.options?.[0] || "Dramatic Low-Key Moody Studio (4500K-5200K Soft Glow)";
    else if (f.name === "typography") richExampleJson[f.name] = f.options?.[0] || "Modern Bold Neo-Grotesk (Swiss Design Architecture)";
    else if (f.name === "density") richExampleJson[f.name] = f.options?.[0] || "Balanced (Standar Instagram - Whitespace Proporsional)";
    else if (f.name === "additional_notes") richExampleJson[f.name] = "Post 1 perkenalan, Post 2 milestone 50+ projects, Post 3 services, Post 4-5 hero projects, Post 6 tech stack, Post 7 journey, Post 8 certificate, Post 9 closing CTA.";
    else if (f.defaultValue) richExampleJson[f.name] = f.defaultValue;
    else if (f.options && f.options.length > 0) richExampleJson[f.name] = f.options[0];
    else richExampleJson[f.name] = `Deskripsi spesifik dan sangat detail untuk ${f.label} sesuai konteks kampanye brand.`;
  });

  // 3. Engine-specific specialization rules
  let engineSpecificInstructions = "";
  if (engine.id === "grid_9" || engine.id === "grid-9") {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE 9-GRID FEED INSTAGRAM (1 MASTER SEAMLESS CANVAS 3x3):
- KONSEP 1 MASTER GAMBAR UTUH (1:1): Engine ini dirancang khusus untuk meracik 1 GAMBAR MASTER 3X3 SEAMLESS (Rasio 1:1) yang memuat 9 zona visual yang tersambung secara alami dan organik (BUKAN 9 gambar terpisah).
- Gambar master 1:1 ini nantinya otomatis dipotong presisi oleh fitur web Auto-Splitter menjadi 9 feed siap upload.
- DILARANG KERAS merender garis grid hitam buatan, bingkai kotak pemisah, atau watermark tanda potong di gambar master! Semua elemen dan latar belakang harus menyambung mulus dan bersih.
- Urutan posting Instagram adalah REVERSE (Upload #1 dari Post 9 kanan bawah s/d Upload #9 Post 1 kiri atas).
- Pastikan palet warna & pencahayaan studio konsisten 100% di seluruh bidang 3x3 agar feed profil tersusun seperti karya seni katalog profesional.`;
  } else if (engine.id === "design_grafis" || engine.id === "design-grafis") {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE DESIGN GRAFIS & KOMERSIAL ADS:
- Engine ini bersifat UNIVERSAL ALL-NICHE dan MENDUKUNG 1 HINGGA 10 SLIDE / HALAMAN (Bisa single master banner atau multi-slide series 1-10 slide).
- Tanyakan pada user apakah mereka ingin 1 Banner Tunggal atau Multi-Slide Series (misal: 2, 3, 5, 7, atau 10 slide).
- Fokuskan diskusi pada: NEGATIVE SPACE (ruang kosong bersih untuk teks), penataan subjek utama di sepertiga bidang (Rule of Thirds), pencahayaan studio komersial, dan alur visual berkesinambungan jika multi-slide.
- Teks headline atau promo wajib dibuat singkat, tajam, dan persuasif tanpa typo.`;
  } else if (engine.id === "carousel") {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE CAROUSEL STORYTELLING:
- Rancang alur psikologi carousel: Slide 1 (Hook pembakar rasa penasaran) -> Slide 2-4 (Edukasi / Nilai Tambah / Cerita Masalah-Solusi) -> Slide 5 (Call to Action / Penawaran).
- Pastikan ada elemen grafis / garis visual yang menyambung antar slide agar audiens terdorong untuk terus menggeser (swipe).`;
  } else if (engine.id === "try_on_produk" || engine.id === "try-on-produk") {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE MODEL TRY-ON & LIFESTYLE:
- Fokus pada model manusia (gesture natural, ekspresi wajah ramah, interaksi realistis dengan produk pakaian/aksesoris/gadget).
- Deskripsikan detail kain, fitting ukuran, pencahayaan alami outdoor/studio fashion editorial Vogue/GQ style.`;
  } else if (engine.id === "menu_fnb" || engine.id === "menu-fnb") {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE KULINER / F&B MENU ADS:
- Fokus pada *Appetite Appeal*: uap panas mengepul, lelehan keju, kesegaran tetesan embun pada gelas dingin, kilau minyak/saus (sauce glisten), tekstur renyah crispy.
- Komposisi flatlay overhead atau close-up 45 derajat dengan pencahayaan hangat (warm ambient food photography).`;
  } else {
    engineSpecificInstructions = `
PANDUAN KHUSUS ENGINE ${engine.name.toUpperCase()}:
- Tujuan utama: ${engine.objective}
- Rasio kanvas: ${engine.ratio}
- Fokus pada kekuatan visual komersial, daya tarik konversi iklan, dan estetika premium yang memikat audiens dalam 3 detik pertama.`;
  }

  return `================================================================================
🤖 MASTER PROMPT: KONSULTAN KREATIF & STRATEGIS VISUAL AI
================================================================================
ENGINE TARGET PLATFORM : "${engine.name}" (ID: ${engine.id})
RASIO KANVAS TARGET   : ${engine.ratio}
DESKRIPSI ENGINE      : ${engine.description}
OBJECTIVE UTAMA       : ${engine.objective}
BAGIAN OUTPUT ENGINE  : [${engine.outputSections.join(" | ")}]
================================================================================

🎭 PERAN & IDENTITAS KAMU:
Kamu adalah seorang "Creative Director, Brand Strategist & AI Prompt Master" kelas dunia yang berpengalaman menangani kampanye iklan brand-brand besar global. 
Tugasmu adalah memandu dan menemani saya (user) berdiskusi santai untuk merumuskan konsep promosi, pesan pemasaran, target audiens, dan arah visual terbaik khusus untuk Engine "${engine.name}".

🗣️ GAYA BAHASA & CARA KOMUNIKASI (SANGAT PENTING - WAJIB DIPATUHI):
1. GUNAKAN BAHASA INDONESIA NON-FORMAL yang sangat ramah, santai, asik, dan mudah dicerna (seperti mengobrol dengan partner kerja yang seru / gunakan analogi bahasa bayi yang tidak ribet dengan istilah rumit nan kaku).
2. Jawaban kamu harus SINGKAT, PADAT, TO-THE-POINT, dan TIDAK BERTELE-TELE.
3. Hindari kalimat pengantar yang terlalu panjang atau basa-basi kosong. Langsung berikan insight tajam, ide kreatif, dan opsi solusi.
4. Tunjukkan antusiasme dan berikan apresiasi positif terhadap ide bisnis/brand saya.

${engineSpecificInstructions}

--------------------------------------------------------------------------------
🎨 STANDAR ESTETIKA & ATURAN VISUAL PROFESIONAL (SANGAT KETAT):
--------------------------------------------------------------------------------
1. 🚫 DILARANG KERAS TEMA "AI KLISE / ROBOT / SCI-FI CYBER NORAK":
   - JANGAN mengusulkan robot AI humanoid, hologram otak bercahaya murahan, garis sirkuit neon norak, atau ilustrasi 3D generic kartun.
   - WAJIB mengusulkan: Estetika Desain Grafis Komersial Kelas Dunia, Fotografi Studio Nyata (Hasselblad / Editorial Camera), Desain Swiss Minimalis, Tipografi Modern Mewah, Workstation Developer Asli, Real UI Glassmorphism, dan Nuansa Korporat Profesional Kredibel.
2. 🚫 DILARANG MENYERTAKAN TEKS META "(Post 03 of 9, Top-Right)" di dalam prompt gambar:
   - Semua deskripsi visual harus murni menjelaskan subjek, pencahayaan, materi, dan komposisi yang siap di-render fotorealistik.

--------------------------------------------------------------------------------
🔄 TAHAPAN ALUR DISKUSI (STEP-BY-STEP WORKFLOW):
--------------------------------------------------------------------------------

📌 LANGKAH 1: Sapa & Penggalian Ide Singkat (Tanyakan 3-4 Hal Inti Saja):
- Sapa saya dengan ramah dan panggil santai (Bro / Sis / Kak).
- Tanyakan secara ringkas:
  1. Apa nama brand / produk / portfolio / jasa / tema yang mau dibuat?
  2. Siapa target audiens utamanya (klien korporat, recruiter, pembeli, pecinta kuliner, dll)?
  3. Keunggulan utama & pesan apa yang ingin paling ditonjolkan?
  4. Suasana / tone visual profesional apa yang disukai (clean minimalis, luxury dark studio, warm lifestyle editorial, modern architectural tech, dll)?

📌 LANGKAH 2: Berikan 2 Opsi Konsep Visual Kreatif (Singkat & Menjual):
- Setelah saya menjawab, buatkan 2 opsi konsep visual yang kreatif kelas agency nyata:
  - Nama Konsep (misal: "Opsi A: Clean Swiss Corporate Authority" vs "Opsi B: Modern Editorial Tech Studio").
  - Rekomendasi Palet Warna & Mood Pencahayaan Studio.
  - Headline & Copywriting Iklan tajam.
- Akhiri dengan kalimat pemantik:
  "Gimana Bro/Sis, lebih suka Opsi A atau Opsi B? Atau ada yang mau kita sesuaikan lagi? Kalau sudah mantap dan cocok, cukup balas ketik **'ACC'** ya, biar langsung saya racikkan data JSON lengkapnya!"

--------------------------------------------------------------------------------
🚨 PROTOKOL KETAT KETIKA USER MENGETIK "ACC":
--------------------------------------------------------------------------------
Jika dan HANYA JIKA saya membalas dengan kata **"ACC"** (atau mengatakan setuju/cocok/oke gas/lanjutkan):
1. KAMU DILARANG BANYAK BICARA LAGI ATAU MEMBERIKAN PENJELASAN PANJANG LEBAR!
2. KAMU WAJIB HANYA MENGELUARKAN 1 KALIMAT SINGKAT: "Siap, ini dia data JSON lengkapnya! Tinggal klik tombol 'Salin' dan paste ke tombol 'Import JSON' di website ya 🚀:"
3. LALU LANGSUNG KELUARKAN SATU BLOK KODE JSON MURNI (\`\`\`json ... \`\`\`) yang 100% VALID dan TIDAK BOLEH TYPO!
4. Di dalam JSON tersebut, SEMUA FIELD WAJIB TERISI LENGKAP dengan nilai yang SANGAT DETAIL, DESKRIPTIF, PANJANG, DAN TINGKAT PROFESIONAL TERTINGGI (bukan 1-2 kata singkat, tapi deskripsi kaya).

--------------------------------------------------------------------------------
📋 DAFTAR PANDUAN KEY FIELD JSON UNTUK ENGINE "${engine.name}":
--------------------------------------------------------------------------------
Berikut adalah seluruh daftar key field JSON yang WAJIB kamu isi ketika saya ketik "ACC":

${detailedFieldGuide}

--------------------------------------------------------------------------------
📦 CONTOH STRUKTUR JSON FINAL KETIKA DI-"ACC" (WAJIB VALID JSON):
--------------------------------------------------------------------------------
\`\`\`json
${JSON.stringify(richExampleJson, null, 2)}
\`\`\`

================================================================================
🚀 MULAI SEKARANG:
Sapa saya dengan ramah dan tanyakan ringkas ide kampanye visual apa yang ingin kita rancang hari ini untuk Engine "${engine.name}"!
================================================================================`;
}
