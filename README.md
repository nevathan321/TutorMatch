<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TutorMatch: AI-Driven Tutor-Tutee Matching Platform</title>
</head>
<body>
    <header>
        <h1>TutorMatch: AI-Driven Tutor-Tutee Matching Platform 🎓</h1>
        <p>TutorMatch revolutionizes the way students find academic support by combining Tinder-style swiping with AI-powered matching, connecting learners with the perfect tutors based on courses, rates, and teaching styles.</p>
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License">
    </header>

  <section class="features">
        <h2>✨ Key Features</h2>
        <ul>
            <li><span>🔄 Swipe-to-Match Interface:</span> Intuitive left/right swiping to browse tutors</li>
            <li><span>🤖 AI Matching Algorithm:</span> GPT-4 powered suggestions based on GPA, subject expertise, and learning style</li>
            <li><span>💸 Dynamic Pricing System:</span> Tutor rates adjust automatically based on ratings (starts at minimum wage)</li>
            <li><span>📈 Performance Analytics:</span> Track match success rates and tutoring outcomes</li>
            <li><span>🌍 Multilingual Support:</span> Language preferences for both tutors and tutees</li>
            <li><span>🎓 Course-Specific Matching:</span> Focused on Mac courses with expandable subject database</li>
        </ul>
    </section>

  <section class="tech-stack">
        <h2>🛠️ Tech Stack</h2>
        <div class="stack-category">
            <h3>Frontend</h3>
            <p>React · JavaScript · Tailwind CSS · Framer Motion</p>
        </div>
        <div class="stack-category">
            <h3>Backend</h3>
            <p>Node.js · Express · PHP · MySQL</p>
        </div>
        <div class="stack-category">
            <h3>AI Integration</h3>
            <p>OpenAI API · Google Maps Integration</p>
        </div>
        <div class="stack-category">
            <h3>DevOps</h3>
            <p>GitHub Actions · Docker · Redis</p>
        </div>
    </section>

  <section class="getting-started">
        <h2>🚀 Getting Started</h2>
        <div class="prerequisites">
            <h3>Prerequisites</h3>
            <ul>
                <li>Node.js v18+</li>
                <li>PHP 8.1+</li>
                <li>MySQL 8.0+</li>
                <li>OpenAI API Key</li>
                <li>Google Cloud API Key</li>
            </ul>
        </div>
        <div class="installation">
            <h3>Installation</h3>
            <pre><code>git clone https://github.com/your-team/tutormatch.git && cd tutormatch

# Frontend Setup
cd client && npm install
cp .env.example .env.local

# Backend Setup
cd ../server && composer install
cp .env.example .env

# Database Initialization
mysql -u root -p < schema.sql

# Run Development Servers
npm run dev  # Frontend
php artisan serve  # Backend</code></pre>
        </div>
    </section>

  <footer>
        <div class="license">
            <h2>📄 License</h2>
            <p>Distributed under the MIT License. See <a href="LICENSE">LICENSE</a> for details.</p>
        </div>
        <div class="credits">
            <h3>💡 Innovation Credits</h3>
            <p>Sam Dovbenyuk (Client) · WebFusion Development Team</p>
            <p><a href="mailto:support@tutormatch.app">Contact Support</a> | <a href="https://docs.tutormatch.app">Visit Documentation</a></p>
        </div>
    </footer>

  <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 {
            color: #2d3748;
        }
        .features span {
            font-weight: bold;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .stack-category {
            margin-bottom: 20px;
        }
        footer {
            margin-top: 40px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</body>
</html>
