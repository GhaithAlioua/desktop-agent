module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#1e1e1e",
        "secondary-bg": "#252526",
        "accent-bg": "#2d2d30",
        "primary-text": "#cccccc",
        "secondary-text": "#a0a0a0",
        "accent-blue": "#007acc",
        "progress-blue": "#1e40af",
        border: "#3c3c3c",
        success: "#4ec9b0",
        error: "#f44747",
        warning: "#ce9178",
      },
      width: {
        sidebar: "200px",
      },
      height: {
        "status-bar": "26px",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      zIndex: {
        sidebar: "10",
        modal: "50",
        tooltip: "100",
      },
    },
  },
  plugins: [],
};
