// Simple skill database (can expand anytime)
const SKILLS = [
  "react",
  "node",
  "express",
  "mongodb",
  "javascript",
  "html",
  "css",
  "tailwind",
  "mysql",
  "java",
  "python",
  "c++",
  "aws",
  "docker",
  "git",
];

// Clean text
const normalize = (text) => text.toLowerCase();

// Extract skills from job description
const extractJobSkills = (jobDescription) => {
  const job = normalize(jobDescription);

  return SKILLS.filter((skill) => job.includes(skill));
};

// Analyze resume vs job
export const analyzeResume = (resumeText, jobDescription) => {
  const resume = normalize(resumeText);

  const jobSkills = extractJobSkills(jobDescription);

  const matchedSkills = jobSkills.filter((skill) =>
    resume.includes(skill)
  );

  const missingSkills = jobSkills.filter(
    (skill) => !resume.includes(skill)
  );

  const score =
    jobSkills.length === 0
      ? 0
      : Math.floor((matchedSkills.length / jobSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
    summary: generateSummary(score),
  };
};

// Summary generator
const generateSummary = (score) => {
  if (score >= 80) return "Excellent match 🚀";
  if (score >= 60) return "Good candidate 👍";
  if (score >= 40) return "Average match ⚡";
  return "Needs improvement ❗";
};