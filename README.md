# Norse Tactics

A Norse mythology-themed card game based on Triple Triad mechanics, built with React and TypeScript.

## Features

- Strategic card placement on a 3x3 grid
- Norse mythology themed cards with unique abilities
- Multiple game rules including Same, Plus, Elements, and Ragnarök
- Progressive Web App (PWA) support for offline play
- Beautiful UI with Norse-inspired design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/norse-tactics.git
cd norse-tactics
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Deployment to Vercel

1. Create a GitHub repository and push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/norse-tactics.git
git push -u origin main
```

2. Sign up for a Vercel account at https://vercel.com

3. Install Vercel CLI:
```bash
npm i -g vercel
```

4. Deploy to Vercel:
```bash
vercel
```

5. Follow the prompts to connect your GitHub repository

Your app will be automatically deployed to a URL like `https://norse-tactics.vercel.app`

## PWA Features

- Offline support
- Installable on mobile devices
- Fast loading times
- Automatic updates

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Project Structure

```
norse-tactics/
  ├── public/
  │   ├── index.html
  │   ├── manifest.json
  │   └── icons/
  ├── src/
  │   ├── components/
  │   ├── services/
  │   ├── types/
  │   ├── data/
  │   ├── App.tsx
  │   └── index.tsx
  └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 