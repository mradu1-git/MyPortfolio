/**                                                                                       
* @typedef {'kde' | 'cncf' | 'other'} ContributionOrg                                    
* @typedef {'pr' | 'issue'} ContributionType                                             
*                                                                                        
* @typedef {Object} Contribution                                                         
* @property {string} id                                                                  
* @property {string} title                                                               
* @property {ContributionOrg} org                                                        
* @property {ContributionType} type                                                      
* @property {string} repo                                                                
* @property {string} url                                                                 
* @property {string} date                                                                
* @property {string} status                                                              
*/                                                                                       
                                                                                            
/** @type {Contribution[]} */                                                             
export const contributions = [                                                            
    {                                                                                       
    id: 'kde-pr-1',                                                                       
    title: 'Fix crash on empty config path',                                              
    org: 'kde',                                                                           
    type: 'pr',                                                                           
    repo: 'plasma-workspace',                                                             
    url: 'https://invent.kde.org/example/merge_requests/1',                               
    date: '2024-06-12',                                                                   
    status: 'merged',                                                                     
    },                                                                                      
    {                                                                                       
    id: 'kde-issue-1',                                                                    
    title: 'Improve accessibility labels in settings',                                    
    org: 'kde',                                                                           
    type: 'issue',                                                                        
    repo: 'systemsettings',                                                               
    url: 'https://bugs.kde.org/show_bug.cgi?id=1',                                        
    date: '2024-08-03',                                                                   
    status: 'open',                                                                       
    },                                                                                      
    {                                                                                       
    id: 'cncf-pr-1',                                                                      
    title: 'Docs: clarify GitOps rollout example',                                        
    org: 'cncf',                                                                          
    type: 'pr',                                                                           
    repo: 'sample-project',                                                               
    url: 'https://github.com/cncf/sample-project/pull/1',                                 
    date: '2025-01-20',                                                                   
    status: 'open',                                                                       
    },                                                                                      
];   