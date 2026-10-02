import { Project } from '@/types/nova';

export const STARTER_PROJECTS: Project[] = [
  {
    id: 'proj-restaurant',
    name: 'Bistro Nova - Modern Restaurant & Ordering',
    description: 'Complete multi-page responsive restaurant application with Interactive Menu, Live Cart, Table Reservations, and Chef Specials.',
    type: 'website',
    tags: ['HTML5', 'CSS3', 'Tailwind', 'JavaScript', 'Responsive', 'Ecommerce'],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000,
    settings: {
      framework: 'vanilla-html',
      entryFile: 'index.html',
      theme: 'dark',
      dependencies: {
        'lucide': '^0.500',
        'tailwindcss': '^3.4',
      },
    },
    versions: [
      {
        id: 'v1.0',
        versionNumber: 1,
        timestamp: Date.now() - 86400000,
        description: 'Initial release with Menu, Reservation form, and responsive header.',
        files: [],
      },
    ],
    files: [
      {
        id: 'file-rest-index',
        name: 'index.html',
        path: 'index.html',
        language: 'html',
        isEntry: true,
        updatedAt: Date.now(),
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bistro Nova - Artisanal Dining & Culinary Art</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
</head>
<body class="bg-stone-950 text-stone-100 font-sans antialiased min-h-screen flex flex-col">
  <!-- Top Navigation -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-stone-950/80 border-b border-stone-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif text-xl font-bold">
          N
        </div>
        <div>
          <span class="font-serif text-2xl font-bold tracking-tight text-white">BISTRO NOVA</span>
          <span class="block text-[10px] tracking-widest uppercase text-amber-400/80 font-mono">Artisanal Hearth</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
        <a href="#home" class="text-amber-400 transition hover:text-amber-300">Home</a>
        <a href="#menu" class="hover:text-amber-400 transition">Culinary Menu</a>
        <a href="#about" class="hover:text-amber-400 transition">Our Heritage</a>
        <a href="#reserve" class="hover:text-amber-400 transition">Reservations</a>
      </nav>

      <div class="flex items-center gap-4">
        <button id="cartBtn" class="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-300 hover:text-amber-400 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span id="cartCount" class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-stone-950 font-bold text-xs rounded-full flex items-center justify-center">0</span>
        </button>
        <a href="#reserve" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-semibold text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 transition">
          Book a Table
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-grow">
    <section id="home" class="relative overflow-hidden py-24 px-6 border-b border-stone-900">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-950/30 via-stone-950 to-stone-950 -z-10"></div>
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider mb-6">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Michelin Star Nominee 2026
          </div>
          <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Where Fire Meets <span class="italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Culinary Poetry</span>.
          </h1>
          <p class="text-stone-400 text-lg leading-relaxed max-w-xl mb-8">
            Experience wood-fired gastronomy inspired by Mediterranean coastlines and Nordic foraging. Every dish tells an untamed story.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <a href="#menu" class="px-8 py-4 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition shadow-xl shadow-amber-500/25">
              Explore Tasting Menu
            </a>
            <button onclick="openChefStory()" class="px-6 py-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 font-medium hover:border-stone-700 transition">
              Watch The Hearth Film
            </button>
          </div>
        </div>

        <div class="relative">
          <div class="relative rounded-3xl overflow-hidden border border-stone-800 shadow-2xl bg-stone-900 group">
            <img src="https://picsum.photos/seed/bistro-gourmet/800/600" alt="Gourmet Dish" class="w-full h-[460px] object-cover group-hover:scale-105 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800">
              <span class="text-xs font-mono uppercase text-amber-400">Tonight's Signature Highlight</span>
              <h3 class="font-serif text-xl font-bold text-white mt-1">Glazed Black Cod & Charred Fennel Foam</h3>
              <p class="text-stone-400 text-sm mt-1">Yuzu reduction, fermented shiitake crisps, fresh winter truffles.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Menu Section -->
    <section id="menu" class="py-24 px-6 max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-mono uppercase tracking-widest text-amber-400">Seasonal Selection</span>
        <h2 class="font-serif text-4xl font-bold text-white mt-2">Curated Autumn Tasting</h2>
        <p class="text-stone-400 mt-3 text-sm">Harvested directly from our regenerative biodynamic estate farm.</p>
        <div class="flex justify-center gap-2 mt-8">
          <button onclick="filterMenu('all')" class="menu-tab px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider">All Courses</button>
          <button onclick="filterMenu('starters')" class="menu-tab px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs uppercase tracking-wider">Starters</button>
          <button onclick="filterMenu('mains')" class="menu-tab px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs uppercase tracking-wider">Mains</button>
          <button onclick="filterMenu('desserts')" class="menu-tab px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs uppercase tracking-wider">Desserts</button>
        </div>
      </div>

      <div id="menuGrid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Injected via app.js -->
      </div>
    </section>

    <!-- Table Reservation -->
    <section id="reserve" class="py-20 px-6 bg-stone-900/40 border-y border-stone-900">
      <div class="max-w-4xl mx-auto bg-stone-900 rounded-3xl border border-stone-800 p-8 sm:p-12 shadow-2xl">
        <div class="text-center mb-10">
          <span class="text-xs font-mono uppercase text-amber-400">Exclusive Seating</span>
          <h2 class="font-serif text-3xl font-bold text-white mt-1">Reserve Your Dining Journey</h2>
        </div>
        <form id="reservationForm" onsubmit="handleReservation(event)" class="grid sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-mono text-stone-400 uppercase mb-2">Guest Name</label>
            <input type="text" required placeholder="Elena Rostova" class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:border-amber-400 outline-none">
          </div>
          <div>
            <label class="block text-xs font-mono text-stone-400 uppercase mb-2">Email Address</label>
            <input type="email" required placeholder="elena@example.com" class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:border-amber-400 outline-none">
          </div>
          <div>
            <label class="block text-xs font-mono text-stone-400 uppercase mb-2">Party Size</label>
            <select class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:border-amber-400 outline-none">
              <option>2 Guests (Chef's Counter)</option>
              <option>4 Guests (Dining Room)</option>
              <option>6-8 Guests (Private Vault)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-mono text-stone-400 uppercase mb-2">Date & Time</label>
            <input type="datetime-local" required class="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-white focus:border-amber-400 outline-none">
          </div>
          <div class="sm:col-span-2">
            <button type="submit" class="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold hover:brightness-110 shadow-xl shadow-amber-500/20 transition">
              Confirm Reservation Request
            </button>
          </div>
        </form>
        <div id="reserveFeedback" class="hidden mt-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-center text-sm"></div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-stone-950 border-t border-stone-900 py-12 px-6">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-stone-500 text-sm">
      <div class="font-serif text-lg text-stone-300 font-bold">BISTRO NOVA © 2026</div>
      <div>742 Evergreen Terrace, Culinary District • Valet Parking Available</div>
      <div class="text-xs font-mono text-amber-500/70">Powered by NOVA AI Workspace</div>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>`,
      },
      {
        id: 'file-rest-app',
        name: 'app.js',
        path: 'app.js',
        language: 'javascript',
        updatedAt: Date.now(),
        content: `// Bistro Nova Application Logic
const menuItems = [
  {
    id: 1,
    name: 'Smoked Heirloom Beet Tartare',
    category: 'starters',
    price: 24,
    description: 'Fermented cashew cream, wild pine oil, rye cracker crisps.',
    badge: 'Vegan'
  },
  {
    id: 2,
    name: 'Wild Hokkaido Scallops',
    category: 'starters',
    price: 32,
    description: 'Brown butter dashi, pickled sea purslane, finger lime caviar.',
    badge: 'Signature'
  },
  {
    id: 3,
    name: 'Wood-Fired Iberian Pork Belly',
    category: 'mains',
    price: 46,
    description: 'Charred apricot mostarda, parsnip silk, reduced apple cider jus.',
    badge: 'Popular'
  },
  {
    id: 4,
    name: 'Glazed Black Cod',
    category: 'mains',
    price: 52,
    description: 'Yuzu dashi, charred leek ash, winter white truffles.',
    badge: 'Chef Special'
  },
  {
    id: 5,
    name: 'Dark Valrhona Chocolate Sphere',
    category: 'desserts',
    price: 22,
    description: 'Smoked sea salt caramel, hazelnut praline gelato, warm espresso ganache.',
    badge: 'Sweet'
  },
  {
    id: 6,
    name: 'Blood Orange & Thyme Mille-Feuille',
    category: 'desserts',
    price: 19,
    description: 'Caramelized puff pastry, orange blossom chantilly, candied kumquat.',
    badge: 'Seasonal'
  }
];

let cart = [];

function renderMenu(items) {
  const container = document.getElementById('menuGrid');
  if (!container) return;

  container.innerHTML = items.map(item => \`
    <div class="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition duration-300">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">\${item.badge}</span>
          <span class="text-xl font-serif font-bold text-amber-300">$\${item.price}</span>
        </div>
        <h3 class="font-serif text-xl font-bold text-white mb-2">\${item.name}</h3>
        <p class="text-stone-400 text-sm leading-relaxed mb-6">\${item.description}</p>
      </div>
      <button onclick="addToCart(\${item.id})" class="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-sm font-semibold transition">
        Add to Order
      </button>
    </div>
  \`).join('');
}

function filterMenu(category) {
  const buttons = document.querySelectorAll('.menu-tab');
  buttons.forEach(btn => {
    btn.classList.remove('bg-amber-500', 'text-stone-950');
    btn.classList.add('bg-stone-900', 'text-stone-300');
  });

  if (category === 'all') {
    renderMenu(menuItems);
  } else {
    const filtered = menuItems.filter(i => i.category === category);
    renderMenu(filtered);
  }
}

function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;
  cart.push(item);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.innerText = cart.length;
    badge.classList.add('scale-125');
    setTimeout(() => badge.classList.remove('scale-125'), 200);
  }
}

function handleReservation(e) {
  e.preventDefault();
  const feedback = document.getElementById('reserveFeedback');
  if (feedback) {
    feedback.classList.remove('hidden');
    feedback.innerHTML = '🎉 <strong>Reservation Confirmed!</strong> A confirmation email and secret tasting preview will be sent shortly.';
    e.target.reset();
  }
}

function openChefStory() {
  alert('Bistro Nova Hearth Film: Fire, Seasonality, & Heritage.');
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderMenu(menuItems);
});
renderMenu(menuItems);`,
      },
      {
        id: 'file-rest-css',
        name: 'styles.css',
        path: 'styles.css',
        language: 'css',
        updatedAt: Date.now(),
        content: `/* Bistro Nova Theme Styles */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

h1, h2, h3, .font-serif {
  font-family: 'Playfair Display', serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #0c0a09;
}
::-webkit-scrollbar-thumb {
  background: #292524;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #f59e0b;
}`,
      },
    ],
  },
  {
    id: 'proj-android-app',
    name: 'Aura Cloud Sync - Android Architecture',
    description: 'Production Android / Kotlin multiplatform architecture with Jetpack Compose UI, Room Database, StateFlow repository, and REST API integration.',
    type: 'android',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Room DB', 'Coroutines'],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 7200000,
    settings: {
      framework: 'android-kotlin',
      entryFile: 'app/src/main/java/com/nova/aura/MainActivity.kt',
      theme: 'dark',
      dependencies: {
        'androidx.compose.ui': '1.7.0',
        'androidx.room': '2.6.1',
        'kotlinx.coroutines': '1.8.0',
      },
    },
    versions: [],
    files: [
      {
        id: 'file-and-main',
        name: 'MainActivity.kt',
        path: 'app/src/main/java/com/nova/aura/MainActivity.kt',
        language: 'kotlin',
        isEntry: true,
        updatedAt: Date.now(),
        content: `package com.nova.aura

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.nova.aura.ui.theme.AuraTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AuraTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    TaskDashboardScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TaskDashboardScreen(viewModel: TaskViewModel = viewModel()) {
    val tasks by viewModel.tasks.collectAsState()
    var newTaskTitle by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Aura Tasks - Android Native") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A),
                    titleContentColor = Color(0xFF38BDF8)
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = newTaskTitle,
                    onValueChange = { newTaskTitle = it },
                    placeholder = { Text("Create sync item...") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Button(
                    onClick = {
                        if (newTaskTitle.isNotBlank()) {
                            viewModel.addTask(newTaskTitle)
                            newTaskTitle = ""
                        }
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Add")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(tasks) { task ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = task.title, color = Color.White)
                            Checkbox(
                                checked = task.isCompleted,
                                onCheckedChange = { viewModel.toggleTask(task.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}`,
      },
      {
        id: 'file-and-manifest',
        name: 'AndroidManifest.xml',
        path: 'app/src/main/AndroidManifest.xml',
        language: 'xml',
        updatedAt: Date.now(),
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.nova.aura">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Aura Task Master"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Aura">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.Aura">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
      },
      {
        id: 'file-and-gradle',
        name: 'build.gradle.kts',
        path: 'app/build.gradle.kts',
        language: 'groovy',
        updatedAt: Date.now(),
        content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.nova.aura"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.nova.aura"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.room.runtime)
    ksp(libs.androidx.room.compiler)
}`,
      },
    ],
  },
];
