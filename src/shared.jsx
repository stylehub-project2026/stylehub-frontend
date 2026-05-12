import React, { useRef, useEffect, useCallback, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

export function useScrollReveal() {
  const refs = useRef([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      refs.current.forEach(r => r && r.classList.remove("revealed"));
      const obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        }),
        { threshold: 0.01, rootMargin: "0px 0px -20px 0px" }
      );
      refs.current.forEach(r => r && obs.observe(r));
      return () => obs.disconnect();
    }, 50);
    return () => clearTimeout(timer);
  });
  return useCallback(el => { if (el && !refs.current.includes(el)) refs.current.push(el); }, []);
}

const I = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /> </svg>,
  cart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>,
};
const Heart = ({ on }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const BRANDS = [
  { name: "27", logo: "/27.jpg", href: "/brand/27" },
  { name: "MARBLE", logo: "/marble.jpg", href: "/brand/marble" },
  { name: "أنتيكا", logo: "/antika.jpg", href: "/brand/antika" },
  { name: "salty", logo: "/saltyy.jpg", href: "/brand/salty" },
  { name: "Ninos", logo: "/ninos.jpg", href: "/brand/ninos" },
  { name: "Black closet", logo: "/bb.jpg", href: "/brand/black-closet" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "Sell with us", href: "#" },
  { label: "Build an Outfit", href: "/BuildOutfit" },
  { label: "Brands", href: "#", dropdown: true },
];

export const FOOTER_COLS = [
  { title: "Shop", links: [["Women", "/women"], ["Men", "#"], ["Kids", "/kids"]] },
  { title: "Sell With Us", links: [["Sign Up", "/seller"], ["How It Works", "/seller"], ["Brand Stories", "#"]] },
  { title: "Discover", links: [["New Arrivals", "#"], ["Build Outfit", "/buildoutfit"], ["Trending", "#/"]] },
  { title: "Contact Us", links: [["Support", "#"], ["About Us", "/aboutus"], ["Instagram", "#"], ["Facebook", "./https://www.facebook.com/profile.php?id=61584765721087"]] },
];

export const PRODUCTS = [
  { id: 1, tab: "best", gender: "men", name: "Marble Stripes", brand: "MARBLE", price: "LE 700", oldPrice: "LE 1,100", img: "/mar.jpg", imgs: ["/other.jpg", "/other2.jpg"], colors: ["#1a1a2e"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.8, reviews: 124, desc: "Bold-stripe tee, 100% Egyptian cotton." },
  { id: 2, tab: "best", name: "Red Alfenat Hoodie Kids", brand: "Antikka", category: "boys", type: "tops", price: "LE 920", oldPrice: "LE 1,800", img: "/red.jpg", imgs: ["/othe3.jpg"], colors: ["#e63946", "#fff"], sizes: ["6Y", "8Y", "10Y"], rating: 4.9, reviews: 20, desc: "Cozy fleece hoodie, perfect for kids." },
  { id: 3, tab: "best", gender: "men", name: "Cream Knitted Zipper", brand: "Antikka", price: "LE 750", oldPrice: "LE 870", img: "/zip.jpg", imgs: ["/a1.jpg", "/a2.jpg"], colors: ["#c2c6c8ff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 56, desc: "Knitted quarter zipper perfect for women and men." },
  { id: 4, tab: "best", gender: "women", name: "27 Pink Sweater", brand: "27", img3d: "no1.jpg", price: "LE 750", oldPrice: "LE 950", img: "/pink27.jpg", imgs: ["/b2.jpg", "/chart.jpg"], colors: ["#f4a0b5"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 203, desc: "100% cotton, Boxy fit, dreamy blush pink." },
  { id: 5, tab: "best", gender: "unisex", name: "Printed Oversized Hoodie", brand: "Marble", price: "LE 690", oldPrice: "LE 860", img: "/green.jpg", imgs: ["/b3.jpg", "/b4.jpg"], colors: ["#445c35ff"], sizes: ["M", "L", "XL"], rating: 4.9, reviews: 78, desc: "Printed Oversized Hoodie brings bold streetwear energy, 98% cotton.", desc2: "Featuring a front 'The Marble Club' graphic, kangaroo pocket, and an oversized fit." },
  { id: 6, tab: "best", gender: "men", name: "Studio Zip-up", brand: "Salty", type: "jackets", price: "LE 600", oldPrice: "LE 870", img: "/saltyhood.jpg", colors: ["#1a1a18"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Premium Fit Zip-up. Male Model Height 185cm wearing size L." },
  { id: 15, tab: "new", name: "Bored Kids T-Shirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 450", oldPrice: null, img: "/kid.jpg", colors: ["#b4b8acff", "#fff"], sizes: ["10Y", "12Y", "14Y", "16Y"], rating: 4.7, reviews: 12, desc: "Bored T-Shirt, perfect addition to your casual wardrobe. Made from soft and comfortable fabric." },
  { id: 16, tab: "new", gender: "unisex", name: "Navy 27 Zip Up", brand: "27", price: "LE 790", oldPrice: "LE 1,100", img: "/270.jpg", colors: ["#111c3eff"], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 8, desc: "Ultra-soft oversized zip-up." },
  { id: 17, tab: "new", gender: "men", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 850", oldPrice: "LE 1,000", img: "/yem.jpg", imgs: ["/c1.jpg", "/c2.jpg"], colors: ["#f3f3eeff"], sizes: ["S", "M", "L", "XL"], rating: 4.6, reviews: 21, desc: "Oversized hoodie in sweatshirt fabric, cotton blend with soft brushed inside." },
  { id: 18, tab: "new", gender: "unisex", name: "The Nefertiti Hoodie", brand: "Antikka", price: "LE 920", oldPrice: null, img: "/aob.jpg", imgs: ["/d1.jpg", "/d2.jpg"], colors: ["#3d3b3cff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 6, desc: "The Charcoal Nefertiti Hoodie, 90% cotton. Oversized fit - Unisex." },
  { id: 19, tab: "new", gender: "unisex", name: "Orange Oversized Tee", brand: "Antikka", price: "LE 650", oldPrice: null, img: "/antsh.jpg", imgs: ["/e1.jpg", "/e2.jpg", "/e3.jpg"], colors: ["#d98036ff"], sizes: ["XS", "S", "M", "L"], rating: 4.5, reviews: 15, desc: "Antikka orange oversized tee, 100% cotton." },
  { id: 20, tab: "new", name: "SWD Kids Jeans Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 850", oldPrice: null, img: "/boyn.jpg", imgs: ["/f1.jpg", "/f2.jpg"], colors: ["#3779c8ff"], sizes: ["8Y", "9Y", "10Y", "11Y", "12Y"], rating: 4.7, reviews: 31, desc: "Stylish SWD Jeans Jacket, high-quality materials for comfort and style." },
  { id: 21, tab: "sale", gender: "women", name: "Pleated Cardigan Abaya", brand: "Black Closet", price: "LE 2,400", oldPrice: "LE 2,600", img: "/abya.jpg", imgs: ["/g1.jpg", "/g2.jpg"], colors: ["#0f0801ff"], sizes: ["S", "M", "L"], rating: 4.4, reviews: 88, desc: "Black abaya with asymmetric layered cardigan, round neckline, pleated detailing, elasticated cuffs." },
  { id: 22, tab: "sale", gender: "unisex", name: "Basic Sweatpants", brand: "27", img3d: "pant1.jpg", price: "LE 690", oldPrice: "LE 900", img: "/pant.jpg", colors: ["#b2aa9cff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 54, desc: "Beige Basic Sweatpants." },
  { id: 23, tab: "sale", name: "Kids Puffer Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 900", oldPrice: "LE 1,400", img: "/puff.jpg", imgs: ["/h1.jpg"], colors: ["#d1bcaaff"], sizes: ["8Y", "10Y", "12Y"], rating: 4.3, reviews: 42, desc: "Stay warm with our Off-White Puffer Jacket." },
  { id: 24, tab: "sale", gender: "men", name: "Slt line T-shirt", brand: "Salty", type: "tops", price: "LE 350", oldPrice: "LE 400", img: "/20.jpg", colors: ["#b8b0a8", "#1a1a18"], sizes: ["S", "M", "L"], rating: 4.7, reviews: 67, desc: "Salty Studios t shirt, suited for both men and women." },
  { id: 25, tab: "sale", name: "Kids Cutting Pullover", brand: "NINOS", category: "girls", type: "tops", price: "LE 500", oldPrice: "LE 750", img: "/kido.jpg", colors: ["#e8e2e6ff"], sizes: ["6Y", "8Y", "10Y", "12Y", "14Y"], rating: 4.5, reviews: 39, desc: "Cutting Pullover, soft knit fabric, comfortable and flattering fit." },
  { id: 26, tab: "sale", gender: "women", name: "Cable Knitted Dress", brand: "Black Closet", price: "LE 1,500", oldPrice: "LE 2,400", img: "/abyaa.jpg", imgs: ["/i1.jpg"], colors: ["#cdd1c9ff", "#695d5dff"], sizes: ["M", "L", "XL"], rating: 4.6, reviews: 112, desc: "Cozy elegance Cable Knitted Dress, perfect for chilly days." },
  { id: 7, tab: "trend", gender: "men", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 800", oldPrice: "LE 980", img: "/trend.jpg", imgs: ["/i2.jpg"], colors: ["#ffffffff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 44, desc: "White Stop Trying To Be Perfect Printed Oversized Hoodie, 98% cotton melton fabric." },
  { id: 8, tab: "trend", gender: "men", name: "Trouble Sweatpants", brand: "27", price: "LE 690", oldPrice: "LE 900", img: "/29.jpg", colors: ["#473635ff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 62, desc: "Navy edition, tailored fit." },
  { id: 9, tab: "trend", gender: "women", name: "Yellow 27 Sweater", brand: "27", price: "LE 600", oldPrice: "LE 890", img: "/0027.jpg", colors: ["#d0c259ff"], sizes: ["S", "M", "L", "XL"], rating: 4.6, reviews: 38, desc: "Yellow 27 sweater." },
  { id: 10, tab: "trend", gender: "unisex", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 600", oldPrice: "LE 900", img: "/hi.jpg", imgs: ["/j1.jpg", "/j2.jpg", "/j3.jpg"], colors: ["#e9ace1ff"], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 91, desc: "Pink Are You Serious? Printed Oversized Hoodie, 98% cotton melton.", desc2: "Material: 98% Cotton, 2% Polyester (Melton)." },
  { id: 27, tab: "trend", gender: "women", name: "Trench Denim", brand: "Black Closet", price: "LE 1,900", oldPrice: null, img: "/jean.jpg", colors: ["#1b1c66ff"], sizes: ["S", "M", "L"], rating: 4.7, reviews: 29, desc: "Modern denim set with structured belted jacket and matching full-length skirt." },
  { id: 28, tab: "trend", name: "Kids Striped Sweatshirt", brand: "NINOS", category: "boys", type: "tops", price: "LE 725", oldPrice: "LE 890", img: "/strip.jpg", colors: ["#b1b7c0ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.8, reviews: 47, desc: "Striped Sweatshirt in Navy or Off-White, sizes 4 to 14." },
  { id: 11, tab: "picks", gender: "men", name: "SVN27 Hoodie", brand: "27", price: "LE 840", oldPrice: null, img: "/new.jpg", imgs: ["/k1.jpg"], colors: ["#3440afff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 55, desc: "The 27 Hoodie." },
  { id: 12, tab: "picks", gender: "women", name: "Black Boxy Set", brand: "MARBLE", price: "LE 1,050", oldPrice: null, img: "/set.jpg", imgs: ["/k4.jpg", "/k5.jpg"], colors: ["#000000ff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 43, desc: "Black Boxy Embroidered Set, 98% cotton melton, structured boxy fit." },
  { id: 13, tab: "picks", name: "Kids Smile Sweatshirt", brand: "NINOS", category: "boys", type: "tops", price: "LE 700", oldPrice: null, img: "/kid6.jpg", colors: ["#e1d7baff"], sizes: ["8Y", "10Y", "12Y", "14Y"], rating: 4.6, reviews: 38, desc: "Smile Sweatshirt in soft cozy fabric, perfect for chilly days." },
  { id: 14, tab: "picks", gender: "women", name: "Printed ARI Sweatshirt", brand: "MARBLE", price: "LE 700", oldPrice: null, img: "/ari.jpg", colors: ["#28462dff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 72, desc: "ARIZONA 1981 print sweatshirt, retro college style in an oversized fit." },
  { id: 29, name: "Golden Sweatshirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 650", oldPrice: null, img: "/291.jpg", imgs: ["/292.jpg", "/293.jpg"], colors: ["#111112ff", "#7d7d80ff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Golden Sweatshirt, a stylish addition to your sweatshirt collection." },
  { id: 30, name: "Zip sweatshirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 550", oldPrice: null, img: "/30.jpg", colors: ["#7d7d80ff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Zip Sweatshirt, available in our new exclusive color." },
  { id: 31, name: "NYC Sweatshirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 550", oldPrice: null, img: "/31.jpg", imgs: ["/32.jpg"], colors: ["#5f1d1dff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stay cozy and stylish in our NYC Sweatshirt." },
  { id: 32, name: "Beige Sweatpants", brand: "NINOS", category: "boys", type: "bottoms", price: "LE 230", oldPrice: null, img: "/320.jpg", colors: ["#ded7d7ff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Elevate your casual wardrobe with our Beige Sweatpants." },
  { id: 33, name: "Gabardine Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 750", oldPrice: null, img: "/33.jpg", colors: ["#4d5647ff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stylish Gabardine Jacket." },
  { id: 34, name: "Leather Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 1,500", oldPrice: null, img: "/34.jpg", colors: ["#0f0f0fff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stay stylish and warm with our leather jacket collection." },
  { id: 35, name: "Dream Sweatshirt", brand: "NINOS", category: "boys", type: "tops", price: "LE 500", oldPrice: null, img: "/35.jpg", colors: ["#777576ff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stay cozy and stylish with our Dream Sweatshirt." },
  { id: 36, name: "Floral Knit Sweater", brand: "NINOS", category: "girls", type: "tops", price: "LE 870", oldPrice: null, img: "/36.jpg", colors: ["#ae92caff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Floral Knit Sweater 2PCS set in lovely lavender hue." },
  { id: 37, name: "Braided Pullover", brand: "NINOS", category: "girls", type: "tops", price: "LE 700", oldPrice: null, img: "/37.jpg", colors: ["#b90f0fff"], sizes: ["6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stylish Braided Pullover with unique braided design." },
  { id: 38, name: "Jeans Skirt", brand: "NINOS", category: "girls", type: "bottoms", price: "LE 450", oldPrice: null, img: "/38.jpg", colors: ["#324e95ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Medium Blue Jeans Skirt with classic A-line design." },
  { id: 39, name: "Disripting T-Shirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 450", oldPrice: null, img: "/39.jpg", imgs: ["/399.jpg"], colors: ["#324e95ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Disripting T-Shirt, perfect for adding edginess to your wardrobe." },
  { id: 40, name: "Sharleston Jeans Pants", brand: "NINOS", category: "girls", type: "bottoms", price: "LE 650", oldPrice: null, img: "/40.jpg", colors: ["#7c8089ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Stylish and comfortable Sharleston Jeans Pants." },
  { id: 41, name: "Brooklyn Sweatshirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 650", oldPrice: null, img: "/41.jpg", colors: ["#7c8089ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "The Brooklyn Sweatshirt, made from soft and cozy fabric." },
  { id: 42, name: "Jacket Jeans", brand: "NINOS", category: "girls", type: "jackets", price: "LE 750", oldPrice: null, img: "/42.jpg", colors: ["#223a72ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Jacket Jeans in classic Dark Blue color." },
  { id: 43, name: "Fur Jacket", brand: "NINOS", category: "girls", type: "jackets", price: "LE 750", oldPrice: null, img: "/43.jpg", colors: ["#c49eb8ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.7, reviews: 5, desc: "Luxurious Fur Jacket, perfect for adding elegance to any outfit." },
  { id: 44, name: "Authentic Babytee", gender: "women", brand: "Salty", type: "tops", price: "LE 300", oldPrice: "LE 500", img: "/44.jpg", imgs: ["/chart2.jpg"], colors: ["#1a1a18", "#4a4a48"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Authentic cotton babytee." },
  { id: 45, name: "Culture Tshirt", brand: "Salty", type: "tops", price: "LE 400", oldPrice: "LE 500", img: "/45.jpg", colors: ["#392420ff", "#4a4a48"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Culture T-Shirt represents the mindset behind Salty." },
  { id: 46, name: "Signature line Tshirt", brand: "Salty", type: "tops", price: "LE 400", oldPrice: "LE 500", img: "/46.jpg", colors: ["#d4d4d0ff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Signature T-Shirt, built on a clean oversized silhouette." },
  { id: 47, name: "Mercer Tshirt", brand: "Salty", type: "tops", price: "LE 600", img: "/47.jpg", colors: ["#0c361dff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Crafted from a textured, breathable fabric." },
  { id: 48, name: "Ocean Swim Tshirt", brand: "Salty", type: "tops", price: "LE 600", img: "/48.jpg", imgs: ["/saltychart2.jpg"], colors: ["#28479cff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Ocean Swim T-Shirt, inspired by long days under the sun." },
  { id: 49, name: "Chilli Babytee", brand: "Salty", type: "tops", price: "LE 300", img: "/49.jpg", colors: ["#28479cff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Crafted from soft stretch fabric." },
  { id: 50, name: "Origin Tshirt", brand: "Salty", type: "tops", price: "LE 500", img: "/50.jpg", colors: ["#9398a5ff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Origin T-Shirt, a clean oversized silhouette." },
  { id: 51, gender: "men", name: "Black Athletic Hoodie", brand: "MARBLE", img3d: "51.jpg", price: "LE 750", oldPrice: "LE 950", img: "/510.jpg", colors: ["#131212ff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 203, desc: "100% cotton, Boxy fit, Black hood." },
];

export const CATS = [
  { name: "MEN", img: "/man.jpg", link: "/men", gradient: "145deg,#8a9a7a,#4a5c40" },
  { name: "WOMEN", img: "/girl.png", link: "/women", gradient: "145deg,#c4b8a8,#8a7868" },
  { name: "KIDS", img: "/baby.jpg", link: "/kids", gradient: "145deg,#6b8aad,#3a5878" },
];

const API_BASE = "https://stylehub-backend-tau.vercel.app/api";

// ─── NAV ───
export function SHNav({ cart = [], wish = [] }) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(() => {
      setSearching(true);
      fetch(`${API_BASE}/products?search=${encodeURIComponent(searchQuery.trim())}&limit=6`)
        .then(r => r.json())
        .then(data => setSearchResults(data.data?.products || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); };

  return (
    <nav className="sh-nav sticky-top d-flex align-items-center justify-content-between px-4" style={{ position: "relative" }}>
      <a href="/" style={{ textDecoration: "none" }}>
        <img src="/logo.jpg" alt="StyleHub" style={{ height: "50px", objectFit: "contain" }}
          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "inline"; }} />
        <span style={{ display: "none", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--dark)" }}>SH</span>
      </a>
      <ul className="d-none d-lg-flex gap-4 list-unstyled mb-0">
        {NAV_LINKS.map(l => (
          <li key={l.label} className="nav-item d-flex align-items-center">
            <a href={l.href} style={{ color: "var(--dark)", textDecoration: "none", fontSize: ".73rem", letterSpacing: ".04em" }}>
              {l.label} {l.dropdown && <span style={{ fontSize: ".55rem", marginLeft: "3px" }}>▾</span>}
            </a>
            {l.dropdown && (
              <div className="dropdown">
                {BRANDS.map(b => (
                  <a key={b.name} href={b.href || "#"}
                    onClick={e => { if (b.href && b.href !== "#") { e.preventDefault(); navigate(b.href); } }}>
                    {b.name}
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="d-flex gap-3 align-items-center">
        <button onClick={() => setSearchOpen(s => !s)} className="nav-icon" style={{ background: "none", border: "none", padding: 0 }}>{I.search}</button>
        {searchOpen && (
          <div style={{ position: "fixed", top: "56px", left: 0, right: 0, background: "#fff", borderBottom: "1px solid var(--border)", zIndex: 1000, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".4rem", padding: ".7rem 1.5rem", borderBottom: searchResults.length > 0 || (searchQuery && !searching) ? "1px solid var(--border)" : "none" }}>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands..."
                style={{ flex: 1, border: "none", outline: "none", fontSize: ".85rem", fontFamily: "'DM Sans',sans-serif", color: "var(--dark)", background: "transparent" }} />
              {searching && <span style={{ fontSize: ".7rem", color: "var(--warm)" }}>...</span>}
              <button onClick={closeSearch} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)", fontSize: "1.1rem" }}>✕</button>
            </div>
            {searchResults.map(p => (
              <div key={p._id} onClick={() => { navigate(`/product/${p._id}`); closeSearch(); }}
                style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".65rem 1.5rem", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div style={{ width: 42, height: 52, background: "#f0ece6", flexShrink: 0, overflow: "hidden", borderRadius: 4 }}>
                  {p.images?.[0] && <img src={(p.images[0].startsWith('http') ? p.images[0] : `https://stylehub-backend-tau.vercel.app${p.images[0]}`)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: ".78rem", fontWeight: 500, color: "var(--dark)" }}>{p.name}</div>
                  <div style={{ fontSize: ".62rem", color: "var(--warm)", marginTop: ".1rem" }}>{p.seller?.brandName || "StyleHub"}</div>
                </div>
                <div style={{ fontSize: ".75rem", fontWeight: 600 }}>LE {(p.salePrice || p.price)?.toLocaleString()}</div>
              </div>
            ))}
            {searchQuery.trim() && !searching && searchResults.length === 0 && (
              <div style={{ padding: "1rem 1.5rem", fontSize: ".78rem", color: "var(--warm)" }}>No results for "{searchQuery}"</div>
            )}
          </div>
        )}
        <Link to={localStorage.getItem("token") ? "/profile" : "/signin"} className="nav-icon">{I.user}</Link>
        <Link to="/wishlist" className="nav-icon">
          <Heart on={false} />
          {wish.length > 0 && <span className="sh-badge">{wish.length}</span>}
        </Link>
        <Link to="/cart" className="nav-icon">
          {I.cart}
          {cart.length > 0 && <span className="sh-badge">{cart.reduce((s, x) => s + x.qty, 0)}</span>}
        </Link>
      </div>
    </nav>
  );
}
// ─── FOOTER ───
export function SHFooter() {
  const addRef = useScrollReveal();
  return (
    <footer className="sh-foot px-4 pt-5 pb-3">
      <div className="row g-4 mb-3">
        <div className="col-md-4 reveal" ref={addRef}>
          <a href="/" className="f-logo-txt d-block mb-3">
            <img src="/logi.jpg" alt="StyleHub" style={{ height: "100px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block" }} />
            <span style={{ display: "none" }}>StyleHub</span>
          </a>
          <p className="f-about mb-3">Your destination for Egypt's finest local fashion brands.</p>
          <div className="d-flex gap-2">
            {["F", "IG"].map(s => <a key={s} href="#" className="f-soc">{s}</a>)}
          </div>
        </div>
        {FOOTER_COLS.map((col, i) => (
          <div key={col.title} className={`col-md-2 col-6 reveal d${i + 1}`} ref={addRef}>
            <div className="f-col-title mb-3">{col.title}</div>
            <ul className="list-unstyled f-col">
              {col.links.map(([label, href]) => <li key={label} className="mb-2"><a href={href}>{label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center pt-3 flex-wrap gap-2" style={{ borderTop: "1px solid rgba(255,255,255,.15)" }}>
        <span className="f-copy">© 2026 StyleHub. All rights reserved.</span>
        <div className="d-flex gap-1">{["VISA", "FAWRY", "CASH"].map(p => <span className="fpb" key={p}>{p}</span>)}</div>
      </div>
    </footer>
  );
}


export const SHARED_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
:root { --cream:#F8F6F2; --dark:#1a1a18; --sage:#92A079; --deep:#728060; --warm:#8c8880; --border:#e4e0da; --gold:#c8a96e; --red:#e63946; }
body { font-family:'DM Sans',sans-serif; background:var(--cream); color:var(--dark); }
.sh-nav { background:#fff; border-bottom:1px solid var(--border); height:56px; }
.sh-nav a { color:var(--dark); text-decoration:none; font-size:1rem; letter-spacing:.04em; transition:color .2s; position:relative; padding-bottom:3px; }
.sh-nav a::after { content:''; position:absolute; bottom:0; left:0; width:0; height:1.6px; background:var(--sage); transition:width .25s; }
.sh-nav a:hover { color:var(--sage); } .sh-nav a:hover::after { width:100%; }
.sh-badge { background:var(--sage); color:#fff; font-size:.5rem; width:14px; height:14px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; position:absolute; top:-6px; right:-8px; }
.nav-icon { color:var(--dark); display:flex; align-items:center; position:relative; transition:color .2s; cursor:pointer; text-decoration:none; }
.nav-icon:hover { color:var(--sage); }
.nav-item { position:relative; }
.nav-item:hover .dropdown { opacity:1; pointer-events:auto; transform:translateY(0); }
.dropdown { position:absolute; top:100%; left:0; background:#fff; border:1px solid var(--border); min-width:160px; opacity:0; pointer-events:none; transform:translateY(8px); transition:all .25s; z-index:100; box-shadow:0 8px 24px rgba(0,0,0,.08); }
.dropdown a { display:block; padding:.6rem 1.2rem; font-size:.72rem; color:var(--dark); text-decoration:none; letter-spacing:.04em; transition:background .2s; }
.dropdown a:hover { background:var(--cream); color:var(--sage); }
.sh-foot { background:var(--deep); color:rgba(255,255,255,.8); }
.f-logo-txt { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:500; color:#fff; text-decoration:none; }
.f-about { font-size:.78rem; line-height:1.7; color:rgba(255,255,255,.55); }
.f-soc { width:30px; height:30px; border:1px solid rgba(255,255,255,.3); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.65rem; color:rgba(255,255,255,.6); text-decoration:none; transition:all .2s; }
.f-soc:hover { background:rgba(255,255,255,.15); color:#fff; }
.f-col-title { font-size:.64rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.45); font-weight:500; }
.f-col a { display:block; font-size:.78rem; color:rgba(255,255,255,.7); text-decoration:none; transition:all .2s; }
.f-col a:hover { color:#fff; }
.sh-foot a { color:rgba(255,255,255,.7); text-decoration:none; } .sh-foot a:hover { color:#fff; }
.f-copy { font-size:.7rem; color:rgba(255,255,255,.35); }
.fpb { background:rgba(255,255,255,.12); border-radius:3px; padding:.2rem .5rem; font-size:.58rem; color:rgba(255,255,255,.6); font-weight:600; }
.reveal { opacity:0; transform:translateY(24px); transition:opacity .7s,transform .7s; }
.revealed { opacity:1; transform:none; }
.d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s} .d4{transition-delay:.4s}
/* FOOTER */
.sh-foot { background:var(--deep); color:rgba(255,255,255,.8); }
.f-logo-txt { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:500; color:#fff; text-decoration:none; }
.f-about { font-size:.78rem; line-height:1.7; color:rgba(255,255,255,.55); }
.f-soc { width:30px; height:30px; border:1px solid rgba(255,255,255,.3); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.65rem; color:rgba(255,255,255,.6); text-decoration:none; transition:all .2s; }
.f-soc:hover { background:rgba(255,255,255,.15); color:#fff; }
.f-col-title { font-size:.64rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.45); font-weight:500; }
.f-col a { display:block; font-size:.78rem; color:rgba(255,255,255,.7); text-decoration:none; transition:all .2s; }
.f-col a:hover { color:#fff; }
.sh-foot a { color:rgba(255,255,255,.7); text-decoration:none; } .sh-foot a:hover { color:#fff; }
.f-copy { font-size:.7rem; color:rgba(255,255,255,.35); }
.fpb { background:rgba(255,255,255,.12); border-radius:3px; padding:.2rem .5rem; font-size:.58rem; color:rgba(255,255,255,.6); font-weight:600; }
`;