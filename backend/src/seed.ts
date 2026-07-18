import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { redis } from './config/redis';

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const ALL_PRODUCTS = [
  // ─── CATEGORY: DOGS (11 Items) ────────────────────────────────────────────────
  {
    id: 10001,
    title: 'Derpy Husky Pup (Drama Queen)',
    artist: 'Adopt-a-Pup',
    price: 0.08,
    imgUrl: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 5,
    description: 'Extremely talkative, does dramatic howling concerts at 3 AM, and refuses to admit he is a good boy.'
  },
  {
    id: 10002,
    title: 'Stubborn English Bulldog Loaf',
    artist: 'Paws Rescue',
    price: 25,
    imgUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 3,
    description: '90% stubbornness, 10% gas, 100% love. Will sit down in the middle of a walk and refuse to budge.'
  },
  {
    id: 10003,
    title: 'Golden Retriever (Professional Smiler)',
    artist: 'Happy Tails',
    price: 15,
    imgUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598133185503-2b7e12918a67?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 4,
    description: 'Optimistic to a fault. Will happily fetch a stick, a leaf, or a random stranger\'s shoe. Professional tail-wagger.'
  },
  {
    id: 10004,
    title: 'Fluffy Corgi Loaf (Stumpy Edition)',
    artist: 'Shelter Friends',
    price: 15,
    imgUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 6,
    description: 'Short legs, huge ears, and a round fluffy butt. Perfect bread loaf configuration. Highly aerodynamic.'
  },
  {
    id: 10005,
    title: 'Smiling Shiba Inu (Meme King)',
    artist: 'Adopt-a-Pup',
    price: 20,
    imgUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 5,
    description: 'The dog of crypto fame. Very clean, slightly judging you, and capable of generating endless memes.'
  },
  {
    id: 10006,
    title: 'Polite Pug (Always Concerned)',
    artist: 'Paws Rescue',
    price: 15,
    imgUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1523626797181-8c5ae80d40c2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 4,
    description: 'Has a permanently worried expression. Snorts like a small steam engine. Extremely sweet cuddler.'
  },
  {
    id: 10007,
    title: 'Fancy Toy Poodle (Curly Cloud)',
    artist: 'Happy Tails',
    price: 25,
    imgUrl: 'https://images.unsplash.com/photo-1598134493179-51332e56807f?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1598134493179-51332e56807f?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 5,
    description: 'A cloud of curly hair. Very active, highly intelligent, and will steal your socks with zero remorse.'
  },
  {
    id: 10008,
    title: 'Sleepy Dachshund Sausage',
    artist: 'Shelter Friends',
    price: 20,
    imgUrl: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 7,
    description: 'Long body, short legs, giant personality. Expert at burrowing under blankets to stay cozy.'
  },
  {
    id: 10009,
    title: 'Energetic Jack Russell Terrier',
    artist: 'Adopt-a-Pup',
    price: 20,
    imgUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598133185503-2b7e12918a67?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 8,
    description: 'A tiny ball of pure, unfiltered energy. Enjoys jumping high and chasing tennis balls forever.'
  },
  {
    id: 10010,
    title: 'Gentle Giant Samoyed (Cloud Dog)',
    artist: 'Paws Rescue',
    price: 15,
    imgUrl: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 2,
    description: 'Looks like a smiling giant cloud. Very friendly, sheds fluff like snowflakes, and loves winter.'
  },
  {
    id: 10011,
    title: 'Majestic Border Collie (Einstein Dog)',
    artist: 'Happy Tails',
    price: 25,
    imgUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&h=600&fit=crop'
    ],
    category: 'dogs',
    stock: 4,
    description: 'Probably smarter than most humans. Enjoys organizing toys and herding family members in the living room.'
  },

  // ─── CATEGORY: FOOD (11 Items) ────────────────────────────────────────────────
  {
    id: 10012,
    title: 'Monster Feast Dry Kibble',
    artist: 'BarkBites',
    price: 24.99,
    imgUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608454527339-62ebe45cd23d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 15,
    description: 'Rich in proteins and nutrients, designed to give your dog maximum zoomies energy.'
  },
  {
    id: 10013,
    title: 'Smelly Beef Liver Chunk Treats',
    artist: 'Kibble Kraft',
    price: 18.5,
    imgUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 20,
    description: 'Smells terrible to humans, but dogs will literally perform complex calculus equations just for one bite.'
  },
  {
    id: 10014,
    title: 'Gourmet Wet Meat Gravy Cup',
    artist: 'RawFeast',
    price: 14.99,
    imgUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 25,
    description: 'Super juicy chunks of meat drenched in rich savory gravy. Instant tail-wagging guaranteed.'
  },
  {
    id: 10015,
    title: 'Wobbly Rib Joint Chew Bone',
    artist: 'NutriPaw',
    price: 29.99,
    imgUrl: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 12,
    description: 'Premium calcium chew bone infused with delicious beef marrow flavor. Keeps jaws busy for hours.'
  },
  {
    id: 10016,
    title: 'Organic Sweet Potato Dog Chews',
    artist: 'BarkBites',
    price: 12,
    imgUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 18,
    description: 'Chewy, natural sweet potato slices dehydrated to perfection. Vegan-friendly and full of vitamins.'
  },
  {
    id: 10017,
    title: 'Salmon Oil Skin & Coat Booster',
    artist: 'Kibble Kraft',
    price: 22.5,
    imgUrl: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 14,
    description: 'Pure wild salmon oil pumps to add to their meals. Solves itchy skin and creates a shiny coat.'
  },
  {
    id: 10018,
    title: 'Peanut Butter Coated Dental Sticks',
    artist: 'RawFeast',
    price: 9.99,
    imgUrl: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 32,
    description: 'Cleans teeth, fights plaque, and freshens breath with real yummy peanut butter flavor.'
  },
  {
    id: 10019,
    title: 'Grain-Free Puppy Starter Kibble',
    artist: 'NutriPaw',
    price: 27,
    imgUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608454527339-62ebe45cd23d?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 15,
    description: 'Easy-to-digest kibble customized for tiny growing tummies and healthy brain development.'
  },
  {
    id: 10020,
    title: 'Rich Bone Marrow Broth Soup',
    artist: 'BarkBites',
    price: 8.5,
    imgUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 40,
    description: 'Perfect meal topper. Hydrates dry food and adds a massive burst of beef marrow flavor.'
  },
  {
    id: 10021,
    title: 'Smoked Venison Jerky Strips',
    artist: 'Kibble Kraft',
    price: 19.99,
    imgUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 22,
    description: 'Slow-smoked premium venison jerky. Highly chewy and packed with real rich game meat taste.'
  },
  {
    id: 10022,
    title: 'Superfood Green-Lipped Mussel Dust',
    artist: 'RawFeast',
    price: 29.99,
    imgUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=600&h=600&fit=crop'
    ],
    category: 'food',
    stock: 12,
    description: 'Premium joint supplement powder made from New Zealand mussels. Rebuilds cartilage and reduces pain.'
  },

  // ─── CATEGORY: TOYS (11 Items) ────────────────────────────────────────────────
  {
    id: 10101,
    title: 'Squeaky Yellow Ball Toy',
    artist: 'ChewMaster',
    price: 9.99,
    imgUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 30,
    description: 'Bounces weirdly, squeaks loudly, and fits perfectly in a happy dog\'s mouth.'
  },
  {
    id: 10102,
    title: 'Heavy Duty Knotted Rope Tugger',
    artist: 'SqueakSquad',
    price: 15.99,
    imgUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583336663277-620db1996580?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 18,
    description: 'Double knotted cotton rope toy. Perfect for epic tug-of-war battles between you and your fuzzy beast.'
  },
  {
    id: 10103,
    title: 'Plush Squeaker Stuffed Chicken',
    artist: 'FetchFun',
    price: 12.5,
    imgUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 22,
    description: 'Soft, cuddly, yet features a high-pitched squeaker inside. The ultimate soft toy obsession.'
  },
  {
    id: 10104,
    title: 'Interactive Treat Dispenser Ball',
    artist: 'ToughTug',
    price: 19.99,
    imgUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 14,
    description: 'Rolls around and drops treats randomly. Keeps high-intelligence pups mentally stimulated and busy.'
  },
  {
    id: 10105,
    title: 'Indestructible Rubber Tire Chew',
    artist: 'ChewMaster',
    price: 14,
    imgUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583336663277-620db1996580?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 18,
    description: 'Made of ultra-durable carbon-infused rubber. Specially designed for extreme power-chewing dogs.'
  },
  {
    id: 10106,
    title: 'Glow-in-the-Dark Flying Disc',
    artist: 'SqueakSquad',
    price: 11.5,
    imgUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 25,
    description: 'Fluorescent frisbee that glows bright in the dark. Perfect for late night fetch sessions at the park.'
  },
  {
    id: 10107,
    title: 'Squeaky Lobster Chew Toy',
    artist: 'FetchFun',
    price: 13.99,
    imgUrl: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 20,
    description: 'A cute lobster-shaped squeaker made of textured corduroy fabric. Cleans teeth while being chewed.'
  },
  {
    id: 10108,
    title: 'Crinkle Sound Plush Hedgehog',
    artist: 'ToughTug',
    price: 8.99,
    imgUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 35,
    description: 'Makes satisfying paper-crinkling sounds when squeezed. Perfect size for small and medium dogs.'
  },
  {
    id: 10109,
    title: 'Dog Puzzle Game Slide Board',
    artist: 'ChewMaster',
    price: 25,
    imgUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 10,
    description: 'Level 2 intelligence toy. Dogs must slide blocks using nose or paws to discover hidden kibbles.'
  },
  {
    id: 10110,
    title: 'Bouncy Star-shaped Teething Ball',
    artist: 'SqueakSquad',
    price: 10.5,
    imgUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 24,
    description: 'Star grooves massage gums and clean teeth. You can insert small kibbles inside the grooves for added fun.'
  },
  {
    id: 10111,
    title: 'Tug-of-war Bungee Rope',
    artist: 'FetchFun',
    price: 21,
    imgUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583336663277-620db1996580?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&h=600&fit=crop'
    ],
    category: 'toys',
    stock: 12,
    description: 'Shock-absorbing bungee rope. Reduces tension on your arms and dog\'s neck during high-power tugging.'
  },

  // ─── CATEGORY: CLOTHES (11 Items) ──────────────────────────────────────────────
  {
    id: 10201,
    title: 'Fluffy Dino Fleece Hoodie',
    artist: 'PawsWear',
    price: 29.99,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 10,
    description: 'Super warm fleece hoodie with dinosaur spikes on the back. Instant coolness upgrade.'
  },
  {
    id: 10202,
    title: 'CEO Formal Business Suit',
    artist: 'PupFashion',
    price: 29.99,
    imgUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 8,
    description: 'Includes a white shirt collar, a black suit vest, and a red bow tie. Ready to negotiate for more treats.'
  },
  {
    id: 10203,
    title: 'Yellow Waterproof Raincoat',
    artist: 'DoggyCouture',
    price: 24.5,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 12,
    description: 'Bright yellow raincoat with a protective hood. Keeps your pup dry and highly visible on wet walks.'
  },
  {
    id: 10204,
    title: 'Stay Strange Mascot Bandana',
    artist: 'CozyCanine',
    price: 8.99,
    imgUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 50,
    description: '100% organic cotton bandana with hand-drawn mascot patterns. Style points +1000.'
  },
  {
    id: 10205,
    title: 'Warm Winter Knit Dog Sweater',
    artist: 'PawsWear',
    price: 22,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 14,
    description: 'Classic cable knit pattern in deep navy blue. Stretchy and cozy for chilly autumn outings.'
  },
  {
    id: 10206,
    title: 'Cozy PJ Cotton Dog Jumpsuit',
    artist: 'PupFashion',
    price: 18.99,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 16,
    description: 'Soft cotton pyjama jumpsuit with funny puppy paw prints. Keeps shedding under control at night.'
  },
  {
    id: 10207,
    title: 'Funny Aloha Hawaiian Shirt',
    artist: 'DoggyCouture',
    price: 16.5,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 20,
    description: 'Tropical floral print shirt with snaps. Your dog is ready to sip mocktails on a beach vacation.'
  },
  {
    id: 10208,
    title: 'Sherpa Fur-lined Winter Coat',
    artist: 'CozyCanine',
    price: 29.99,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 6,
    description: 'Heavy padded winter parka with thick Sherpa fleece lining. Protects from freezing snow climates.'
  },
  {
    id: 10209,
    title: 'Chic Plaid Puppy Bowtie Collar',
    artist: 'PawsWear',
    price: 7.99,
    imgUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 45,
    description: 'Adjustable collar with a detachable bowtie. Turns any regular walk into a red-carpet fashion show.'
  },
  {
    id: 10210,
    title: 'Sporty Windbreaker Active Vest',
    artist: 'PupFashion',
    price: 26,
    imgUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 12,
    description: 'Reflective, lightweight wind vest with harness hole. Designed for running and athletic dogs.'
  },
  {
    id: 10211,
    title: 'Super Hero Cape Costume',
    artist: 'DoggyCouture',
    price: 15,
    imgUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop'
    ],
    category: 'clothes',
    stock: 18,
    description: 'Let your dog unleash their inner hero. Red satin cape with secure velcro neck attachments.'
  }
];

