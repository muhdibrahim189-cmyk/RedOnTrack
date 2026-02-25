# RedOnTrack - Station Monitor

RedOnTrack is a state-of-the-art station monitoring and accident analysis dashboard designed to enhance safety and operational efficiency. Built with modern web technologies, it provides real-time surveillance capabilities, historical data analysis, and AI-driven insights.

<div align="center">
  <img src="./src/assets/logo.png" alt="RedOnTrack Logo" width="200" />
</div>

## 🚀 Features

*   **Live Camera Monitoring**: View and manage multiple CCTV feeds with PTZ (Pan-Tilt-Zoom) controls simulation.
*   **Accident Analysis**: Visualize accident statistics over different time periods (weekly, monthly) with interactive charts.
*   **AI-Powered Insights**: Leverage Google's Gemini API to analyze incident reports and generate actionable safety recommendations.
*   **Raw Data Catalog**: Browse and filter archived footage and incident logs.
*   **Dashboard Overview**: A centralized hub for critical metrics and system status.
*   **Authentication**: Secure login system with role-based access control (simulated).

## 🛠️ Tech Stack

*   **Framework**: [React 19](https://react.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **AI Integration**: [@google/generative-ai SDK](https://www.npmjs.com/package/@google/generative-ai)
*   **Styling**: Vanilla CSS with responsive design

## 🏗️ Architecture

This project follows a strict **SOLID** architectural pattern to ensure scalability and maintainability:

*   **Services**: Encapsulated business logic (e.g., `geminiService`, `accidentService`).
*   **Hooks**: Custom React hooks for state management and logic reuse (e.g., `useCameraManagement`).
*   **Components**: Pure presentational components.
*   **Domain**: Type definitions and interfaces.

For more details, please refer to the [Architecture Documentation](docs/ARCHITECTURE.md).

## 🏁 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   [pnpm](https://pnpm.io/) (Recommended)
*   **Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/redontrack.git
    cd redontrack
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Configuration

To enable the AI Forensic Suite, you must configure your environment variables.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and configure your settings:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    VITE_GEMINI_MODEL=gemini-2.5-flash
    ```

### 🤖 Supported AI Models

As of February 2026, the application supports the following Gemini model families:

| Model Series | Model ID | Use Case |
| :--- | :--- | :--- |
| **Gemini 3 (Reasoning)** | `gemini-3.1-pro-preview` | Deep forensic reasoning & complex logic. |
| **Gemini 3 (Flash)** | `gemini-3-flash-preview` | Ultra-fast, PhD-level reasoning. |
| **Gemini 2.5 (Pro)** | `gemini-2.5-pro` | Stable production, 1M token context. |
| **Gemini 2.5 (Flash)** | `gemini-2.5-flash` | **Default.** Best balance of speed/cost. |
| **Gemini 2.5 (Lite)** | `gemini-2.5-flash-lite` | High-throughput, budget-friendly. |

> **Note:** Models from the 1.5 and 2.0 series are deprecated. It is highly recommended to use the **2.5** or **3** series.

### Running the Application

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```text
src/
├── services/       # Business logic (API calls, data processing)
├── domain/         # TypeScript interfaces and types
├── hooks/          # Custom React hooks
├── components/     # Reusable UI components
├── pages/          # Application pages/routes
├── utils/          # Helper functions
├── constants/      # App-wide constants
└── App.tsx         # Main application entry
```

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

*RedOnTrack Station Monitor - Ensuring Safety Through Intelligence.*
