import axios from 'axios'

export async function getIpLocation() {
  const response = await axios.get('https://ipinfo.io/json')
  const [lat, lon] = response.data.loc.split(',')

  return {
    city: response.data.city,
    country: response.data.country,
    region: response.data.region,
    lat: Number(lat),
    lon: Number(lon),
  }
}
