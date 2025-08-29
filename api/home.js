import { myRequest } from '../utils/api.js';

//banner
export function getBannerAdvertising() {
  return myRequest({
	url: '/activity/info?k=zouxinjs_agg',
	method: 'GET'
  })
}
