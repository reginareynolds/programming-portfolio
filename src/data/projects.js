const projects = [
  {
    id: "ai-dashboard",
    title: "AI-Powered Dashboard",
    description:
      "I built this full-stack analytics dashboard with natural language querying powered by LLMs to better understand the way that real data integrates with AI. Functional AI can be really powerful, but it can also be really confusing, and I wanted to demystify the whole process by working with it from end-to-end. \n\n The dashboard works by taking a user's natural language question and translating it into a SQL query that gets executed against a PostgreSQL database. The results from the database are then returned to the user and formatted into a visual demonstration where appropriate. For example, asking the demo data for the top 5 products by quantity sold returns a bar chart while asking for the product with the highest sales just returns a stylized text response. By including the option to show the SQL query that gets generated from the user input, I made it possible to take a peek at how AI is thinking about the question that you asked it.\n\nI set it up so that you can upload your own data and ask it questions, so hopefully it gives you a better understanding of how your data can practically integrate with AI and be used in the future!",
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
    type: "Full-Stack",
    description:
      "As someone who has been playing video games for as long as I could hold a controller, I can trace the modern 3D cross-platform compatibility issue back to two things. The first is maintaining model quality during real-time rendering. In an improv comedy show, every show is different because the comedian has to react to whatever the audience says or does as it’s happening. Real-time rendering is like improv, so whenever a user spins the view, zooms in and out, or moves things around, the scene has to account for those changes and rerender immediately in order to avoid breaking immersion. This is really computationally intensive. This ties into the second issue, which is that any 3D model today has to work across the huge variety of hardware configurations (and associated limitations) on the market, which isn’t easily possible.\n\nTo address this, there has been a shift away from running software natively on any device, where the hardware severely affects the software’s capabilities, and a shift towards ACCESSING software from any device, where the hardware is actually just viewing software that is being run somewhere else. This shift has largely been made possible by the rise of web-based 3D frameworks like Three.js.\n\nReal-time 3D rendering has come a really long way in terms of performance and usability. To demonstrate that and to practice with the latest 3D JavaScript libraries (Three.js and React Three Fiber), I built this interactive 3D model viewer with upload, orbit controls, and annotation tools. You can upload your own 3D models, inspect them, and even annotate them with pins, and you can do it entirely in the browser without ever needing to download anything! It’s a small project, but it showcases something that would have been almost impossible until very recently.", 
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
      "This is a real-time sensor data simulator with WebSocket streaming and live time-series visualization dashboards. It's inspired by the OEE monitoring system that I built while working at Harpak-ULMA Packaging. \n\nIt works by simulating sensor data and streaming it to the frontend in real-time. The frontend charts the sensor data in real-time as it's received. There is also a live alert system to detect any anomalies in the received data and display any warnings or critical alerts. Just like in real life, the lines can stop and start, and the OEE for each line is recalculated every second to reflect the most up-to-date information about the line's functioning.",
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
    "I have kind of an odd background in that while a lot of what I do is on the more technical side, I also have pretty extensive 3D art experience. To demonstrate those capabilities, I created this interactive portfolio showcasing my 3D modeling and visualization work. Just like the interactive 3D model viewer, this portfolio is also built with Three.js and React Three Fiber, and it has an embedded WebGL model viewer. \n\nTake my models for a spin and check out the process breakdowns for each piece!",
    type: "Static",
    stack: ["React", "Three.js", "Vite", "GitHub Pages"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/art-portfolio",
    liveUrl: null,
    thumbnail: null,
  },
];

export default projects;
