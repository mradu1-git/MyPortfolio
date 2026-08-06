/**                                                                                       
* @typedef {Object} Project                                                              
* @property {string} id                                                                  
* @property {string} title                                                               
* @property {string} description                                                         
* @property {string[]} tech                                                              
* @property {string[]} deploy                                                            
* @property {string} [demoUrl]                                                           
* @property {string} sourceUrl                                                           
* @property {number} stars                                                               
* @property {number} forks                                                               
*/                                                                                       
                                                                                            
/** @type {Project[]} */                                                                  
export const projects = [                                                                 
    {                                                                                       
    id: 'kde-app',                                                                        
    title: 'KDE Desktop Utility',                                                         
    description: 'Qt/C++ utility contributing to the KDE desktop application ecosystem.', 
    tech: ['C++', 'Qt', 'KDE'],                                                           
    deploy: ['Flatpak'],                                                                  
    demoUrl: '',                                                                          
    sourceUrl: 'https://github.com/your-username/kde-app',                                
    stars: 12,                                                                            
    forks: 3,                                                                             
    },                                                                                      
    {                                                                                       
    id: 'go-api',                                                                         
    title: 'Go REST API Service',                                                         
    description: 'Lightweight REST API in Go with health checks and structured logging.', 
    tech: ['Go', 'REST API'],                                                             
    deploy: ['Docker', 'Kubernetes'],                                                     
    demoUrl: 'https://example.com',                                                       
    sourceUrl: 'https://github.com/your-username/go-api',                                 
    stars: 24,                                                                            
    forks: 5,                                                                             
    },                                                                                      
    {                                                                                       
    id: 'node-ms',                                                                        
    title: 'Node.js Microservice',                                                        
    description: 'Small Node.js service with CI/CD and containerized deployment.',        
    tech: ['Node.js', 'REST API'],                                                        
    deploy: ['Docker', 'Kubernetes'],                                                     
    demoUrl: 'https://example.com',                                                       
    sourceUrl: 'https://github.com/your-username/node-ms',                                
    stars: 18,                                                                            
    forks: 4,                                                                             
    },                                                                                      
];   