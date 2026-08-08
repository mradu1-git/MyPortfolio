/**                                                                                       
* @typedef {Object} SocialLink                                                           
* @property {string} label                                                               
* @property {string} href                                                                
* @property {'github' | 'linkedin' | 'email'} id                                         
*/                                                                                       
                                                                                            
/**                                                                                       
* @typedef {Object} SiteConfig                                                           
* @property {string} name                                                                
* @property {string} title                                                               
* @property {string} bio                                                                 
* @property {string[]} badges                                                            
* @property {SocialLink[]} links                                                         
*/                                                                                       
                                                                                            
/** @type {SiteConfig} */                                                                 
export const site = {                                                                     
    name: 'Mradul Pal',                                                                     
    title: 'Mradul Pal — Open Source & Cloud-Native',                                       
    bio: 'Open-source contributor in the KDE/Qt ecosystem. Aspiring Cloud-Native/DevOps engineer focused on Kubernetes, GitOps, CI/CD, Go, Node.js, and REST APIs.',                
    badges: ['KDE Contributor', 'Go', 'Kubernetes', 'Node.js'],                             
    links: [                                                                                
    { id: 'github', label: 'GitHub', href: 'https://github.com/mradu1-git' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/your-username' }, 
    { id: 'email', label: 'Email', href: 'mailto:you@example.com' },                      
    ],                                                                                      
};     