async function deleteCar(id) {
  const respons = await fetch('/deleteCar/' + id, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (respons.status !== 201) // Deleted
    throw new Error(respons.status);
    window.location.href='/cars'
}