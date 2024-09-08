export const toPascalCase = (module: string )=>{
   return module
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
    .replace(/[\s_]+/g, ' ')             // Replace spaces and underscores with a single space
    .split(' ')                         // Split the string into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
    .join(''); 
}