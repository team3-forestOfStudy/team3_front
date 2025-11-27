export default async function getStudyList(id) {
  const response = await fetch(`http://localhost:4000/api/studies/${id}`);
  const body = await response.json();
  return body;
}