async function main() {
  console.log('Start seeding...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany({
    where: { role: 'USER' } // Keep the admin if it exists
  });

  // 2. Seed Products
  console.log('Seeding products...');
  for (const product of ALL_PRODUCTS) {
    await prisma.product.create({
      data: product,
    });
  }

  // 3. Seed Users (20 users)
  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [];
  for (let i = 1; i <= 20; i++) {
    const user = await prisma.user.create({
      data: {
        email: `customer${i}@example.com`,
        fullName: `Customer ${i}`,
        phone: `090123456${i.toString().padStart(2, '0')}`,
        address: `${i} Main Street, City`,
        password: passwordHash,
        role: 'USER',
        isVerified: true,
        createdAt: new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30))) // Random date in last 30 days
      }
    });
    users.push(user);
  }

  // 4. Seed Orders (30 orders)
  console.log('Seeding orders...');
  const statuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
  
  for (let i = 1; i <= 30; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
    
    // Pick random products
    const selectedProducts = [];
    for (let j = 0; j < numItems; j++) {
      const product = ALL_PRODUCTS[Math.floor(Math.random() * ALL_PRODUCTS.length)];
      if (!selectedProducts.find(p => p.id === product.id)) {
        selectedProducts.push(product);
      }
    }

    // Calculate total
    let totalAmount = 0;
    const orderItemsData = selectedProducts.map(p => {
      const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2
      totalAmount += p.price * quantity;
      return {
        productId: p.id,
        quantity: quantity,
        priceAtTime: p.price
      };
    });

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const orderDate = new Date(new Date().setDate(new Date().getDate() - Math.floor(Math.random() * 30)));

    await prisma.order.create({
      data: {
        userId: randomUser.id,
        customerEmail: randomUser.email,
        customerPhone: randomUser.phone,
        shippingAddr: randomUser.address,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        status: status,
        createdAt: orderDate,
        orderItems: {
          create: orderItemsData
        }
      }
    });
  }

  console.log('Seeding finished successfully.');
  
  await redis.flushall();
  console.log('Redis cache cleared automatically.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    redis.disconnect();
  });
