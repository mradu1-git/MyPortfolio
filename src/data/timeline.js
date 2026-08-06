/**                                                                                       
* @typedef {Object} TimelineItem                                                         
* @property {string} id                                                                  
* @property {string} date                                                                
* @property {string} title                                                               
* @property {string} description                                                         
*/                                                                                       
                                                                                            
/** @type {TimelineItem[]} */                                                             
export const timeline = [                                                                 
    {                                                                                       
    id: 'first-kde-pr',                                                                   
    date: '2024-06',                                                                      
    title: 'First KDE PR merged',                                                         
    description: 'Landed first contribution in the KDE/Qt ecosystem.',                    
    },                                                                                      
    {                                                                                       
    id: 'dockerize',                                                                      
    date: '2024-09',                                                                      
    title: 'Dockerizing apps',                                                            
    description: 'Containerized personal services with multi-stage Alpine builds.',       
    },                                                                                      
    {                                                                                       
    id: 'k8s-setup',                                                                      
    date: '2025-01',                                                                      
    title: 'Kubernetes cluster setup',                                                    
    description: 'Local Kind/Minikube cluster and first Deployment + Service manifests.', 
    },                                                                                      
    {                                                                                       
    id: 'gsoc',                                                                           
    date: '2025-05',                                                                      
    title: 'GSoC milestone',                                                              
    description: 'Placeholder for GSoC or mentorship milestones — update with your real dates.',                                                                                    
    },                                                                                      
]; 