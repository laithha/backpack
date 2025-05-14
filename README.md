# Backpack Manager

A modern web application for managing your backpack collection. Built with Next.js, TypeScript, and TailwindCSS.

![Backpack Manager Screenshot](https://via.placeholder.com/800x400?text=Backpack+Manager)

## Features

- **Add New Backpacks**: Add backpacks with details like name, brand, material, and weight
- **View All Backpacks**: See all your backpacks in a responsive grid layout
- **Edit and Delete**: Update or remove backpacks as needed
- **Filter and Sort**: Find backpacks by name, brand, or filter by material
- **Data Validation**: Form validation ensures data integrity
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Next.js**: React framework with server-side rendering
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Icons**: For beautiful icons
- **UUID**: For generating unique IDs

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/backpack-manager.git
cd backpack-manager
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding a Backpack

1. Click the "Add Backpack" button in the header
2. Fill in the required fields (name, brand, material, weight)
3. Click "Add Backpack" to save

### Editing a Backpack

1. Find the backpack you want to edit
2. Click the edit icon (pencil)
3. Update the information
4. Click "Update Backpack" to save changes

### Deleting a Backpack

1. Find the backpack you want to delete
2. Click the delete icon (trash)
3. Confirm deletion in the pop-up dialog

### Filtering and Sorting

- Use the search box to filter backpacks by name or brand
- Use the material dropdown to filter by material type
- Use the sort dropdown to order backpacks by different criteria
- Click the sort direction button to toggle between ascending and descending order

## Implementation Notes

This implementation uses in-memory storage for the backpack data. In a real application, this would be replaced with actual API calls to a backend server. The mock data store simulates CRUD operations that would typically interact with a database.

## License

MIT
