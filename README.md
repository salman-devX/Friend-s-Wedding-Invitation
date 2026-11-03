# Usama & Maheen — Wedding Invitation

Mehndi 5 Dec 2026 (8:00 PM) · Baraat 6 Dec 2026 (12:30 PM) · Walima 7 Dec 2026 (2:00 PM)

## Kya kya ready hai
- Photo gallery (lightbox ke saath), parallax photo banner, falling petals, animated countdown
- Background music (`audio/music.mp3`), top-right wala music button se on/off
- WhatsApp RSVP (number `js/config.js` me set hai)
- Har event ke liye Google Calendar / Apple-Outlook "add to calendar" button

## Kuch bhi badalna ho to sirf `js/config.js` kholo
Naam, dates, venue, maps link, WhatsApp number, gallery, music, sab wahin hai.

## Abhi baaki (venue confirm hone par)
1. **Venue** - `js/config.js` me har event ka `venue`, `address`, `mapsUrl` bharo.
   (Khali ho to card par "Venue details will be shared soon" likha aata hai.)
2. **Dulha/Dulhan ki asli photos** - `images/groom.jpg` aur `images/bride.jpg` daalo (square best).
   Jab tak nahi hain, naam ka pehla harf (U / M) nazar aata hai.
3. **Gallery ki photos** - abhi stock wedding photos hain. Asli photos `images/gallery/` me daal kar
   `config.js` ki `gallery` list me naam badal do.
4. **WhatsApp link preview** - deploy ke baad `index.html` me `YOUR-SITE-URL` ko asli link se replace karo (2 jagah).

## Har mehman ke liye personal link
Link ke aakhir me `?to=Naam` lagao: `https://your-site.netlify.app/?to=Ahmed%20Khan`
Cover par "Dear Ahmed Khan," likha aayega.

## Deploy (free, 2 minute)
- **Netlify Drop**: app.netlify.com/drop par poora folder drag-drop karo. Link turant mil jata hai.
- **Vercel**: folder GitHub par push karo, Vercel me import karo (Framework: Other).
