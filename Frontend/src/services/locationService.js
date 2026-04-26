import axios from "axios";

const API = "http://localhost:8080/api";

export const fetchCountries = async () => {
  const res = await axios.get(`${API}/countries`);
  return res.data;
};

export const fetchStates = async (countryId) => {
  const res = await axios.get(`${API}/states`, {
    params: { country: countryId },
  });
  return res.data;
};

export const fetchCities = async (countryId, stateId) => {
  const res = await axios.get(`${API}/cities`, {
    params: { country: countryId, state: stateId },
  });
  return res.data;
};