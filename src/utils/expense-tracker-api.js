import axios from 'axios';

const BASE_URL = 'https://api.mlab.com/api/1/databases/expense-tracker/collections/items?apiKey=1W1tqvCxoGyGvyM0tDQ2AipLCiFzEAS5';

export {getItemData, deleteData};

function deleteData() {
  return axios.delete(BASE_URL)
  .then(response =>
    response.json().then(json => {
      return json;
    })
  );
}

function getItemData() {
  const url =BASE_URL;
  return axios.get(url).then(response => response.data);
}
