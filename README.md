# Sri Durga Images - Frontend

This is the frontend application for Sri Durga Electronics & Furnitures, built with React and Vite. This project is highly helpful for users to view and select products, featuring an integrated share option and unique product IDs for easy identification.

### 🌟 Why This Project is Helpful
- **Product Viewing & Selection**: Users can effortlessly browse through premium furniture collections with high-quality images and detailed descriptions, making the selection process smooth and enjoyable.
- **Unique Product IDs**: Every item is assigned a unique, professionally formatted ID (e.g., `LIV-A1B2`). This helps users accurately reference products when inquiring or placing orders.
- **Easy Sharing**: Found something you like? The built-in share feature allows you to instantly send product links to friends or family using the native Web Share API or by copying to your clipboard.

## 🚀 Features

- **Advanced Filtering & Discovery**: 
  - Dual-level navigation (Categories and Subcategories).
  - Price-range filtering and multi-criteria sorting.
- **Product Sharing**: Built-in support for the Web Share API and clipboard fallbacks.
- **Unique IDs**: Automatically generated formatted IDs (e.g., KITCH-A1B2) for every product.
- **Premium Image Viewer**: High-resolution modal with interactive zoom, drag-to-pan, and multi-image support.
- **Admin Suite**: Secure, password-protected tools for comprehensive product and category management.
- **Global Search**: Real-time search functionality across the entire inventory.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## 📂 Folder Structure

- `src/components/`: Contains all React components, organized by feature (Admin, Product, etc.).
- `src/utils/`: Utility files, including the Supabase client configuration.
- `src/assets/`: Static images and SVG icons.
- `public/`: Public assets like favicon and manifest files.

## 🔧 Configuration

### Environment Variables
Ensure you have a `.env` file in this directory:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Database
The database schema is defined in [supabase_schema.sql](supabase_schema.sql). Use this to set up your Supabase tables and RLS policies.

## 🌐 Deployment

The project is configured for deployment on Vercel (see `vercel.json`) and includes a `_redirects` file for SPAs in the `public` folder.
