const projects = [
  {
    id: "ai-dashboard",
    title: "AI-Powered Dashboard",
    description:
      "I built this full-stack analytics dashboard with natural language querying powered by LLMs to better understand the way that real data integrates with AI. Functional AI can be really powerful, but it can also be really confusing, and I wanted to demystify the whole process by working with it from end-to-end. \n\n The dashboard works by taking a user's natural language question and translating it into a SQL query that gets executed against a PostgreSQL database. The results from the database are then returned to the user and formatted into a visual demonstration where appropriate. For example, asking the demo data for the top 5 products by quantity sold returns a bar chart while asking for the product with the highest sales just returns a stylized text response. By including the option to show the SQL query that gets generated from the user input, I made it possible to take a peek at how AI is thinking about the question that you asked it.\n\nI set it up so that you can upload your own data and ask it questions, so hopefully it gives you a better understanding of how your data can practically integrate with AI and be used in the future! ",
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
      "As someone who has been playing video games for as long as I could hold a controller, I can trace the modern 3D cross-platform compatibility issue back to two things. The first is maintaining model quality during real-time rendering. In an improv comedy show, every show is different because the comedian has to react to whatever the audience says or does as it’s happening. Real-time rendering is like improv, so whenever a user spins the view, zooms in and out, or moves things around, the scene has to account for those changes and rerender immediately in order to avoid breaking immersion. This is really computationally intensive. This ties into the second issue, which is that any 3D model today has to work across the huge variety of hardware configurations (and associated limitations) on the market, which isn’t easily possible.\n\nTo address this, there has been a shift away from running software natively on any device, where the hardware severely affects the software’s capabilities, and a shift towards ACCESSING software from any device, where the hardware is actually just viewing software that is being run somewhere else. This shift has largely been made possible by the rise of web-based 3D frameworks like Three.js.\n\nReal-time 3D rendering has come a really long way in terms of performance and usability. To demonstrate that and to practice with the latest 3D JavaScript libraries (Three.js and React Three Fiber), I built this interactive 3D model viewer with upload, orbit controls, and annotation tools. You can upload your own 3D models, inspect them, and even annotate them with pins, and you can do it entirely in the browser without ever needing to download anything! It’s a small project, but it showcases something that would have been almost impossible until very recently. ", 
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
      "This project is my take on a full-stack task management application with a Kanban board UI. I created it to show that I can build a clean, well-structured, production-level API capable of CRUD operations, but more importantly, I wanted to demonstrate my ability to proactively identify and address potential failure points throughout the tech stack. This is because I believe that being a good engineer requires thinking beyond just features and taking into consideration potential problems BEFORE they happen. Simply being reactive to problems that arise creates compounding technical debt from the moment that a project begins. A good engineer has to be proactive about problems so that they never come up in the first place.\n\nThe backend is built using the Flask REST API, which is linked to a PostgreSQL database. It features JWT authentication with secure token handling and input validation through Marshmallow schemas to ensure the validity of submitted data and avoid database injection attacks. Rate limits on task, project, and user creation prevent users from abusing the database, and user isolation ensures data privacy. Additionally, a scheduled cron job runs automatically to regularly purge stale demo accounts and their associated data from the system. The full API surface includes auth endpoints, project CRUD, and task CRUD with filtering by status, priority, and project, plus sorting and pagination.\n\nThe React frontend includes an authentication flow and a demo mode for exploring the full UI without creating an account. The demo mode operates entirely on local state when the backend isn't available, which is an affordance for situations that require graceful degradation. When a user signs in, the frontend sends the credentials to the backend, where the credentials are verified by the server and a signed JWT is issued. This lets the user see the Kanban board. Users can only access their own data, but they can create projects, organize tasks into To Do, In Progress, and Done columns, assign priorities, and set due dates.\n\nThe whole thing is deployed with CI/CD in mind. GitHub Actions runs the test suite on every push, the API lives on Railway with a managed PostgreSQL instance, and the frontend is on Vercel. Docker Compose handles local development. ",
    type: "Full-Stack",
    stack: ["React", "Flask", "PostgreSQL", "JWT", "Docker", "GitHub Actions"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/rest-api-microservice",
    liveUrl: "https://reginareynolds-task-manager.vercel.app",
    thumbnail: "/images/projects/rest-api-microservice.png",
  },
  {
    id: "iot-data-simulator",
    title: "IoT Data Simulator",
    description:
      "This is a real-time sensor data simulator with WebSocket streaming and live time-series visualization dashboards. It's inspired by the OEE monitoring system that I built while working at Harpak-ULMA Packaging. \n\nIt works by simulating sensor data and streaming it to the frontend in real-time. The frontend charts the sensor data in real-time as it's received. There is also a live alert system to detect any anomalies in the received data and display any warnings or critical alerts. Just like in real life, the lines can stop and start, and the OEE for each line is recalculated every second to reflect the most up-to-date information about the line's functioning. ",
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
    "I have kind of an odd background in that while a lot of what I do is on the more technical side, I also have pretty extensive 3D art experience. To demonstrate those capabilities, I created this interactive portfolio showcasing my 3D modeling and visualization work. Just like the interactive 3D model viewer, this portfolio is also built with Three.js and React Three Fiber, and it has an embedded WebGL model viewer. \n\nTake my models for a spin and check out the process breakdowns for each piece! ",
    type: "Static",
    stack: ["React", "Three.js", "Vite", "GitHub Pages"],
    githubUrl:
      "https://github.com/reginareynolds/programming-portfolio/tree/master/projects/art-portfolio",
    liveUrl: null,
    thumbnail: null,
  },
];

export default projects;
