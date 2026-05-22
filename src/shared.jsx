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
  { name: "Black closet", logo: "/bb.jpg", href: "/brand/blackcloset" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Kids", href: "/kids" },
  { label: "About Us", href: "/aboutus" },
  { label: "Sell with us", href: "/seller" },
  { label: "Build an Outfit", href: "/BuildOutfit" },
  { label: "Brands", href: "#", dropdown: true },
];

// ─── SHUFFLE UTILITY ───
export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const FOOTER_COLS = [
  { title: "Shop", links: [["Women", "/women"], ["Men", "/men"], ["Kids", "/kids"]] },
  { title: "Sell With Us", links: [["Sign Up", "/seller"], ["How It Works", "/seller"], ["Seller Support", "#"]] },
  { title: "Discover", links: [["New Arrivals", "/women/new-arrivals"], ["Build Outfit", "/buildoutfit"], ["Trending", "/trending"]] },
  { title: "Contact Us", links: [["Contact Us", "/contactus"], ["About Us", "/aboutus"], ["Instagram", "#"], ["Facebook", "./https://www.facebook.com/profile.php?id=61584765721087"]] },
];

export const PRODUCTS = [
  { id: 1, tab: "best", gender: "men", name: "Marble Stripes", brand: "MARBLE", price: "LE 700", oldPrice: "LE 1,100", img: "/mar.jpg", imgs: ["/other.jpg", "/other2.jpg"], colors: ["#1a1a2e"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.8, reviews: 124, desc: "Bold-stripe tee, 100% Egyptian cotton." },
  { id: 2, tab: "best", name: "Red Alfenat Hoodie Kids", brand: "Antikka", category: "boys", type: "tops", price: "LE 920", oldPrice: "LE 1,800", img: "/red.jpg", imgs: ["/othe3.jpg"], colors: ["#e63946", "#fff"], sizes: ["6Y", "8Y", "10Y"], rating: 4.9, reviews: 20, desc: "Cozy fleece hoodie, perfect for kids." },
  { id: 3, tab: "best", gender: "men", name: "Cream Knitted Zipper", brand: "Antikka", price: "LE 750", oldPrice: "LE 870", img: "/zip.jpg", imgs: ["/a1.jpg", "/a2.jpg"], colors: ["#c2c6c8ff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 56, desc: "Knitted quarter zipper perfect for women and men." },
  { id: 4, tab: "best", gender: "women", type: "tops", name: "27 Pink Sweater", brand: "27", img3d: "no1.jpg", price: "LE 750", oldPrice: "LE 950", img: "/pink27.jpg", imgs: ["/b2.jpg", "/chart.jpg"], colors: ["#f4a0b5"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 203, desc: "100% cotton, Boxy fit, dreamy blush pink." },
  { id: 5, tab: "best", gender: "unisex", type: "tops", name: "Printed Oversized Hoodie", brand: "Marble", price: "LE 690", oldPrice: "LE 860", img: "/green.jpg", imgs: ["/b3.jpg", "/b4.jpg"], colors: ["#445c35ff"], sizes: ["M", "L", "XL"], rating: 4.9, reviews: 78, desc: "Printed Oversized Hoodie brings bold streetwear energy, 98% cotton.", desc2: "Featuring a front 'The Marble Club' graphic, kangaroo pocket, and an oversized fit." },
  { id: 6, tab: "best", gender: "men", name: "Studio Zip-up", brand: "Salty", type: "jackets", price: "LE 600", oldPrice: "LE 870", img: "/saltyhood.jpg", colors: ["#1a1a18"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Premium Fit Zip-up. Male Model Height 185cm wearing size L." },
  { id: 15, tab: "new", name: "Bored Kids T-Shirt", brand: "NINOS", category: "girls", type: "tops", price: "LE 450", oldPrice: null, img: "/kid.jpg", colors: ["#b4b8acff", "#fff"], sizes: ["10Y", "12Y", "14Y", "16Y"], rating: 4.7, reviews: 12, desc: "Bored T-Shirt, perfect addition to your casual wardrobe. Made from soft and comfortable fabric." },
  { id: 16, tab: "new", gender: "unisex", type: "tops", name: "Navy 27 Zip Up", brand: "27", price: "LE 790", oldPrice: "LE 1,100", img: "/270.jpg", colors: ["#111c3eff"], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 8, desc: "Ultra-soft oversized zip-up." },
  { id: 17, tab: "new", gender: "men", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 850", oldPrice: "LE 1,000", img: "/yem.jpg", imgs: ["/c1.jpg", "/c2.jpg"], colors: ["#f3f3eeff"], sizes: ["S", "M", "L", "XL"], rating: 4.6, reviews: 21, desc: "Oversized hoodie in sweatshirt fabric, cotton blend with soft brushed inside." },
  { id: 18, tab: "new", gender: "unisex", type: "tops", name: "The Nefertiti Hoodie", brand: "Antikka", price: "LE 920", oldPrice: null, img: "/aob.jpg", imgs: ["/d1.jpg", "/d2.jpg"], colors: ["#3d3b3cff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 6, desc: "The Charcoal Nefertiti Hoodie, 90% cotton. Oversized fit - Unisex." },
  { id: 19, tab: "new", gender: "unisex", type: "tops", name: "Orange Oversized Tee", brand: "Antikka", price: "LE 650", oldPrice: null, img: "/antsh.jpg", imgs: ["/e1.jpg", "/e2.jpg", "/e3.jpg"], colors: ["#d98036ff"], sizes: ["XS", "S", "M", "L"], rating: 4.5, reviews: 15, desc: "Antikka orange oversized tee, 100% cotton." },
  { id: 20, tab: "new", name: "SWD Kids Jeans Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 850", oldPrice: null, img: "/boyn.jpg", imgs: ["/f1.jpg", "/f2.jpg"], colors: ["#3779c8ff"], sizes: ["8Y", "9Y", "10Y", "11Y", "12Y"], rating: 4.7, reviews: 31, desc: "Stylish SWD Jeans Jacket, high-quality materials for comfort and style." },
  { id: 22, tab: "sale", gender: "unisex", type: "pants", name: "Basic Sweatpants", brand: "27", img3d: "pant1.jpg", price: "LE 690", oldPrice: "LE 900", img: "/pant.jpg", colors: ["#b2aa9cff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 54, desc: "Beige Basic Sweatpants." },
  { id: 23, tab: "sale", name: "Kids Puffer Jacket", brand: "NINOS", category: "boys", type: "jackets", price: "LE 900", oldPrice: "LE 1,400", img: "/puff.jpg", imgs: ["/h1.jpg"], colors: ["#d1bcaaff"], sizes: ["8Y", "10Y", "12Y"], rating: 4.3, reviews: 42, desc: "Stay warm with our Off-White Puffer Jacket." },
  { id: 24, tab: "sale", gender: "men", name: "Slt line T-shirt", brand: "Salty", type: "tops", price: "LE 350", oldPrice: "LE 400", img: "/20.jpg", colors: ["#b8b0a8", "#1a1a18"], sizes: ["S", "M", "L"], rating: 4.7, reviews: 67, desc: "Salty Studios t shirt, suited for both men and women." },
  { id: 25, tab: "sale", name: "Kids Cutting Pullover", brand: "NINOS", category: "girls", type: "tops", price: "LE 500", oldPrice: "LE 750", img: "/kido.jpg", colors: ["#e8e2e6ff"], sizes: ["6Y", "8Y", "10Y", "12Y", "14Y"], rating: 4.5, reviews: 39, desc: "Cutting Pullover, soft knit fabric, comfortable and flattering fit." },
  { id: 7, tab: "trend", gender: "men", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 800", oldPrice: "LE 980", img: "/trend.jpg", imgs: ["/i2.jpg"], colors: ["#ffffffff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 44, desc: "White Stop Trying To Be Perfect Printed Oversized Hoodie, 98% cotton melton fabric." },
  { id: 8, tab: "trend", gender: "men", name: "Trouble Sweatpants", brand: "27", price: "LE 690", oldPrice: "LE 900", img: "/29.jpg", colors: ["#473635ff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 62, desc: "Navy edition, tailored fit." },
  { id: 9, tab: "trend", gender: "women", type: "tops", name: "Yellow 27 Sweater", brand: "27", price: "LE 600", oldPrice: "LE 890", img: "/0027.jpg", colors: ["#d0c259ff"], sizes: ["S", "M", "L", "XL"], rating: 4.6, reviews: 38, desc: "Yellow 27 sweater." },
  { id: 10, tab: "trend", gender: "unisex", type: "tops", name: "Printed Oversized Hoodie", brand: "MARBLE", price: "LE 600", oldPrice: "LE 900", img: "/hi.jpg", imgs: ["/j1.jpg", "/j2.jpg", "/j3.jpg"], colors: ["#e9ace1ff"], sizes: ["XS", "S", "M", "L"], rating: 4.9, reviews: 91, desc: "Pink Are You Serious? Printed Oversized Hoodie, 98% cotton melton.", desc2: "Material: 98% Cotton, 2% Polyester (Melton)." },
  { id: 28, tab: "trend", name: "Kids Striped Sweatshirt", brand: "NINOS", category: "boys", type: "tops", price: "LE 725", oldPrice: "LE 890", img: "/strip.jpg", colors: ["#b1b7c0ff"], sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"], rating: 4.8, reviews: 47, desc: "Striped Sweatshirt in Navy or Off-White, sizes 4 to 14." },
  { id: 11, tab: "picks", gender: "men", name: "SVN27 Hoodie", brand: "27", price: "LE 840", oldPrice: null, img: "/new.jpg", imgs: ["/k1.jpg"], colors: ["#3440afff"], sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 55, desc: "The 27 Hoodie." },
  { id: 12, tab: "picks", gender: "women", type: "tops", name: "Black Boxy Set", brand: "MARBLE", price: "LE 1,050", oldPrice: null, img: "/set.jpg", imgs: ["/k4.jpg", "/k5.jpg"], colors: ["#000000ff"], sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 43, desc: "Black Boxy Embroidered Set, 98% cotton melton, structured boxy fit." },
  { id: 13, tab: "picks", name: "Kids Smile Sweatshirt", brand: "NINOS", category: "boys", type: "tops", price: "LE 700", oldPrice: null, img: "/kid6.jpg", colors: ["#e1d7baff"], sizes: ["8Y", "10Y", "12Y", "14Y"], rating: 4.6, reviews: 38, desc: "Smile Sweatshirt in soft cozy fabric, perfect for chilly days." },
  { id: 14, tab: "picks", gender: "women", type: "tops", name: "Printed ARI Sweatshirt", brand: "MARBLE", price: "LE 700", oldPrice: null, img: "/ari.jpg", colors: ["#28462dff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 72, desc: "ARIZONA 1981 print sweatshirt, retro college style in an oversized fit." },
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
  { id: 45, gender: "unisex", name: "Culture Tshirt", brand: "Salty", type: "tops", price: "LE 400", oldPrice: "LE 500", img: "/45.jpg", colors: ["#392420ff", "#4a4a48"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Culture T-Shirt represents the mindset behind Salty." },
  { id: 46, gender: "unisex", name: "Signature line Tshirt", brand: "Salty", type: "tops", price: "LE 400", oldPrice: "LE 500", img: "/46.jpg", colors: ["#d4d4d0ff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Signature T-Shirt, built on a clean oversized silhouette." },
  { id: 47, gender: "unisex", name: "Mercer Tshirt", brand: "Salty", type: "tops", price: "LE 600", img: "/47.jpg", colors: ["#0c361dff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Crafted from a textured, breathable fabric." },
  { id: 48, gender: "unisex", name: "Ocean Swim Tshirt", brand: "Salty", type: "tops", price: "LE 600", img: "/48.jpg", imgs: ["/saltychart2.jpg"], colors: ["#28479cff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Ocean Swim T-Shirt, inspired by long days under the sun." },
  { id: 49, gender: "unisex", name: "Chilli Babytee", brand: "Salty", type: "tops", price: "LE 300", img: "/49.jpg", colors: ["#28479cff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "Crafted from soft stretch fabric." },
  { id: 50, gender: "unisex", name: "Origin Tshirt", brand: "Salty", type: "tops", price: "LE 500", img: "/50.jpg", colors: ["#9398a5ff"], sizes: ["S", "M", "L", "XL"], rating: 4.5, reviews: 167, desc: "The Origin T-Shirt, a clean oversized silhouette." },
  { id: 51, gender: "men", name: "Black Athletic Hoodie", brand: "MARBLE", img3d: "51.jpg", price: "LE 750", oldPrice: "LE 950", img: "/510.jpg", colors: ["#131212ff"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 203, desc: "100% cotton, Boxy fit, Black hood." },






  { id:100,    gender:"men", name:"Gray shorts",          brand:"27",  img3d:"pant1.jpg"  ,      price:"LE 750",   oldPrice:"LE 950",   img:"/pant1.jpg",        colors:["#6d6668ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203, desc:"100% cotton short" },
  { id:101,    gender:"women", name:"Dark Blue oversized T-shirt",          brand:"marble",  img3d:"182.jpg"  ,      price:"LE 600",   oldPrice:"LE 950",   img:"/181.jpg",        colors:["#26305aff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203, desc:"Printed Dark Blue oversized t-shirt 100% cotton" },
  { id:102,    gender:"women", name:"Printed oversized hoodie",          brand:"marble",  img3d:"blackhood2.jpg"  ,      price:"LE 600",   oldPrice:"LE 950",   img:"/bb9.jpg",        colors:["#161717ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203, desc:"Printed Black printed oversized hoodie" },
  { id:103,    gender:"unisex", name:"Blue jeans",          brand:"27",  img3d:"nojean.jpg"  ,      price:"LE 600",   oldPrice:"LE 950",   img:"/jean1.jpg",        colors:["#365a99ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:104,    gender:"men", name:"Black bagy jeans",          brand:"salty",  img3d:"bagyjean2.jpg"  ,      price:"LE 600",   oldPrice:"LE 950",   img:"/bagyjean1.jpg",        colors:["#2b2d31ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:105,    gender:"men", name:"Grey bagy jeans",          brand:"salty",  img3d:"grayjean1.jpg"  ,      price:"LE 600",   oldPrice:"LE 950",   img:"/grayjean.jpg",        colors:["#2b2d31ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:106,    gender:"unisex", name:" Straight leg jeans",          brand:"marble",  img3d:"bluy2.jpg"  ,      price:"LE 690",   oldPrice:"LE 950",   img:"/bluy.jpg",        colors:["#2b2d31ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:107,    gender:"women", name:" Pink Peanuts hockey T-shirt",          brand:"27",  img3d:"pea1.jpg"  ,      price:"LE 560",   oldPrice:"LE 650",   img:"/pea.jpg",        colors:["#d4b5deff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:108,    gender:"women", name:" Long sleeve boxy-fit T-shirt",          brand:"27",  img3d:"strips2.jpg"  ,      price:"LE 460",   oldPrice:"LE 650",   img:"/strips.jpg",        colors:["#d8d8d8ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:109,    gender:"men", name:"  Graffiti T-shirt",          brand:"salty",  img3d:"stay2.jpg"  ,      price:"LE 550",   oldPrice:"LE 650",   img:"/stay.jpg",        colors:["#060505ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:110,    gender:"women", name:"  Chenille hooded jumper",          brand:"salty",  img3d:"jump1.jpg"  ,      price:"LE 850",   oldPrice:"LE 950",   img:"/jump.jpg",        colors:["#eff3dfff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:111,    gender:"men", name:"  Ford zip-up hoodie",          brand:"marble",  img3d:"ford1.jpg"  ,      price:"LE 950",   oldPrice:"LE 1,050",   img:"/ford.jpg",        colors:["#9d9d9dff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:112,    gender:"men", name:"  Star knit T-shirt",          brand:"Salty",  img3d:"star1.jpg"  ,      price:"LE 850",   oldPrice:"LE 1,050",   img:"/star.jpg",        colors:["#473232ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:113,    gender:"unisex", name:" Ripped blue jeans ",          brand:"27",  img3d:"ripped1.jpg"  ,      price:"LE 750",   oldPrice:"LE 850",   img:"/ripped.jpg",        colors:["#357a97ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:114,    gender:"unisex", name:" PIVOT SWEATPANTS",          brand:"27",  img3d:"oh.jpg"  ,      price:"LE 550",   oldPrice:"LE 650",   img:"/oh2.jpg",        colors:["#95999aff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:115,    gender:"men", name:" STWD graphic T-shirt",          brand:"marble",  img3d:"st1.jpg"  ,      price:"LE 850",   oldPrice:"LE 950",   img:"/st.jpg",        colors:["#1d5562ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },
  { id:116,    gender:"women", name:" Sheer blouse with ruffle",          brand:"anitka",  img3d:"sheer.jpg"  ,      price:"LE 850",   oldPrice:"LE 950",   img:"/sheer2.jpg",        colors:["#1d5562ff"],              sizes:["XS","S","M","L","XL"],  rating:4.6, reviews:203 },












];
















export const CATS = [
  { name: "MEN", img: "/boy2.png", link: "/men", gradient: "145deg,#8a9a7a,#4a5c40" },
  { name: "WOMEN", img: "/girl.png", link: "/women", gradient: "145deg,#c4b8a8,#8a7868" },
  { name: "KIDS", img: "/baby.jpg", link: "/kids", gradient: "145deg,#6b8aad,#3a5878" },
];

const API_BASE = "https://stylehub-backend-tau.vercel.app/api";

// ─── SEARCH DRAWER — slides in from right ───
function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.trim().toLowerCase();
    const timer = setTimeout(() => {
      setSearching(true);

      // Search hardcoded PRODUCTS locally
      const localMatches = PRODUCTS
        .filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.type || "").toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q))
        .slice(0, 8)
        .map(p => ({
          _id: String(p.id),
          name: p.name,
          price: parseInt((p.price || "0").replace(/[^0-9]/g, ""), 10),
          images: p.img ? [p.img] : [],
          seller: { brandName: p.brand },
          _source: "local",
        }));

      // Also search backend
      fetch(`${API_BASE}/products?search=${encodeURIComponent(q)}&limit=8`)
        .then(r => r.json())
        .then(data => {
          const backendResults = (data.data?.products || [])
            .filter(p => p.seller?.brandName)
            .map(p => ({ ...p, _source: "backend" }));

          // Merge: backend first, then local, deduplicate by name
          const seen = new Set(backendResults.map(p => p.name.toLowerCase()));
          const merged = [
            ...backendResults,
            ...localMatches.filter(p => !seen.has(p.name.toLowerCase())),
          ].slice(0, 10);
          setResults(merged);
        })
        .catch(() => setResults(localMatches))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <>
      <style>{`.sr-input::placeholder{color:#b0a89a;} .sr-input{outline:none;}`}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(10,10,8,0.38)", backdropFilter: "blur(2px)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s ease" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9999, width: "min(400px, 90vw)", background: "#fff", boxShadow: "-6px 0 32px rgba(0,0,0,.1)", display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .32s cubic-bezier(.22,.61,.36,1)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.3rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--dark)" }}>Search</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)", padding: 4 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".7rem", background: "var(--cream)", border: "1px solid var(--border)", padding: ".7rem .95rem" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--warm)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input ref={inputRef} className="sr-input" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products, brands…" style={{ flex: 1, background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: ".85rem", color: "var(--dark)" }} />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--warm)", padding: 0 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></button>}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {searching && <div style={{ padding: "1rem 1.5rem", fontSize: ".75rem", color: "var(--warm)" }}>Searching...</div>}
          {!searching && results.length > 0 && results.map(p => (
            <div key={p._id} onClick={() => { navigate(`/product/${p._id}`); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".75rem 1.5rem", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <div style={{ width: 48, height: 56, background: "#f0ece6", flexShrink: 0, overflow: "hidden", borderRadius: 6 }}>
                {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: ".8rem", fontWeight: 500, color: "var(--dark)" }}>{p.name}</div>
                <div style={{ fontSize: ".62rem", color: "var(--warm)", marginTop: ".1rem" }}>{p.seller?.brandName}</div>
              </div>
              <div style={{ fontSize: ".75rem", fontWeight: 600 }}>LE {(p.price)?.toLocaleString()}</div>
            </div>
          ))}
          {!searching && query.trim() && results.length === 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", gap: "1rem" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <p style={{ margin: 0, fontSize: ".78rem", color: "var(--warm)", textAlign: "center" }}>No results for "{query}"</p>
            </div>
          )}
          {!query && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", gap: "1rem" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <p style={{ margin: 0, fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--warm)", textAlign: "center" }}>What are you looking for?</p>
            </div>
          )}
        </div>
        <div style={{ padding: ".9rem 1.5rem", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <span style={{ fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#c0b8b0" }}>Press <strong>ESC</strong> or click outside to close</span>
        </div>
      </div>
    </>
  );
}

// ─── NAV ───
export function SHNav({ cart = [], wish = [] }) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sh-nav sticky-top d-flex align-items-center justify-content-between px-4" style={{ position: "relative" }}>
      <a href="/" style={{ textDecoration: "none" }}>
        <img src="/logo.jpg" alt="StyleHub" style={{ height: "53px", objectFit: "contain" }}
          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "inline"; }} />
        <span style={{ display: "none", fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 600, color: "var(--dark)" }}>SH</span>
      </a>
      <ul className="d-none d-lg-flex gap-4 list-unstyled mb-0">
        {NAV_LINKS.map(l => (
          <li key={l.label} className="nav-item d-flex align-items-center">
            <a href={l.href} style={{ color: "var(--dark)", textDecoration: "none", fontSize: ".84rem", letterSpacing: ".04em" }}>
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
        <button onClick={() => setSearchOpen(true)} className="nav-icon" style={{ background: "none", border: "none", padding: 0 }}>{I.search}</button>
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
        <Link to={localStorage.getItem("token") ? "/profile" : "/signin"} className="nav-icon">{I.user}</Link>
        <Link to="/wishlist" className="nav-icon">
          <Heart on={false} />
          {wish.length > 0 && <span className="sh-badge">{wish.length}</span>}
        </Link>
        <Link to="/cart" className="nav-icon">
          {I.cart}
          {cart.length > 0 && <span className="sh-badge">{cart.reduce((s, x) => s + x.qty, 0)}</span>}
        </Link>
        {/* Hamburger */}
        <button className="d-lg-none nav-icon" onClick={() => setMenuOpen(m => !m)} style={{ background: "none", border: "none", padding: 0, flexDirection: "column", gap: 5 }}>
          <span style={{ display: "block", width: 22, height: 2, background: "var(--dark)", transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px,5px)" : "none" }} />
          <span style={{ display: "block", width: 22, height: 2, background: "var(--dark)", transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 22, height: 2, background: "var(--dark)", transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px,-5px)" : "none" }} />
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: "absolute", top: "56px", left: 0, right: 0, background: "#fff", borderTop: "1px solid var(--border)", zIndex: 999, padding: "1rem 1.5rem", boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
          {NAV_LINKS.map(l => (
            <div key={l.label}>
              <a href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: ".6rem 0", color: "var(--dark)", textDecoration: "none", fontSize: ".85rem", letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
                {l.label}
              </a>
              {l.dropdown && (
                <div style={{ paddingLeft: "1rem" }}>
                  {BRANDS.map(b => (
                    <a key={b.name} href={b.href || "#"} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: ".45rem 0", color: "var(--warm)", textDecoration: "none", fontSize: ".78rem" }}>
                      {b.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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

/* ══════════════════════════════════════════
   CSS VARIABLES (Design Tokens)
   Used everywhere via var(--name)
══════════════════════════════════════════ */
:root {
  --cream: #F8F6F2;
  --dark:  #1a1a18;
  --sage:  #92A079;
  --deep:  #728060;
  --warm:  #8c8880;
  --border:#e4e0da;
  --gold:  #c8a96e;
  --red:   #e63946;
}

/* ══════════════════════════════════════════
   BASE / RESET
   Sets font and background for the whole app
══════════════════════════════════════════ */
*, *::before, *::after {
  box-sizing: border-box; /* prevents elements from overflowing their containers */
}

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--cream);
  color: var(--dark);
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* prevents horizontal scroll on mobile */
}

img {
  max-width: 100%; /* all images shrink to fit their container on small screens */
  height: auto;
  display: block;
}

/* ══════════════════════════════════════════
   NAVIGATION BAR
   Bootstrap 3 breakpoint: collapses below 768px (xs/sm)
══════════════════════════════════════════ */
.sh-nav {
  background: #fff;
  border-bottom: 1px solid var(--border);
  height: 56px;
  padding: 0 1.5rem; /* default padding for medium+ screens */
  z-index: 1000;
}

/* Tighter nav padding on phones (Bootstrap xs: <768px) */
@media (max-width: 767px) {
  .sh-nav {
    padding: 0 .75rem; /* less side padding so logo and icons don't crowd */
    height: 50px;
  }
}

/* Nav links — hidden on xs/sm, shown on lg via Bootstrap d-none d-lg-flex */
.sh-nav a {
  color: var(--dark);
  text-decoration: none;
  font-size: .73rem;
  letter-spacing: .04em;
  transition: color .2s;
  position: relative;
  padding-bottom: 3px;
}

/* Animated underline on nav links */
.sh-nav a::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 1.6px;
  background: var(--sage);
  transition: width .25s;
}
.sh-nav a:hover { color: var(--sage); }
.sh-nav a:hover::after { width: 100%; }

/* Cart / wish badge */
.sh-badge {
  background: var(--sage);
  color: #fff;
  font-size: .5rem;
  width: 14px; height: 14px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700;
  position: absolute;
  top: -6px; right: -8px;
}

/* Icon buttons in nav */
.nav-icon {
  color: var(--dark);
  display: flex; align-items: center;
  position: relative;
  transition: color .2s;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
}
.nav-icon:hover { color: var(--sage); }

/* Brands dropdown — appears on hover */
.nav-item { position: relative; }
.nav-item:hover .dropdown {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}
.dropdown {
  position: absolute;
  top: 100%; left: 0;
  background: #fff;
  border: 1px solid var(--border);
  min-width: 160px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: all .25s;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}
.dropdown a {
  display: block;
  padding: .6rem 1.2rem;
  font-size: .72rem;
  color: var(--dark);
  text-decoration: none;
  letter-spacing: .04em;
  transition: background .2s;
}
.dropdown a:hover {
  background: var(--cream);
  color: var(--sage);
}

/* ══════════════════════════════════════════
   SCROLL REVEAL ANIMATION
   Bootstrap 3 grid columns use these classes
   .reveal = hidden, .revealed = visible
   .d1–d4 = staggered delays for grid items
══════════════════════════════════════════ */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .7s, transform .7s;
}
.revealed {
  opacity: 1;
  transform: none;
}

/* Stagger delays — used on grid cols like col-md-4 d1, d2, d3 */
.d1 { transition-delay: .1s; }
.d2 { transition-delay: .2s; }
.d3 { transition-delay: .3s; }
.d4 { transition-delay: .4s; }

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .reveal, .revealed {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

/* ══════════════════════════════════════════
   FOOTER
   Bootstrap 3 grid: row + col-md-* + col-xs-6
   Stacks to single column on phones
══════════════════════════════════════════ */
.sh-foot {
  background: var(--deep);
  color: rgba(255,255,255,.8);
  padding: 3rem 1.5rem 1.5rem; /* default padding */
}

/* Less padding on phones */
@media (max-width: 767px) {
  .sh-foot {
    padding: 2rem 1rem 1rem;
  }
}

.f-logo-txt {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
}

/* Footer tagline */
.f-about {
  font-size: .78rem;
  line-height: 1.7;
  color: rgba(255,255,255,.55);
  max-width: 280px; /* keeps line length readable on wide screens */
}

/* Social icon circles */
.f-soc {
  width: 30px; height: 30px;
  border: 1px solid rgba(255,255,255,.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: .65rem;
  color: rgba(255,255,255,.6);
  text-decoration: none;
  transition: all .2s;
}
.f-soc:hover {
  background: rgba(255,255,255,.15);
  color: #fff;
}

/* Footer column titles */
.f-col-title {
  font-size: .64rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: rgba(255,255,255,.45);
  font-weight: 500;
  margin-bottom: .75rem;
}

/* Footer column links */
.f-col a {
  display: block;
  font-size: .78rem;
  color: rgba(255,255,255,.7);
  text-decoration: none;
  transition: all .2s;
  margin-bottom: .4rem;
}
.f-col a:hover { color: #fff; }
.sh-foot a {
  color: rgba(255,255,255,.7);
  text-decoration: none;
}
.sh-foot a:hover { color: #fff; }

/* Copyright row */
.f-copy {
  font-size: .7rem;
  color: rgba(255,255,255,.35);
}

/* Payment badges — VISA / FAWRY / CASH */
.fpb {
  background: rgba(255,255,255,.12);
  border-radius: 3px;
  padding: .2rem .5rem;
  font-size: .58rem;
  color: rgba(255,255,255,.6);
  font-weight: 600;
}

/* ══════════════════════════════════════════
   SEARCH DRAWER
   Slides in from right, full height
   On phones: takes 90vw width
══════════════════════════════════════════ */
.sr-input::placeholder { color: #b0a89a; }
.sr-input { outline: none; }

/* ══════════════════════════════════════════
   TYPOGRAPHY — RESPONSIVE FONT SIZES
   clamp(min, preferred, max) scales smoothly
   Works across Bootstrap 3 breakpoints
══════════════════════════════════════════ */

/* Page-level headings — serif, scales from mobile to desktop */
h1, .h1-display {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.8rem, 5vw, 3.6rem); /* 1.8rem on phones, up to 3.6rem on desktops */
  font-weight: 600;
  line-height: 1.1;
}

h2, .h2-display {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 600;
}

/* Section subtitles */
.section-sub {
  font-size: clamp(.8rem, 1.5vw, .95rem);
  color: var(--warm);
  line-height: 1.7;
}

/* ══════════════════════════════════════════
   PRODUCT CARDS — SHARED RESPONSIVE RULES
   Used in Women, Men, Kids pages
   Bootstrap 3: col-xs-6 col-sm-4 col-md-3
══════════════════════════════════════════ */

/* Card image wrapper keeps aspect ratio on all screen sizes */
.sh-card-img {
  position: relative;
  overflow: hidden;
  border-radius: 3px;
  aspect-ratio: 3/4;
  background: var(--cream);
}
.sh-card-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .5s;
}

/* Hover zoom — disabled on touch devices to avoid sticky hover */
@media (hover: hover) {
  .sh-card:hover .sh-card-img img {
    transform: scale(1.06);
  }
}

/* Card info below image */
.sh-card-info {
  padding: 8px 0 4px;
}
.sh-card-brand {
  font-size: .68rem;
  color: var(--warm);
  letter-spacing: .06em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.sh-card-name {
  font-size: .82rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* truncates long names with ... */
}
.sh-card-price {
  font-size: .88rem;
  font-weight: 600;
}
.sh-card-old {
  font-size: .72rem;
  color: var(--warm);
  text-decoration: line-through;
  margin-left: 6px;
}

/* ══════════════════════════════════════════
   HERO SECTION — RESPONSIVE
   Bootstrap 3 xs (<768px): stacks vertically
   Bootstrap 3 md (≥992px): side by side
══════════════════════════════════════════ */
.sh-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 7%;
  gap: 32px;
  min-height: 520px;
}

/* Tablet (Bootstrap sm: 768px–991px) */
@media (max-width: 991px) {
  .sh-hero {
    padding: 40px 5%;
    min-height: 420px;
    gap: 24px;
  }
}

/* Phone (Bootstrap xs: <768px) — stack text above image */
@media (max-width: 767px) {
  .sh-hero {
    flex-direction: column;      /* stacks text then image */
    padding: 32px 1rem 24px;
    min-height: unset;
    text-align: center;
    gap: 20px;
  }
  .sh-hero-img {
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
  }
  .sh-hero-txt {
    max-width: 100%; /* full width on phones */
  }
  /* Center the CTA buttons on mobile */
  .sh-hero-btns {
    justify-content: center !important;
  }
}

/* ══════════════════════════════════════════
   HORIZONTAL SCROLL TRACK (New Arrivals)
   On phones: cards shrink to 160px wide
   On tablets: 190px
   On desktops: 220px
══════════════════════════════════════════ */
.sh-scroll-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch; /* smooth momentum scrolling on iOS */
}
.sh-scroll-track::-webkit-scrollbar { display: none; } /* hide scrollbar */

/* Default card width for desktop */
.sh-scroll-card {
  flex: 0 0 220px;
  scroll-snap-align: start;
}

/* Tablet */
@media (max-width: 991px) {
  .sh-scroll-card { flex: 0 0 190px; }
}

/* Phone */
@media (max-width: 767px) {
  .sh-scroll-card { flex: 0 0 160px; }
  .sh-scroll-track { gap: 12px; }
}

/* ══════════════════════════════════════════
   SECTION LAYOUT — SHARED
   .sh-section used on every page section
══════════════════════════════════════════ */
.sh-section {
  padding: 60px 0;
}

/* Less vertical spacing on phones */
@media (max-width: 767px) {
  .sh-section { padding: 36px 0; }
}

/* Section title + decorative line */
.sh-sec-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 600;
  text-align: center;
  color: var(--dark);
  margin-bottom: 6px;
}
.sh-sec-line {
  width: 44px; height: 2px;
  background: var(--sage);
  margin: 0 auto 32px;
}

/* ══════════════════════════════════════════
   PRODUCT GRID — RESPONSIVE
   Bootstrap 3 approach: uses CSS grid with
   responsive column counts matching Bootstrap
   breakpoints exactly
══════════════════════════════════════════ */

/* 4 columns on large desktops (Bootstrap lg: ≥1200px) */
.sh-grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* 3 columns → 2 columns → 1 column */
.sh-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Medium devices (Bootstrap md: 992px–1199px) */
@media (max-width: 1199px) {
  .sh-grid-4 { grid-template-columns: repeat(3, 1fr); }
}

/* Small devices / tablets (Bootstrap sm: 768px–991px) */
@media (max-width: 991px) {
  .sh-grid-4 { grid-template-columns: repeat(2, 1fr); }
  .sh-grid-3 { grid-template-columns: repeat(2, 1fr); }
}

/* Extra small / phones (Bootstrap xs: <768px) */
@media (max-width: 767px) {
  .sh-grid-4 { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sh-grid-3 { grid-template-columns: repeat(2, 1fr); gap: 12px; }
}

/* Very small phones (<480px) — single column */
@media (max-width: 479px) {
  .sh-grid-4 { grid-template-columns: 1fr; }
  .sh-grid-3 { grid-template-columns: 1fr; }
}

/* ══════════════════════════════════════════
   ALL PRODUCTS SIDEBAR + GRID LAYOUT
   Bootstrap 3 approach:
   - Desktop: sidebar left (185px) + grid right (flex:1)
   - Tablet: sidebar collapses to horizontal filter bar
   - Phone: sidebar hidden behind a toggle button
══════════════════════════════════════════ */
.sh-filter-layout {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
}

/* Sidebar sticky on desktop */
.sh-sidebar {
  width: 185px;
  flex-shrink: 0;
  position: sticky;
  top: 70px; /* below nav height */
}

/* Tablet (Bootstrap sm: 768px–991px) — sidebar goes on top as a row */
@media (max-width: 991px) {
  .sh-filter-layout {
    flex-direction: column;
    gap: 1.5rem;
  }
  .sh-sidebar {
    width: 100%; /* full width on tablet */
    position: static; /* no longer sticky */
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
  }
}

/* Phone (Bootstrap xs: <768px) */
@media (max-width: 767px) {
  .sh-sidebar {
    gap: .75rem;
  }
  /* Each filter group takes half width on phones */
  .sh-filter-group {
    flex: 0 0 calc(50% - .5rem);
  }
}

/* ══════════════════════════════════════════
   SALE BANNER
   Bootstrap 3 xs: stacks image above text
   Bootstrap 3 sm+: side by side
══════════════════════════════════════════ */
.sh-sale-banner {
  display: flex;
  min-height: 260px;
}
.sh-sale-banner-img {
  width: 55%;
  object-fit: cover;
}
.sh-sale-banner-text {
  flex: 1;
  background: var(--dark);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 5%;
}
.sh-sale-banner-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  font-weight: 600;
  margin-bottom: 20px;
  line-height: 1.15;
}

/* Phone — stack image above text */
@media (max-width: 767px) {
  .sh-sale-banner { flex-direction: column; }
  .sh-sale-banner-img {
    width: 100%;
    height: 200px;
  }
  .sh-sale-banner-text {
    padding: 24px 1.2rem;
  }
}

/* ══════════════════════════════════════════
   QUICK VIEW MODAL — RESPONSIVE
   Bootstrap 3 xs: stacks image above details
   Bootstrap 3 sm+: side by side layout
══════════════════════════════════════════ */
.sh-modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(26,26,24,.55);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px; /* padding so modal never touches screen edges on phones */
  animation: shFadeIn .2s ease;
}
@keyframes shFadeIn { from{opacity:0} to{opacity:1} }

.sh-modal {
  background: #fff;
  max-width: 760px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  max-height: 90vh;
  animation: shSlideUp .3s ease;
}
@keyframes shSlideUp {
  from{opacity:0; transform:translateY(24px)}
  to{opacity:1; transform:none}
}

/* Tablet (Bootstrap sm: <768px) — modal goes full width, stacks */
@media (max-width: 767px) {
  .sh-modal {
    flex-direction: column; /* image on top, details below */
    max-height: 95vh;
    overflow-y: auto;
  }
  .sh-modal-img {
    width: 100% !important; /* overrides inline width: 46% */
    height: 260px;
    object-fit: cover;
  }
  .sh-modal-body {
    padding: 20px 16px !important; /* tighter padding on phone */
  }
}

/* ══════════════════════════════════════════
   CATEGORY CARDS
   Bootstrap 3: col-xs-12 col-sm-4
   On phone: full width stacked
══════════════════════════════════════════ */
.sh-cat-card {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  aspect-ratio: 4/4;
}
.sh-cat-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .5s;
}
@media (hover: hover) {
  .sh-cat-card:hover img { transform: scale(1.07); }
}
.sh-cat-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(26,26,24,.75) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

/* On phones, category cards are shorter */
@media (max-width: 767px) {
  .sh-cat-card { aspect-ratio: 4/3; }
}

/* ══════════════════════════════════════════
   TOAST NOTIFICATION
   Fixed at bottom, always centered
   Works on all screen sizes
══════════════════════════════════════════ */
.sh-toast {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--dark);
  color: #fff;
  padding: .55rem 1.4rem;
  border-radius: 30px;
  font-size: .78rem;
  letter-spacing: .06em;
  pointer-events: none;
  opacity: 0;
  transition: all .3s;
  z-index: 1100;
  white-space: nowrap;

  /* On phones toast shouldn't be too wide */
  max-width: calc(100vw - 2rem);
  white-space: normal;
  text-align: center;
}
.sh-toast.on {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ══════════════════════════════════════════
   PAGINATION
   Bootstrap 3 xs: smaller buttons on phones
══════════════════════════════════════════ */
.sh-pagination {
  display: flex;
  justify-content: center;
  gap: .45rem;
  padding: 2.5rem 0;
  flex-wrap: wrap; /* wraps to next line on very small screens */
}
.sh-page-btn {
  width: 34px; height: 34px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: none;
  cursor: pointer;
  font-size: .75rem;
  font-weight: 400;
  transition: all .2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sh-page-btn.active {
  background: var(--dark);
  color: #fff;
  border-color: var(--dark);
  font-weight: 600;
}
.sh-page-btn:disabled {
  opacity: .4;
  cursor: not-allowed;
}

/* Smaller pagination on phones */
@media (max-width: 767px) {
  .sh-page-btn { width: 30px; height: 30px; font-size: .68rem; }
}

/* ══════════════════════════════════════════
   UTILITY HELPERS
   Mirrors Bootstrap 3 spacing/display helpers
   with our own naming
══════════════════════════════════════════ */

/* Text utilities */
.text-sage   { color: var(--sage); }
.text-warm   { color: var(--warm); }
.text-dark   { color: var(--dark); }
.text-serif  { font-family: 'Cormorant Garamond', serif; }
.uppercase   { text-transform: uppercase; letter-spacing: .12em; }

/* Spacing */
.sh-px       { padding-left: 7%; padding-right: 7%; }

/* Shrink side padding on tablet */
@media (max-width: 991px) {
  .sh-px { padding-left: 4%; padding-right: 4%; }
}

/* Full width on phone */
@media (max-width: 767px) {
  .sh-px { padding-left: 1rem; padding-right: 1rem; }
}

/* ══════════════════════════════════════════
   BUTTONS — SHARED
   Used across all pages
══════════════════════════════════════════ */
.btn-sh-dark {
  background: var(--dark);
  color: #fff;
  border: none;
  padding: .65rem 1.6rem;
  font-size: .78rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background .2s;
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
}
.btn-sh-dark:hover { background: #333; }

.btn-sh-outline {
  background: transparent;
  color: var(--dark);
  border: 1.5px solid var(--dark);
  padding: .65rem 1.6rem;
  font-size: .78rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .2s;
  border-radius: 2px;
  font-family: 'DM Sans', sans-serif;
}
.btn-sh-outline:hover { background: var(--dark); color: #fff; }

/* Full width button on phones */
@media (max-width: 767px) {
  .btn-sh-dark, .btn-sh-outline {
    width: 100%;
    text-align: center;
    padding: .75rem 1rem;
  }
}

/* ══════════════════════════════════════════
   STARS ROW
   Same on all pages
══════════════════════════════════════════ */
.sh-stars {
  color: var(--gold);
  font-size: .65rem;
  display: flex;
  gap: 1px;
}

/* ══════════════════════════════════════════
   WISHLIST HEART BUTTON ON CARDS
══════════════════════════════════════════ */
.sh-wish-btn {
  position: absolute;
  top: 10px; right: 10px;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 30px; height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
  transition: all .2s;
  color: var(--warm);
}
.sh-wish-btn.liked { color: #e63946; }
.sh-wish-btn:hover { transform: scale(1.1); }

/* ══════════════════════════════════════════
   SALE BADGE ON CARD IMAGES
══════════════════════════════════════════ */
.sh-tag-badge {
  position: absolute;
  top: 10px; left: 10px;
  background: var(--sage);
  color: #fff;
  font-size: .58rem;
  padding: .2rem .5rem;
  letter-spacing: .08em;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 2px;
}
`;
