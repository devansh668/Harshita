# 🎂 Personalized Birthday Surprise Website for Harshita

A premium-grade, interactive, and emotional birthday surprise website built with **Next.js 14**, **React 18**, **Tailwind CSS**, **Framer Motion**, and the **Web Audio API**.

---

## ✨ Features

1. **Magical Landing Hero**:
   - Pastel pink, lavender, and champagne gradient background with interactive floating particles.
   - Animated 3D-styled birthday cake with flickering candles.
   - "Open Your Surprise" button with smooth viewport transition.

2. **Her Photo Studio & Gallery**:
   - 9 mathematical photo enhancement sliders: Brightness, Contrast, Saturation, Blur, Background Blur, Warmth/Cool Color Temp, Vintage Sepia, B&W, and Dreamy Bloom.
   - One-click aesthetic presets (*Golden Hour*, *Film Noir*, *Warm Sunset*, *Soft Pastel*, *Studio Glamour*).
   - Interactive Before/After split comparison slider with 100% pixel alignment.

3. **AI Cartoon World Gallery**:
   - 9 artistic styles: Modern Anime / Manhwa (Korean webtoon style), 3D Pixar, Cute Anime, Fairytale Disney, Pencil Sketch, Watercolor, Soft Aesthetic, Chibi, and Pro Enhance.
   - Dynamic aspect-ratio adaptation (`aspect-auto` with `max-h-[68vh]`) so vertical portraits and landscape photos never get heads or feet cut off.
   - Dual uploaders: Upload original photos and upload converted AI artwork.

4. **The Joy Jar & Sky Lantern Sanctuary**:
   - **Interactive Joy Jar**: A digital gratitude jar filled with folded origami stars. Tap to draw touching reasons and compliments about why she is cherished. Includes a modal to add your own custom reasons.
   - **Make a Secret Birthday Wish**: An interactive twilight starfield where she writes her heartfelt birthday wish and releases a luminous 3D paper sky lantern into the night sky, permanently archived in her private *Wish Vault*.

5. **Scrapbook Memories**:
   - Polaroid wall with washi tape, tilt angles, decorative stickers, and a chronological story timeline.
   - "+ Add Memory" modal with live preview.

6. **Special Handwritten Birthday Letter**:
   - A digital envelope sealed with an interactive wax seal.
   - Click to unfold an elegant parchment letter with handwriting typography and floating hearts.
   - Editable in place so you can craft your personal message.

7. **Interactive Birthday Celebration**:
   - Animated birthday cake with blowable candles (click candle or "Blow Out Candles" button with realistic smoke puff animations).
   - Multi-burst confetti cannons, floating pastel balloons, and night fireworks canvas.
   - Acoustic music box synthesizer playing "Happy Birthday" (zero external streaming dependencies; Web Audio API).

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
# Navigate to http://localhost:3000
```

To create an optimized production build:
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Render (Free Web Service)

This repository includes a `render.yaml` blueprint for instant deployment.

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Birthday Surprise Website for Harshita"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Render will auto-detect the configuration:
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Click **Create Web Service**. Your live URL will be ready in 2–3 minutes!

---

## 📸 How to Add Her Real Photographs

All private personal photographs have been safely removed from this repository and replaced with aesthetic placeholders so you can safely push to a public GitHub repository.

You can add her photographs in two easy ways:

### Method A: Directly Through the Website (Recommended)
1. Open the website on your phone or computer.
2. In **Her Gallery**, click **"Upload Photo"**.
3. In **Cartoon World**, click **"1. Upload Original Photo"** and **"2. Upload Converted AI Artwork"**.
4. In **Memories**, click **"Add Memory"**.
*All uploads are processed securely in your browser and saved to your device's `localStorage`.*

### Method B: Adding Files Locally Before Deploying
1. Place her photos in `public/images/friend/`:
   - `photo1.jpg`
   - `photo2.jpg`
   - `photo3.jpg`
2. Update the image paths in `src/lib/birthdayData.ts`:
   ```typescript
   export const SAMPLE_GALLERY_PHOTOS: GalleryPhoto[] = [
     {
       id: 'p1',
       title: 'Her Radiance',
       originalUrl: '/images/friend/photo1.jpg',
       ...
     },
   ];
   ```
3. Commit and push:
   ```bash
   git commit -am "Add personal photos"
   git push
   ```

---

## ⚙️ Customization

You can customize her name, birthday date, greeting message, and letter text in two ways:
1. **In the Web App**: Click the gear icon (**Settings**) in the floating navbar to edit live.
2. **In Code**: Edit `src/lib/birthdayData.ts` to update `DEFAULT_CONFIG`.

---

Crafted with heartfelt love and imagination for Harshita ✨
