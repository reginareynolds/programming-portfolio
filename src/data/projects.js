const projects = [
  {
    id: "ai-dashboard",
    title: "AI-Powered Dashboard",
    description:
      "Full-stack analytics dashboard with natural language querying powered by LLMs. Upload data and ask questions in plain English.",
    type: "Full-Stack",
    stack: ["React", "Flask", "PostgreSQL", "LangChain", "Groq"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/ai-dashboard",
    liveUrl: "https://reginareynolds-ai-dashboard.vercel.app",
    thumbnail: "/images/projects/ai-dashboard.png",
  },
  {
    id: "3d-model-viewer",
    title: "3D Model Viewer",
    description:
      "Interactive 3D model viewer with upload, orbit controls, and annotation tools. Built with Three.js and React Three Fiber.",
    type: "Full-Stack",
    stack: ["React", "Three.js", "Express", "Node.js"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/3d-model-viewer",
    liveUrl: "https://reginareynolds-3d-viewer.vercel.app",
    thumbnail: "/images/projects/3d-model-viewer.png",
  },
  {
    id: "rest-api-microservice",
    title: "REST API Microservice",
    description:
      "Production-grade RESTful API with JWT authentication, input validation, and full test coverage with CI/CD pipeline.",
    type: "Backend",
    stack: ["Flask", "PostgreSQL", "JWT", "Docker", "GitHub Actions"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/rest-api-microservice",
    liveUrl: null,
    thumbnail: null,
  },
  {
    id: "iot-data-simulator",
    title: "IoT Data Simulator",
    description:
      "Real-time sensor data simulator with WebSocket streaming and live time-series visualization dashboards.",
    type: "Full-Stack",
    stack: ["React", "FastAPI", "WebSockets", "Recharts"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/iot-data-simulator",
    liveUrl: "https://reginareynolds-iot-simulator.vercel.app",
    thumbnail: "/images/projects/iot-data-simulator.png",
  },
  {
    id: "art-portfolio",
    title: "3D Art Portfolio",
    description:
      "Interactive portfolio showcasing 3D modeling and visualization work with an embedded WebGL model viewer.",
    type: "Static",
    stack: ["React", "Three.js", "Vite", "GitHub Pages"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/art-portfolio",
    liveUrl: null,
    thumbnail: null,
  },
];

export default projects;
