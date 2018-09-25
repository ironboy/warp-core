export default async function(path){
  return (await fetch(path)).json();
}