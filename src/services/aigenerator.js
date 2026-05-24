export const generatePortfolio = (profile, projects) => {
  // This simulates AI output (we replace with OpenAI later)

  const enhancedBio =
    profile.bio?.length > 0
      ? `${profile.bio} Passionate about building scalable web applications with modern technologies.`
      : `A passionate Full Stack Developer specializing in building modern, scalable web applications using React and Node.js.`;

  const enhancedProjects = projects.map((p) => ({
    ...p,
    desc:
      p.desc?.length > 0
        ? `${p.desc} Built with modern best practices and optimized for performance.`
        : `A well-designed project demonstrating strong problem-solving and development skills.`,
  }));

  const summary = `
${profile.name || "Developer"} is a ${profile.title || "Full Stack Developer"} with experience building modern web applications. Specializes in frontend/backend development and scalable systems.
  `;

  return {
    bio: enhancedBio,
    projects: enhancedProjects,
    summary,
  };
};