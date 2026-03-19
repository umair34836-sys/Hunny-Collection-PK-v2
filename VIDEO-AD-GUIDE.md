# 📺 Page-Specific Video Ad System

## Overview
This system allows the admin to configure **different video/image advertisements for each page** of the website. Each page can have its own unique ad settings.

---

## 🎯 Features

### 1. **Per-Page Configuration**
- Each page (Home, Shop, Product, Cart, etc.) can have a different ad
- Admin can enable/disable ads independently for each page
- Different media files can be used on different pages

### 2. **Media Types Supported**
- 🎬 **Video (MP4, WebM, OGG)** - Auto-play with mute option
- 🖼️ **Image (JPG, PNG, GIF, WebP)** - Static banner ads

### 3. **Customization Options**
- **Position**: Top of page or bottom of page
- **Auto-play**: Enable/disable for videos
- **Close button**: Allow users to dismiss the ad
- **Click URL**: Redirect users to a specific page when ad is clicked
- **Title**: Optional title shown above the ad

---

## 📋 How to Use (Admin Guide)

### Step 1: Access Settings
1. Login to Admin Panel
2. Click on **⚙️ Site Settings** in the sidebar
3. Select **📺 Video Ad** from the settings menu

### Step 2: Configure Page-Specific Ads
1. **Select Page** from the dropdown (e.g., Home Page, Shop Page, etc.)
2. **Enable Advertisement** checkbox
3. **Choose Media Type** (Video or Image)
4. **Enter File Name** (e.g., `v1.mp4` or `banner.jpg`)
5. **Configure Options**:
   - Auto-play video
   - Show close button
   - Position (top/bottom)
   - Click redirect URL (optional)
6. Click **Save for This Page**

### Step 3: Repeat for Other Pages
- Select another page from the dropdown
- Configure different settings if needed
- Save

### Step 4: View All Configurations
1. Go to **Admin Panel**
2. Click **📺 Video Ads** in sidebar
3. See table showing all pages and their ad status

---

## 📁 File Upload

### Where to Upload Media Files
Upload your video/image files to the **`assets`** folder in your project:
```
Hunny Collection Pk/
├── assets/
│   ├── v1.mp4          ← Your video ad
│   ├── banner.jpg      ← Your image ad
│   ├── promo.mp4       ← Another video
│   └── logo.jpeg
```

### File Naming Tips
- Use simple names: `v1.mp4`, `ad1.jpg`, `promo.mp4`
- No spaces in file names (use underscores: `my_ad.mp4`)
- Keep videos under 5MB for faster loading

---

## 🎨 Example Configurations

### Example 1: Different Ads Per Page
| Page | File | Position | Status |
|------|------|----------|--------|
| Home | `welcome.mp4` | Top | ✅ Enabled |
| Shop | `sale-banner.jpg` | Bottom | ✅ Enabled |
| Cart | `checkout-promo.mp4` | Top | ✅ Enabled |
| Product | (none) | - | ❌ Disabled |

### Example 2: Same Ad Everywhere
Configure the same file (e.g., `promo.mp4`) for all pages with same settings.

---

## 🔧 Technical Details

### Storage
- Settings are stored in **localStorage** (per page)
- Key format: `videoAd_{pageName}`
- Example: `videoAd_index.html`, `videoAd_shop.html`

### Functions Available
```javascript
// Get settings for a specific page
getVideoAdSettings('index.html')

// Save settings for a page
saveVideoAdSettings('index.html', settings)

// Get all page settings
getAllPageSettings()

// Delete settings for a page
deletePageSettings('index.html')

// Get current page name
getCurrentPage()
```

---

## 🎯 Benefits

1. **Flexibility**: Show relevant ads on relevant pages
2. **Control**: Admin has full control over each page
3. **Performance**: Only load ads where needed
4. **User Experience**: Don't overwhelm users with ads everywhere
5. **Easy Management**: All settings in one place

---

## 💡 Best Practices

1. **Home Page**: Use welcome/introductory video
2. **Shop Page**: Promote ongoing sales or collections
3. **Product Page**: Show related products or offers
4. **Cart Page**: Encourage checkout with urgency
5. **Checkout Page**: Keep it clean (maybe no ad)
6. **Optimize**: Compress videos for faster loading
7. **Test**: Preview each page after configuration

---

## 🐛 Troubleshooting

### Ad Not Showing
- ✅ Check if ad is **enabled** for that page
- ✅ Verify **file name** is correct (case-sensitive)
- ✅ Ensure file exists in `assets` folder
- ✅ Check browser console for errors

### Video Not Auto-playing
- ✅ Modern browsers require videos to be **muted** for autoplay
- ✅ Use the mute button to enable sound

### Settings Not Saving
- ✅ Clear browser cache and try again
- ✅ Check if localStorage is enabled in browser

---

## 📞 Support

For issues or questions, contact the developer or check the admin panel.
