# Invoice Management App - HNG Stage 2

A fully functional, responsive invoice management application built with React, TypeScript, and Vite. This project allows users to manage their invoices with a professional UI, theme persistence, and robust data handling.

## 🚀 Live Demo
[Insert Your Live URL Here]

## 🔗 GitHub Repository
[https://github.com/Rosheed124/HNG-Task-2](https://github.com/Rosheed124/HNG-Task-2)


## 🛠️ Tech Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Persistence**: LocalStorage

---

## 📋 Features

### 1. CRUD Functionality
- **Create**: Add new invoices with multiple line items.
- **Read**: View a summary list and detailed breakdown of each invoice.
- **Update**: Edit existing invoices (Drafts or Pending).
- **Delete**: Remove invoices with a confirmation modal.

### 2. Status & Payment Flow
- **Draft**: Save work-in-progress without full validation.
- **Pending**: Mark invoices as sent and ready for payment.
- **Paid**: Mark pending invoices as paid (Status is preserved during edits).

### 3. Filtering & Search
- Filter the invoice list by status (Draft, Pending, Paid) using a custom checkbox dropdown.
- Dynamic empty states when no results match the filter.

### 4. Theme System
- Global **Light/Dark mode** toggle.
- Theme preference persists across sessions using LocalStorage.

---

## 🏗️ Architecture Explanation

The application follows a modular, component-based architecture:

- **Context Layer**: Uses two main contexts (`InvoiceContext` and `ThemeContext`) to provide global state without prop drilling. 
- **Component Layer**: Separated into `UI` (reusable components like Modals and Badges) and `Feature` components (InvoiceDetail, InvoiceForm, etc.).
- **Data Layer**: A centralized `types.ts` file defines the standard for `Invoice` and `InvoiceItem` objects, ensuring type safety throughout the app.
- **Persistence Layer**: Custom hooks and `useEffect` blocks synchronize the application state with `localStorage` on every change.

---

## ⚖️ Trade-offs

1. **LocalStorage vs. IndexedDB**: I chose LocalStorage for its simplicity and synchronous nature, which is ideal for a medium-scale task like this. While IndexedDB offers more storage, LocalStorage provides a faster development cycle and easier debugging for this specific scope.
2. **Vanilla CSS vs. Frameworks**: I opted for Vanilla CSS with a custom design system to achieve 100% visual parity with the professional design requirements. This avoided the "cookie-cutter" look of component libraries and kept the bundle size small.
3. **Internal Component Modals**: Instead of using a routing library for the "New/Edit" forms, I implemented them as overlays. This provides a smoother, app-like experience and maintains the user's scroll position in the list.

---

## ♿ Accessibility Notes

- **Focus Trapping**: Implemented a custom focus trap in the `Modal` and `InvoiceForm` components. When an overlay is active, keyboard users cannot "tab out" into the background elements.
- **Keyboard Navigation**: 
  - `ESC` key closes all modals and forms.
  - Interactive items have proper `tabIndex` and `role="button"`.
- **Semantic HTML**: Used appropriate elements like `<main>`, `<aside>`, `<button>`, and `<label>` to ensure screen readers can interpret the structure correctly.
- **Aria Labels**: All interactive icons and buttons have descriptive labels or aria-labels where necessary.

---

## ✨ Improvements Beyond Requirements

1. **Data Normalization**: Added defensive logic to convert string inputs from the browser into numeric types, preventing common JavaScript crashes during currency formatting.
2. **Dynamic Illustrations**: Created custom SVG assets for the empty state to ensure the UI feels polished even when no data is present.
3. **Robust ID Generation**: Used a combination of alphanumeric generation for Invoices (matching industry standards) and `crypto.randomUUID()` for unique line items.
4. **Theme Transition**: Added smooth CSS transitions for theme switching to prevent a "jarring" user experience when toggling modes.

---

## 🏃 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone [your-repo-url]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

*This project was developed for the HNG Cohort Stage 2 Frontend Task.*
