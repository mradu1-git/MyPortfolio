/**
 * @typedef {Object} PipelineStep
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} tool
 */

/**
 * @typedef {Object} CICDConfig
 * @property {string} repoUrl
 * @property {string} workflowUrl
 * @property {string} deployTarget
 * @property {PipelineStep[]} steps
 */

/** @type {CICDConfig} */
export const cicd = {
  repoUrl: 'https://github.com/your-username/Portfolio',
  workflowUrl:
    'https://github.com/your-username/Portfolio/blob/main/.github/workflows/deploy.yml',
  deployTarget: 'Cloudflare Pages / Vercel',
  steps: [
    {
      id: 'lint',
      title: 'Lint & format',
      description: 'ESLint + Prettier on push — catch style issues before build.',
      tool: 'GitHub Actions',
    },
    {
      id: 'build',
      title: 'Build Astro site',
      description: 'Static export of pages, MDX blog posts, and optimized assets.',
      tool: 'astro build',
    },
    {
      id: 'docker',
      title: 'Docker build test',
      description: 'Multi-stage Alpine image build to verify container packaging.',
      tool: 'Docker',
    },
    {
      id: 'deploy',
      title: 'Deploy to edge',
      description: 'Push dist/ to Cloudflare Pages or Vercel on main branch merge.',
      tool: 'GitOps',
    },
  ],
};
